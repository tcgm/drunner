/**
 * Inventory actions module
 * Handles inventory management, equipment, consumables, and bank operations
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, Item, Consumable, ItemRarity } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { equipItem, unequipItem, sellItem } from '@/systems/loot/inventoryManager'
import { generateItem } from '@/systems/loot/lootGenerator'
import { isRarityAtOrBelow, RARITY_ORDER, getRarityIndex } from '@/systems/rarity/raritySystem'
import { selectConsumablesForAutofill } from '@/systems/consumables/consumableAutofill'
import { deduplicateItems } from '@/utils/itemDeduplication'
import { convertToV3 } from '@/utils/itemConverter'
import { hydrateItem } from '@/utils/itemHydration'
import { getActiveNexusUpgrades, getNexusBonus } from '@/data/nexus'
import { getMaterialById } from '@/data/items/materials'

export interface InventoryActionsSlice {
  equipItemToHero: (heroId: string, item: Item, slotId: string) => void
  unequipItemFromHero: (heroId: string, slotId: string) => Item | null
  sellItemForGold: (item: Item) => void
  addItemToDungeonInventory: (item: Item) => void
  purchasePotion: (potion: Consumable) => void
  spendBankGold: (amount: number) => boolean
  equipItemFromBank: (heroId: string, item: Item, slotId: string) => void
  autofillConsumables: (heroId: string) => void
  autofillDungeonConsumables: (heroId: string) => void
  moveItemToBank: (item: Item) => void
  removeItemFromBank: (itemId: string) => void
  expandBankStorage: (slots: number) => void
  keepOverflowItem: (itemId: string) => void
  discardOverflowItem: (itemId: string) => void
  discardItems: (itemIds: string[]) => void
  clearOverflow: () => void
  // Corrupted item resolution
  rerollCorruptedItem: (itemId: string) => void
  sellCorruptedForGold: (itemId: string) => void
  sellCorruptedForAlkahest: (itemId: string) => void
  deleteCorruptedItem: (itemId: string) => void
  // V2 item migration
  convertV2Item: (itemId: string, materialId: string, baseTemplateId: string) => void
  skipV2Item: (itemId: string) => void
  // Post-run cleanup
  finalizeRunItemTransfer: () => void
  // Forge
  breakDownItem: (itemId: string) => void
  forgeItem: (materialId: string, baseType: string, variantName: string, targetRarity: ItemRarity, useStash: boolean) => Item | null
  // Shifty Guy post-run bulk scrapper
  dismissShiftyGuy: () => void
  acceptShiftyGuyDeal: (
    rarityThreshold: ItemRarity,
    includeUnique: boolean,
    includeSet: boolean,
    includeMods: boolean
  ) => { itemsScrapped: number; alkahestGained: number; goldSpent: number }
}

export const createInventoryActions: StateCreator<
  GameState & InventoryActionsSlice,
  [],
  [],
  InventoryActionsSlice
> = (set, get) => ({
  equipItemToHero: (heroId, item, slotId) =>
    set((state) => {
      let replacedItem: Item | null = null

      const updatedParty = state.party.map(h => {
        if (h?.id === heroId) {
          const result = equipItem(h, item, slotId)
          if (result.replacedItem) {
            replacedItem = result.replacedItem
          }
          return result.hero
        }
        return h
      })
      
      const updatedRoster = state.heroRoster.map(h => {
        if (h.id === heroId) {
          const result = equipItem(h, item, slotId)
          return result.hero
        }
        return h
      })
      
      // Remove newly equipped item from dungeon inventory
      let updatedInventory = state.dungeon.inventory.filter(i => i.id !== item.id)
      
      // Add replaced item back to dungeon inventory
      if (replacedItem) {
        updatedInventory = [...updatedInventory, replacedItem]
      }

      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        dungeon: {
          ...state.dungeon,
          inventory: updatedInventory
        }
      }
    }),

  unequipItemFromHero: (heroId, slotId) => {
    let unequippedItem: Item | null = null
    
    set((state) => {
      const hero = state.party.find(h => h?.id === heroId)
      if (!hero) return state

      const result = unequipItem(hero, slotId)
      unequippedItem = result.item
      const updatedHero = result.hero

      return {
        party: state.party.map(h => h?.id === heroId ? updatedHero : h),
        heroRoster: state.heroRoster.map(h => h.id === heroId ? updatedHero : h)
      }
    })

    return unequippedItem
  },

  sellItemForGold: (item) =>
    set((state) => ({
      dungeon: {
        ...state.dungeon,
        gold: state.dungeon.gold + sellItem(item)
      }
    })),

  addItemToDungeonInventory: (item) =>
    set((state) => {
      // Check if item already exists in dungeon inventory
      const existingItem = state.dungeon.inventory.find(i => i.id === item.id)

      if (existingItem) {
        console.warn(`[Inventory] Duplicate item detected in dungeon inventory: ${item.id} (${item.name})`)
        // Don't add duplicate, but handle stacking for consumables
        if ('consumableType' in item && 'stackable' in item && item.stackable &&
          'consumableType' in existingItem && 'stackable' in existingItem && existingItem.stackable) {
          const consumable = existingItem as Consumable
          const newConsumable = item as Consumable
          consumable.stackCount = (consumable.stackCount || 1) + (newConsumable.stackCount || 1)
          return { dungeon: { ...state.dungeon, inventory: [...state.dungeon.inventory] } }
        }
        return state // Skip duplicate
      }

      return {
        dungeon: {
          ...state.dungeon,
          inventory: [...state.dungeon.inventory, item]
        }
      }
    }),

  purchasePotion: (potion) =>
    set((state) => {
      if (state.bankGold >= potion.value) {
        return {
          bankGold: state.bankGold - potion.value,
          bankInventory: [...state.bankInventory, potion]
        }
      }
      return state
    }),

  spendBankGold: (amount) => {
    const state = get()
    if (state.bankGold >= amount) {
      set({ bankGold: state.bankGold - amount })
      return true
    }
    return false
  },

  equipItemFromBank: (heroId, item, slotId) =>
    set((state) => {
      let replacedItem: Item | null = null
      
      const updatedParty = state.party.map(h => {
        if (h?.id === heroId) {
          const result = equipItem(h, item, slotId)
          if (result.replacedItem) {
            replacedItem = result.replacedItem
          }
          return result.hero
        }
        return h
      })
      
      const updatedRoster = state.heroRoster.map(h => {
        if (h.id === heroId) {
          const result = equipItem(h, item, slotId)
          return result.hero
        }
        return h
      })
      
      // Remove newly equipped item from bank
      let updatedBank = state.bankInventory.filter(i => i.id !== item.id)
      
      // Add replaced item back to bank
      if (replacedItem) {
        updatedBank = [...updatedBank, replacedItem]
      }

      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        bankInventory: updatedBank
      }
    }),

  autofillConsumables: (heroId) =>
    set((state) => {
      let updatedParty = state.party
      let updatedRoster = state.heroRoster
      let updatedBank = state.bankInventory
      
      const consumableSlots = ['consumable1', 'consumable2', 'consumable3']
      
      // First, unequip all existing consumables and return them to bank
      consumableSlots.forEach(slotId => {
        updatedParty = updatedParty.map(h => {
          if (h?.id === heroId) {
            const existingItem = h.slots[slotId]
            if (existingItem) {
              updatedBank = [...updatedBank, existingItem]
              return {
                ...h,
                slots: { ...h.slots, [slotId]: null }
              }
            }
          }
          return h
        })
        
        updatedRoster = updatedRoster.map(h => {
          if (h.id === heroId) {
            const existingItem = h.slots[slotId]
            if (existingItem) {
              return {
                ...h,
                slots: { ...h.slots, [slotId]: null }
              }
            }
          }
          return h
        })
      })
      
      // Get consumables from bank (now includes unequipped ones)
      const bankConsumables = updatedBank.filter(
        (item): item is Consumable => 'consumableType' in item
      )
      
      // Select best consumables
      const selectedConsumables = selectConsumablesForAutofill(bankConsumables)
      
      // Equip each consumable to the hero's consumable slots
      selectedConsumables.forEach((consumable, index) => {
        if (consumable) {
          const slotId = consumableSlots[index]
          let replacedItem: Item | null = null
          
          // Update party
          updatedParty = updatedParty.map(h => {
            if (h?.id === heroId) {
              const result = equipItem(h, consumable, slotId)
              if (result.replacedItem) {
                replacedItem = result.replacedItem
              }
              return result.hero
            }
            return h
          })
          
          // Update roster
          updatedRoster = updatedRoster.map(h => {
            if (h.id === heroId) {
              const result = equipItem(h, consumable, slotId)
              return result.hero
            }
            return h
          })
          
          // Remove equipped consumable from bank
          updatedBank = updatedBank.filter(i => i.id !== consumable.id)
          
          // Add replaced item back to bank
          if (replacedItem) {
            updatedBank = [...updatedBank, replacedItem]
          }
        }
      })
      
      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        bankInventory: updatedBank
      }
    }),

  autofillDungeonConsumables: (heroId) =>
    set((state) => {
      let updatedParty = state.party
      let updatedRoster = state.heroRoster
      let updatedDungeonInventory = state.dungeon.inventory
      
      const consumableSlots = ['consumable1', 'consumable2', 'consumable3']
      
      // First, unequip all existing consumables and return them to dungeon inventory
      consumableSlots.forEach(slotId => {
        updatedParty = updatedParty.map(h => {
          if (h?.id === heroId) {
            const existingItem = h.slots[slotId]
            if (existingItem) {
              updatedDungeonInventory = [...updatedDungeonInventory, existingItem]
              return {
                ...h,
                slots: { ...h.slots, [slotId]: null }
              }
            }
          }
          return h
        })
        
        updatedRoster = updatedRoster.map(h => {
          if (h.id === heroId) {
            const existingItem = h.slots[slotId]
            if (existingItem) {
              return {
                ...h,
                slots: { ...h.slots, [slotId]: null }
              }
            }
          }
          return h
        })
      })
      
      // Get consumables from dungeon inventory (now includes unequipped ones)
      const dungeonConsumables = updatedDungeonInventory.filter(
        (item): item is Consumable => 'consumableType' in item
      )
      
      // Select best consumables
      const selectedConsumables = selectConsumablesForAutofill(dungeonConsumables)
      
      selectedConsumables.forEach((consumable, index) => {
        if (consumable) {
          const slotId = consumableSlots[index]
          let replacedItem: Item | null = null
          
          // Update party
          updatedParty = updatedParty.map(h => {
            if (h?.id === heroId) {
              const result = equipItem(h, consumable, slotId)
              if (result.replacedItem) {
                replacedItem = result.replacedItem
              }
              return result.hero
            }
            return h
          })
          
          // Update roster
          updatedRoster = updatedRoster.map(h => {
            if (h.id === heroId) {
              const result = equipItem(h, consumable, slotId)
              return result.hero
            }
            return h
          })
          
          // Remove equipped consumable from dungeon inventory
          updatedDungeonInventory = updatedDungeonInventory.filter(i => i.id !== consumable.id)
          
          // Add replaced item back to dungeon inventory
          if (replacedItem) {
            updatedDungeonInventory = [...updatedDungeonInventory, replacedItem]
          }
        }
      })
      
      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        dungeon: {
          ...state.dungeon,
          inventory: updatedDungeonInventory
        }
      }
    }),

  moveItemToBank: (item) =>
    set((state) => {
      // Check if item already exists in bank
      const existingItem = state.bankInventory.find(i => i.id === item.id)

      if (existingItem) {
        console.warn(`[Inventory] Duplicate item detected in bank: ${item.id} (${item.name})`)
        // Don't add duplicate, but handle stacking for consumables
        if ('consumableType' in item && 'stackable' in item && item.stackable &&
          'consumableType' in existingItem && 'stackable' in existingItem && existingItem.stackable) {
          const consumable = existingItem as Consumable
          const newConsumable = item as Consumable
          consumable.stackCount = (consumable.stackCount || 1) + (newConsumable.stackCount || 1)
          return { bankInventory: [...state.bankInventory] }
        }
        return state // Skip duplicate
      }

      return {
        bankInventory: [...state.bankInventory, item]
      }
    }),

  removeItemFromBank: (itemId) =>
    set((state) => ({
      bankInventory: state.bankInventory.filter(i => i.id !== itemId)
    })),

  expandBankStorage: (slots) =>
    set((state) => {
      const costPerSlot = 50 // 50 gold per slot
      const totalCost = slots * costPerSlot

      if (state.bankGold >= totalCost) {
        return {
          bankStorageSlots: state.bankStorageSlots + slots,
          bankGold: state.bankGold - totalCost
        }
      }
      return {}
    }),

  keepOverflowItem: (itemId) =>
    set((state) => {
      const item = state.overflowInventory.find(i => i.id === itemId)
      if (!item) return {}

      const availableSlots = state.bankStorageSlots - state.bankInventory.length
      if (availableSlots > 0) {
        return {
          overflowInventory: state.overflowInventory.filter(i => i.id !== itemId),
          bankInventory: [...state.bankInventory, item]
        }
      }
      return {}
    }),

  discardOverflowItem: (itemId) =>
    set((state) => ({
      overflowInventory: state.overflowInventory.filter(i => i.id !== itemId)
    })),

  clearOverflow: () =>
    set({ overflowInventory: [] }),

  finalizeRunItemTransfer: () =>
    set((state) => {
      const allPendingItems = state.dungeon.inventory
      if (allPendingItems.length === 0) return {}

      // Pre-pass: extract material fragments and merge into stash
      const fragmentItems = allPendingItems.filter(item => item.type === 'material')
      const pendingItems = GAME_CONFIG.forge.materialFragment.autoMergeOnReturn
        ? allPendingItems.filter(item => item.type !== 'material')
        : allPendingItems

      const stashUpdate: Record<string, number> = { ...state.materialStash }
      if (GAME_CONFIG.forge.materialFragment.autoMergeOnReturn && fragmentItems.length > 0) {
        for (const frag of fragmentItems) {
          if (frag.materialId) {
            stashUpdate[frag.materialId] = (stashUpdate[frag.materialId] ?? 0) + 1
          }
        }
      }

      console.log(`[FinalizeRunItemTransfer] Distributing ${pendingItems.length} items to bank/overflow`)

      const availableSlots = state.bankStorageSlots - state.bankInventory.length
      const itemsToBank = pendingItems.slice(0, availableSlots)
      const itemsToOverflow = pendingItems.slice(availableSlots)

      const result: Partial<GameState> = {
        dungeon: {
          ...state.dungeon,
          inventory: [],
        },
        bankInventory: [...state.bankInventory, ...itemsToBank],
        lastRunItems: [],
        ...(Object.keys(stashUpdate).length > 0 ? { materialStash: stashUpdate } : {}),
      }

      if (itemsToOverflow.length > 0) {
        result.overflowInventory = [...state.overflowInventory, ...itemsToOverflow]
      }

      return result
    }),

  discardItems: (itemIds) =>
    set((state) => {
      const itemsToDiscard = state.bankInventory.filter(item => itemIds.includes(item.id))
      const totalValue = itemsToDiscard.reduce((sum, item) => sum + item.value, 0)
      const alkahestYieldBonus = 1 + getNexusBonus('alkahest_yield', getActiveNexusUpgrades()) / 100
      const alkahestGained = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate * alkahestYieldBonus)

      // Track discard stats if there's an active run
      const runUpdate = state.activeRun ? {
        itemsDiscarded: (state.activeRun.itemsDiscarded ?? 0) + itemsToDiscard.length,
        alkahestGained: (state.activeRun.alkahestGained ?? 0) + alkahestGained
      } : {}

      return {
        bankInventory: state.bankInventory.filter(item => !itemIds.includes(item.id)),
        alkahest: state.alkahest + alkahestGained,
        ...(state.activeRun ? { activeRun: { ...state.activeRun, ...runUpdate } } : {})
      }
    }),

  // Corrupted item resolution actions
  rerollCorruptedItem: (itemId) =>
    set((state) => {
      const corruptedItem = state.corruptedItems.find(item => item.id === itemId)
      if (!corruptedItem) return {}

      // Generate a new random item of the same rarity
      // Use floor 1 as base, rarity system will handle the appropriate stats
      const newItem = generateItem(1, corruptedItem.rarity, corruptedItem.type)

      return {
        corruptedItems: state.corruptedItems.filter(item => item.id !== itemId),
        bankInventory: [...state.bankInventory, newItem]
      }
    }),

  sellCorruptedForGold: (itemId) =>
    set((state) => {
      const corruptedItem = state.corruptedItems.find(item => item.id === itemId)
      if (!corruptedItem) return {}

      return {
        corruptedItems: state.corruptedItems.filter(item => item.id !== itemId),
        bankGold: state.bankGold + corruptedItem.value
      }
    }),

  sellCorruptedForAlkahest: (itemId) =>
    set((state) => {
      const corruptedItem = state.corruptedItems.find(item => item.id === itemId)
      if (!corruptedItem) return {}

      const alkahestYieldBonus = 1 + getNexusBonus('alkahest_yield', getActiveNexusUpgrades()) / 100
      const alkahestAmount = Math.floor(corruptedItem.value * GAME_CONFIG.items.alkahestConversionRate * alkahestYieldBonus)

      return {
        corruptedItems: state.corruptedItems.filter(item => item.id !== itemId),
        alkahest: state.alkahest + alkahestAmount
      }
    }),

  deleteCorruptedItem: (itemId) =>
    set((state) => ({
      corruptedItems: state.corruptedItems.filter(item => item.id !== itemId)
    })),

  convertV2Item: (itemId, materialId, baseTemplateId) =>
    set((state) => {
      const v2Item = state.v2Items.find(item => item.id === itemId)
      if (!v2Item) return {}

      // Try to convert using the automatic converter first
      const v3Item = convertToV3(v2Item)

      let updatedItem: Item

      if (v3Item) {
        // Conversion succeeded - hydrate the V3 item and mark it as V3
        updatedItem = hydrateItem(v3Item)
        updatedItem = { ...updatedItem, version: 3 } as Item & { version: 3 }
        console.log(`[V2 Migration] Auto-converted ${v2Item.name} (${v2Item.type}) to V3`)
      } else {
        // Conversion failed - this is a procedural item that needs manual metadata
        // Use the provided materialId and baseTemplateId
        updatedItem = {
          ...v2Item,
          materialId,
          baseTemplateId,
          version: 3, // Mark as V3 so it gets saved in V3 format
        } as Item & { version: 3 }
        console.log(`[V2 Migration] Manually converted procedural item ${v2Item.name}`)
      }

      const newState = {
        v2Items: state.v2Items.filter(item => item.id !== itemId),
        bankInventory: state.bankInventory.map(item =>
          item.id === itemId ? updatedItem as Item : item
        )
      }

      console.log(`[V2 Migration] Conversion complete. Remaining: ${newState.v2Items.length}`)

      return newState
    }),

  skipV2Item: (itemId) =>
    set((state) => ({
      v2Items: state.v2Items.filter(item => item.id !== itemId)
    })),

  dismissShiftyGuy: () =>
    set({ lastRunItems: [] }),

  acceptShiftyGuyDeal: (rarityThreshold, includeUnique, includeSet, includeMods) => {
    let result = { itemsScrapped: 0, alkahestGained: 0, goldSpent: 0 }

    set((state) => {
      // All items are still in dungeon.inventory at this point (Shifty Guy fires before distribution)
      const qualifies = (item: Item): boolean => {
        if (!isRarityAtOrBelow(item.rarity, rarityThreshold)) return false
        if (!includeUnique && item.isUnique) return false
        if (!includeSet && item.setId) return false
        if (!includeMods && item.modifiers && item.modifiers.length > 0) return false
        return true
      }

      const scrapped = state.dungeon.inventory.filter(qualifies)

      if (scrapped.length === 0) {
        result = { itemsScrapped: 0, alkahestGained: 0, goldSpent: 0 }
        return {}
      }

      const totalValue = scrapped.reduce((sum, item) => sum + (item.value ?? 0), 0)
      const alkahestYieldBonus = 1 + getNexusBonus('alkahest_yield', getActiveNexusUpgrades()) / 100
      const manualAlkahest = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate * alkahestYieldBonus)
      const alkahestGained = Math.floor(manualAlkahest * GAME_CONFIG.shiftyGuy.alkahestReturnPercent)
      const goldSpent = Math.floor(totalValue * GAME_CONFIG.shiftyGuy.goldCostPercent)

      result = { itemsScrapped: scrapped.length, alkahestGained, goldSpent }

      const scrappedIds = new Set(scrapped.map(i => i.id))

      return {
        dungeon: {
          ...state.dungeon,
          inventory: state.dungeon.inventory.filter(i => !scrappedIds.has(i.id)),
        },
        alkahest: state.alkahest + alkahestGained,
        bankGold: Math.max(0, state.bankGold - goldSpent),
      }
    })

    return result
  },

  breakDownItem: (itemId) =>
    set((state) => {
      if (!GAME_CONFIG.forge.breakdown.enabled) return {}

      const item = state.bankInventory.find(i => i.id === itemId)
      if (!item || !item.materialId) return {}

      const material = getMaterialById(item.materialId)
      if (!material) return {}

      const baseCharge = GAME_CONFIG.forge.breakdown.chargePerRarity[item.rarity] ?? 0
      if (baseCharge === 0) return {}

      const isUnique = !!(item.isUnique && !item.setId)
      const isSet = !!item.setId
      const uniqueMult = isUnique ? GAME_CONFIG.forge.breakdown.uniqueBreakdownMultiplier : 1
      const setMult = isSet ? GAME_CONFIG.forge.breakdown.setBreakdownMultiplier : 1
      const nexusBonus = 1 + getNexusBonus(GAME_CONFIG.forge.breakdown.nexusUpgradeId, getActiveNexusUpgrades()) / 100

      const charge = Math.floor(baseCharge * uniqueMult * setMult * nexusBonus)

      const currentCharge = state.materialChargeProgress[material.id] ?? 0
      const newCharge = currentCharge + charge
      const threshold = GAME_CONFIG.forge.breakdown.thresholdByRarity[material.rarity] ?? null

      const newStash = { ...state.materialStash }
      let finalCharge = newCharge
      if (threshold !== null && newCharge >= threshold) {
        const fragmentsEarned = Math.floor(newCharge / threshold)
        finalCharge = GAME_CONFIG.forge.breakdown.carryOverExcess ? newCharge % threshold : 0
        newStash[material.id] = (newStash[material.id] ?? 0) + fragmentsEarned
      }

      return {
        bankInventory: state.bankInventory.filter(i => i.id !== itemId),
        materialChargeProgress: {
          ...state.materialChargeProgress,
          [material.id]: finalCharge,
        },
        materialStash: newStash,
      }
    }),

  forgeItem: (materialId, baseType, variantName, targetRarity, useStash) => {
    const state = get()
    if (!materialId || !baseType || !targetRarity) return null

    const material = getMaterialById(materialId)
    if (!material) return null

    // Inline alkahest cost calculation (mirrors forgeSystem.getAlkahestCost)
    const { baseCost, stashCostMultiplier, elevation: { elevationBase } } = GAME_CONFIG.forge
    const nativeIndex = getRarityIndex(material.rarity)
    const targetIndex = getRarityIndex(targetRarity)
    const steps = Math.max(0, targetIndex - nativeIndex)
    const cost = Math.ceil(baseCost * Math.pow(elevationBase, steps) * (useStash ? stashCostMultiplier : 1))

    if (state.alkahest < cost) return null
    if (useStash && (state.materialStash[materialId] ?? 0) < 1) return null

    // Generate item with forced type, rarity, and material
    const newItem = generateItem(
      state.dungeon.floor || 1,
      baseType as import('@/types').ItemSlot,
      targetRarity,
      targetRarity,
      0,
      materialId
    )

    const newStash = useStash
      ? { ...state.materialStash, [materialId]: Math.max(0, (state.materialStash[materialId] ?? 0) - 1) }
      : state.materialStash

    set({
      alkahest: state.alkahest - cost,
      bankInventory: [...state.bankInventory, newItem],
      materialStash: newStash,
    })

    return newItem
  },
})

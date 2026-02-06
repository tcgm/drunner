/**
 * Inventory actions module
 * Handles inventory management, equipment, consumables, and bank operations
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, Item, Consumable } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { equipItem, unequipItem, sellItem } from '@/systems/loot/inventoryManager'
import { generateItem } from '@/systems/loot/lootGenerator'
import { selectConsumablesForAutofill } from '@/systems/consumables/consumableAutofill'
import { deduplicateItems } from '@/utils/itemDeduplication'

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
}

export const createInventoryActions: StateCreator<
  GameState & InventoryActionsSlice,
  [],
  [],
  InventoryActionsSlice
> = (set, get) => ({
  equipItemToHero: (heroId, item, slotId) =>
    set((state) => {

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

  discardItems: (itemIds) =>
    set((state) => {
      const itemsToDiscard = state.bankInventory.filter(item => itemIds.includes(item.id))
      const totalValue = itemsToDiscard.reduce((sum, item) => sum + item.value, 0)
      const alkahestGained = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate)

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

      const alkahestAmount = Math.floor(corruptedItem.value * GAME_CONFIG.items.alkahestConversionRate)

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

      // Extract base name from full item name
      const material = state.bankInventory.find(i => i.materialId === materialId)
      // For now, keep the original item but mark it with updated metadata
      const updatedItem = {
        ...v2Item,
        materialId,
        baseTemplateId,
        version: undefined, // Remove version field to make it a proper Item
      }

      const newState = {
        v2Items: state.v2Items.filter(item => item.id !== itemId),
        bankInventory: state.bankInventory.map(item =>
          item.id === itemId ? updatedItem as Item : item
        )
      }

      console.log(`[V2 Migration] Converted item ${v2Item.name}. Remaining: ${newState.v2Items.length}`)

      return newState
    }),

  skipV2Item: (itemId) =>
    set((state) => ({
      v2Items: state.v2Items.filter(item => item.id !== itemId)
    })),
})

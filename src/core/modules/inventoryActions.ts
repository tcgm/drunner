/**
 * Inventory actions module
 * Handles inventory management, equipment, consumables, and bank operations
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, Item, Consumable } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { equipItem, unequipItem, sellItem } from '@/systems/loot/inventoryManager'
import { selectConsumablesForAutofill } from '@/systems/consumables/consumableAutofill'

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
    set((state) => ({
      dungeon: {
        ...state.dungeon,
        inventory: [...state.dungeon.inventory, item]
      }
    })),

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
    set((state) => ({
      bankInventory: [...state.bankInventory, item]
    })),

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
})

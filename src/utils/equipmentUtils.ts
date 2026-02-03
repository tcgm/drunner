import type { Item } from '@/types'
import { getSlotById } from '@/config/slotConfig'

/**
 * Check if there's an upgrade available for a slot
 */
export function hasUpgradeAvailable(
  slotId: string,
  currentItem: Item | null,
  availableItems: Item[],
  currentEquipment?: Record<string, Item | null>
): boolean {
  if (!currentItem) return false
  
  // Don't show upgrade indicator for unique items
  if (currentItem.isUnique) return false
  
  const slotDef = getSlotById(slotId)
  if (!slotDef) return false
  
  // Get IDs of items currently equipped in other slots
  const equippedItemIds = new Set<string>()
  if (currentEquipment) {
    Object.entries(currentEquipment).forEach(([slot, item]) => {
      // Skip the current slot we're checking
      if (slot !== slotId && item) {
        equippedItemIds.add(item.id)
      }
    })
  }
  
  // Check for any upgrade
  return availableItems.some(invItem => {
    // Skip items that are already equipped in other slots
    if (equippedItemIds.has(invItem.id)) return false
    
    // Check if item is compatible with slot
    const isCompatible = 
      invItem.type === slotDef.type || 
      (slotDef.type === 'accessory' && (invItem.type === 'accessory1' || invItem.type === 'accessory2' || invItem.type === 'accessory')) ||
      (slotDef.category === 'consumable' && invItem.type === 'consumable')
    
    if (!isCompatible) return false
    
    // Check if any stat is higher
    if (!invItem.stats || !currentItem.stats) return false
    
    return Object.entries(invItem.stats).some(([stat, value]) => {
      const currentValue = currentItem.stats?.[stat as keyof typeof currentItem.stats]
      return currentValue !== undefined && value !== undefined && value > currentValue
    })
  })
}

/**
 * Check if there are compatible items available for swapping
 */
export function hasCompatibleItems(
  slotId: string,
  availableItems: Item[],
  currentEquipment?: Record<string, Item | null>
): boolean {
  const slotDef = getSlotById(slotId)
  if (!slotDef) return false
  
  // Get IDs of items currently equipped in other slots
  const equippedItemIds = new Set<string>()
  if (currentEquipment) {
    Object.entries(currentEquipment).forEach(([slot, item]) => {
      // Skip the current slot we're checking
      if (slot !== slotId && item) {
        equippedItemIds.add(item.id)
      }
    })
  }
  
  return availableItems.some(i => {
    // Skip items that are already equipped in other slots
    if (equippedItemIds.has(i.id)) return false
    
    if (i.type === slotDef.type) return true
    // accessory slots can accept accessory items
    if (slotDef.type === 'accessory' && (i.type === 'accessory1' || i.type === 'accessory2' || i.type === 'accessory')) return true
    // consumable slots accept consumable items
    if (slotDef.category === 'consumable' && i.type === 'consumable') return true
    return false
  })
}

/**
 * Check if an item is compatible with a slot
 */
export function isItemCompatibleWithSlot(item: Item, slotId: string): boolean {
  const slotDef = getSlotById(slotId)
  if (!slotDef) return false
  
  if (item.type === slotDef.type) return true
  // accessory slots can accept accessory items
  if (slotDef.type === 'accessory' && (item.type === 'accessory1' || item.type === 'accessory2' || item.type === 'accessory')) return true
  // consumable slots accept consumable items
  if (slotDef.category === 'consumable' && item.type === 'consumable') return true
  return false
}

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
      (slotDef.type === 'accessory' && (invItem.type === 'accessory1' || invItem.type === 'accessory2')) ||
      (slotDef.category === 'consumable' && invItem.type === 'consumable')
    
    if (!isCompatible) return false
    
    // Calculate total stat value for comparison
    // This prevents showing items as upgrades when they're actually sidegrades/downgrades
    if (!invItem.stats || !currentItem.stats) return false
    
    const getTotalStatValue = (stats: Partial<Record<string, number>>): number => {
      return Object.values(stats).reduce<number>((sum, val) => sum + (val || 0), 0)
    }
    
    const invItemTotal = getTotalStatValue(invItem.stats)
    const currentItemTotal = getTotalStatValue(currentItem.stats)
    
    // Only consider it an upgrade if the total stat value is higher
    return invItemTotal > currentItemTotal
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
    if (slotDef.type === 'accessory' && (i.type === 'accessory1' || i.type === 'accessory2')) return true
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
  if (slotDef.type === 'accessory' && (item.type === 'accessory1' || item.type === 'accessory2')) return true
  // consumable slots accept consumable items
  if (slotDef.category === 'consumable' && item.type === 'consumable') return true
  return false
}

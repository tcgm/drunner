import type { Item, ItemSlot } from '@/types'

/**
 * Check if there's an upgrade available for a slot
 */
export function hasUpgradeAvailable(
  slot: ItemSlot,
  currentItem: Item | null,
  availableItems: Item[]
): boolean {
  if (!currentItem) return false
  
  // Don't show upgrade indicator for unique items
  if (currentItem.isUnique) return false
  
  return availableItems.some(invItem => {
    // Check if item is compatible with slot
    const isCompatible = 
      invItem.type === slot || 
      ((slot === 'accessory1' || slot === 'accessory2') && (invItem.type === 'accessory1' || invItem.type === 'accessory2'))
    
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
  slot: ItemSlot,
  availableItems: Item[]
): boolean {
  return availableItems.some(i => {
    if (i.type === slot) return true
    // accessory1 and accessory2 can swap with each other
    if ((slot === 'accessory1' || slot === 'accessory2') && (i.type === 'accessory1' || i.type === 'accessory2')) return true
    return false
  })
}

/**
 * Check if an item is compatible with a slot
 */
export function isItemCompatibleWithSlot(item: Item, slot: ItemSlot): boolean {
  if (item.type === slot) return true
  // accessory1 and accessory2 can swap with each other
  if ((slot === 'accessory1' || slot === 'accessory2') && (item.type === 'accessory1' || item.type === 'accessory2')) return true
  return false
}

import type { Item } from '@/types'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'

/**
 * Restore icon for unique/set items after deserialization
 * Icons are React components and can't be serialized to localStorage,
 * so we need to look them up from the templates
 */
export function restoreItemIcon(item: Item): Item {
  // Skip if item already has an icon
  if (item.icon) return item

  // Check if it's a unique item
  if (item.isUnique) {
    const template = ALL_UNIQUE_ITEMS.find(t => t.name === item.name)
    if (template?.icon) {
      return { ...item, icon: template.icon }
    }
  }

  // Check if it's a set item
  if (item.setId || item.rarity === 'set') {
    const template = ALL_SET_ITEMS.find(t => t.name === item.name)
    if (template?.icon) {
      return { ...item, icon: template.icon }
    }
  }

  return item
}

/**
 * Restore icons for an array of items
 */
export function restoreItemIcons(items: Item[]): Item[] {
  return items.map(restoreItemIcon)
}

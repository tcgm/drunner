import type { Item } from '@/types'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { allBases } from '@/data/items/bases'

/**
 * Restore icon for unique/set items after deserialization
 * Icons are React components and can't be serialized to localStorage,
 * so we need to look them up from the templates
 */
export function restoreItemIcon(item: Item): Item {
  // Skip if item already has an icon
  if (item.icon !== undefined) return item

  // Check if it's a unique item
  if (item.isUnique) {
    const template = ALL_UNIQUE_ITEMS.find(t => t.name === item.name)
    if (template?.icon) {
      return { ...item, icon: template.icon }
    }
  }

  // Check if it's a set item
  if (item.setId) {
    const template = ALL_SET_ITEMS.find(t => t.name === item.name)
    if (template?.icon) {
      return { ...item, icon: template.icon }
    }
  }

  // Check if it's a procedural item with base template
  if (item.baseTemplateId) {
    // baseTemplateId format: "type_keyword" (e.g., "weapon_sword")
    const [_, keyword] = item.baseTemplateId.split('_')
    const template = allBases.find(b => 
      b.description.toLowerCase().includes(keyword?.toLowerCase() || '') ||
      b.baseNames?.some(name => name.toLowerCase().includes(keyword?.toLowerCase() || ''))
    )
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

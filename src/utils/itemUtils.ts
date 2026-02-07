import type { Item } from '@/types'
import { ALL_UNIQUE_ITEMS } from '@/data/items/uniques'
import { ALL_SET_ITEMS } from '@/data/items/sets'
import { allBases } from '@/data/items/bases'
import { ALL_CONSUMABLE_BASES, getConsumableBaseById } from '@/data/consumables/bases'
import { ALL_MATERIALS } from '@/data/items/materials'

/**
 * Restore icon for unique/set items after deserialization
 * Icons are React components and can't be serialized to localStorage,
 * so we need to look them up from the templates
 */
export function restoreItemIcon(item: Item): Item {
  // For procedural items (items with materialId), always restore icons
  // This fixes both old V2 items and items with wrong icons stored
  const isProceduralItem = !item.isUnique && !item.setId && item.materialId
  
  // Check if icon is valid (not undefined, not null, not empty object)
  const hasValidIcon = item.icon && 
    typeof item.icon === 'function' && 
    !(typeof item.icon === 'object' && Object.keys(item.icon).length === 0)
  
  // For non-procedural items, skip if icon already exists and is valid
  if (hasValidIcon && !isProceduralItem) {
    return item
  }

  // Check if it's a consumable item
  if (item.type === 'consumable' && 'baseId' in item) {
    const base = getConsumableBaseById(item.baseId as string)
    if (base?.icon) {
      return { ...item, icon: base.icon }
    }
  }

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
    // baseTemplateId format: "type.id" (V3) or "type_keyword" (V2)
    const separator = item.baseTemplateId.includes('.') ? '.' : '_'
    const [type, keyword] = item.baseTemplateId.split(separator)
    
    // Ignore useless keywords like "a", "an", "the"
    const isUselessKeyword = !keyword || keyword.length <= 2 || ['a', 'an', 'the'].includes(keyword)
    
    if (isUselessKeyword) {
      // Bad keyword - parse item name to extract material and base name
      
      // Try to find material prefix in item name
      const material = ALL_MATERIALS.find(m => 
        item.name.toLowerCase().startsWith(m.prefix.toLowerCase() + ' ')
      )
      
      if (material) {
        // Extract base name (everything after material prefix)
        const baseName = item.name.substring(material.prefix.length + 1).trim()
        
        // Find template by type and baseName match
        const template = allBases.find(b => {
          if (b.type !== type) return false
          
          // Check baseNames variants (case insensitive)
          if (b.baseNames) {
            if (b.baseNames.some(name => name.toLowerCase() === baseName.toLowerCase())) {
              return true
            }
          }
          
          // Check regular name match (first word of description)
          const templateName = b.description.split(' ')[0]
          if (templateName.toLowerCase() === baseName.toLowerCase()) {
            return true
          }
          
          return false
        })
        
        if (template) {
          // Fix the baseTemplateId for future loads
          const fixedKeyword = baseName.toLowerCase().replace(/\s+/g, '_')
          const fixedItem = { ...item, baseTemplateId: `${type}_${fixedKeyword}` }
          
          // Check for specific baseName icon
          if (template.baseNameIcons && template.baseNames) {
            const matchingBaseName = template.baseNames.find(name => 
              name.toLowerCase() === baseName.toLowerCase()
            )
            if (matchingBaseName) {
              const specificIcon = template.baseNameIcons[matchingBaseName]
              if (specificIcon) {
                return { ...fixedItem, icon: specificIcon }
              }
            }
          }
          
          // Use template default icon
          if (template.icon) {
            return { ...fixedItem, icon: template.icon }
          }
        }
      }
      
      // Fallback: match by type only
      const template = allBases.find(b => b.type === type)
      if (template?.icon) {
        return { ...item, icon: template.icon }
      }
    } else {
      // Good keyword - match by description/baseNames
      const template = allBases.find(b => 
        b.type === type &&
        (b.description.toLowerCase().includes(keyword.toLowerCase()) ||
         b.baseNames?.some(name => name.toLowerCase().includes(keyword.toLowerCase())))
      )
      if (template) {
        // Check if the template has specific icons for baseNames
        if (template.baseNameIcons && template.baseNames) {
          // Try to find which baseName this item uses by checking the item name
          for (const baseName of template.baseNames) {
            if (item.name.toLowerCase().includes(baseName.toLowerCase())) {
              const specificIcon = template.baseNameIcons[baseName]
              if (specificIcon) {
                return { ...item, icon: specificIcon }
              }
            }
          }
        }
        // Fall back to default icon
        if (template.icon) {
          return { ...item, icon: template.icon }
        }
      }
    }
  } else if (isProceduralItem) {
    // V2 procedural items without baseTemplateId - try to match by name for items with baseNames
    for (const template of allBases) {
      if (template.baseNameIcons && template.baseNames) {
        for (const baseName of template.baseNames) {
          // Check if item name ends with this baseName (to match "Adamantine Pipe" with "Pipe")
          const namePattern = new RegExp(`\\b${baseName}$`, 'i')
          if (namePattern.test(item.name)) {
            const specificIcon = template.baseNameIcons[baseName]
            if (specificIcon) {
              return { ...item, icon: specificIcon }
            }
          }
        }
      }
    }
    
    // Last resort: try to match by materialId if present
    if (item.materialId && item.type) {
      // Find template by type that matches
      const template = allBases.find(b => b.type === item.type)
      if (template?.icon) {
        return { ...item, icon: template.icon }
      }
    }
    
    console.warn(`[Icon] Failed to restore V2 item: ${item.name} (type: ${item.type})`)
  }

  return item
}

/**
 * Restore icons for an array of items
 */
export function restoreItemIcons(items: Item[]): Item[] {
  return items.map(restoreItemIcon)
}

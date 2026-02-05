import { useMemo } from 'react'
import type { Item, Consumable } from '@/types'

export function useItemsByType(items: Item[]) {
  return useMemo(() => {
    const grouped: Record<string, Item[]> = {
      all: items,
      weapon: [],
      armor: [],
      helmet: [],
      boots: [],
      accessories: [],
      consumables: [],
    }

    items.forEach(item => {
      if (item.type === 'weapon') grouped.weapon.push(item)
      else if (item.type === 'armor') grouped.armor.push(item)
      else if (item.type === 'helmet') grouped.helmet.push(item)
      else if (item.type === 'boots') grouped.boots.push(item)
      else if (item.type === 'accessory1' || item.type === 'accessory2') grouped.accessories.push(item)
      else if (item.type === 'consumable' || 'consumableType' in item) grouped.consumables.push(item)
    })

    return grouped
  }, [items])
}

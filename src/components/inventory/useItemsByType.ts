import { useMemo } from 'react'
import type { Item } from '@/types'

export function useItemsByType(items: Item[]) {
  return useMemo(() => {
    const grouped: Record<string, Item[]> = {
      all: items,
      weapon: [],
      armor: [],
      helmet: [],
      boots: [],
      accessories: [],
    }

    items.forEach(item => {
      if (item.type === 'weapon') grouped.weapon.push(item)
      else if (item.type === 'armor') grouped.armor.push(item)
      else if (item.type === 'helmet') grouped.helmet.push(item)
      else if (item.type === 'boots') grouped.boots.push(item)
      else if (item.type === 'accessory1' || item.type === 'accessory2') grouped.accessories.push(item)
    })

    return grouped
  }, [items])
}

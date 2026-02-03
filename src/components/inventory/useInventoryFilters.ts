import { useMemo } from 'react'
import type { Item, ItemRarity } from '@/types'
import type { SortOption, FilterOption } from './InventoryControls'
import { slotAcceptsItemType } from '@/config/slotConfig'

interface UseInventoryFiltersProps {
  items: Item[]
  searchQuery: string
  sortBy: SortOption
  filterBy?: FilterOption
  pendingSlot?: string | null
}

export function useInventoryFilters({
  items,
  searchQuery,
  sortBy,
  filterBy,
  pendingSlot
}: UseInventoryFiltersProps) {
  return useMemo(() => {
    const rarityOrder: Record<ItemRarity, number> = {
      junk: 0,
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythic: 6,
      artifact: 7,
      set: 9,
    }
    
    let filteredItems = [...items]

    // Apply pending slot filter first (overrides other filters)
    if (pendingSlot) {
      // Use proper slot compatibility check for accessories and other special slots
      filteredItems = filteredItems.filter(item => slotAcceptsItemType(pendingSlot, item.type))
    } else if (filterBy && filterBy !== 'all') {
      filteredItems = filteredItems.filter(item => item.type === filterBy)
    }

    // Apply search
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sort
    filteredItems.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rarity':
          return rarityOrder[b.rarity] - rarityOrder[a.rarity] // Descending
        case 'type':
          return a.type.localeCompare(b.type)
        case 'value':
          return b.value - a.value // Descending
        default:
          return 0
      }
    })

    return filteredItems
  }, [items, pendingSlot, filterBy, searchQuery, sortBy])
}

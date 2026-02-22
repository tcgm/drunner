import { useMemo } from 'react'
import type { Item, ItemRarity } from '@/types'
import type { SortOption, FilterOption } from './InventoryControls'
import { slotAcceptsItemType } from '@/config/slotConfig'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'

// Derive rarity sort order from RARITY_CONFIGS (insertion order = tier order)
const RARITY_SORT_ORDER = Object.fromEntries(
  Object.keys(RARITY_CONFIGS).map((rarity, index) => [rarity, index])
) as Record<ItemRarity, number>

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
    let filteredItems = [...items]

    // Apply pending slot filter first (overrides other filters)
    if (pendingSlot) {
      // Use proper slot compatibility check for accessories and other special slots
      filteredItems = filteredItems.filter(item => slotAcceptsItemType(pendingSlot, item.type))
    } else if (filterBy && filterBy !== 'all') {
      // Special handling for consumables (check for consumableType property)
      if (filterBy === 'consumable') {
        filteredItems = filteredItems.filter(item => item.type === 'consumable' || 'consumableType' in item)
      } else {
        filteredItems = filteredItems.filter(item => item.type === filterBy)
      }
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
          return (RARITY_SORT_ORDER[b.rarity] ?? -1) - (RARITY_SORT_ORDER[a.rarity] ?? -1) // Descending
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

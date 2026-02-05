import { HStack, Input, Select, Spacer } from '@chakra-ui/react'
import { memo } from 'react'

export type SortOption = 'name' | 'rarity' | 'type' | 'value'
export type FilterOption = 'all' | 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2' | 'consumable'

interface InventoryControlsProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: SortOption
  onSortChange: (value: SortOption) => void
  filterBy?: FilterOption
  onFilterChange?: (value: FilterOption) => void
  showFilter?: boolean
  rightContent?: React.ReactNode
}

export const InventoryControls = memo(function InventoryControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  showFilter = false,
  rightContent
}: InventoryControlsProps) {
  return (
    <HStack className="inventory-controls" w="full" spacing={2}>
      <Input
        className="inventory-search"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="sm"
        bg="gray.800"
        borderColor="gray.700"
        _hover={{ borderColor: 'gray.600' }}
        maxW="300px"
      />
      
      <Select
        className="inventory-sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        size="sm"
        bg="gray.800"
        borderColor="gray.700"
        maxW="150px"
      >
        <option value="rarity">Sort: Rarity</option>
        <option value="name">Sort: Name</option>
        <option value="type">Sort: Type</option>
        <option value="value">Sort: Value</option>
      </Select>

      {showFilter && filterBy && onFilterChange && (
        <Select
          className="inventory-filter"
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
          size="sm"
          bg="gray.800"
          borderColor="gray.700"
          maxW="150px"
        >
          <option value="all">All Items</option>
          <option value="weapon">Weapons</option>
          <option value="armor">Armor</option>
          <option value="helmet">Helmets</option>
          <option value="boots">Boots</option>
          <option value="accessory1">Accessories</option>
          <option value="consumable">Consumables</option>
        </Select>
      )}

      <Spacer />

      {rightContent}
    </HStack>
  )
})

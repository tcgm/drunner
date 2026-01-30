import { Box } from '@chakra-ui/react'
import { useMemo, memo, useCallback } from 'react'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

interface ItemGridProps {
  items: Item[]
  visibleCount: number
  selectedItems?: Set<string>
  onItemClick?: (item: Item) => void
  onItemSelect?: (itemId: string) => void
  isClickable?: boolean
  showCheckbox?: boolean
}

interface ItemGridSlotProps {
  item: Item
  itemId: string
  isSelected: boolean
  isClickable: boolean
  showCheckbox: boolean
}

// Store global handlers to avoid prop changes
const globalHandlers = {
  onItemClick: null as ((item: Item) => void) | null,
  onItemSelect: null as ((itemId: string) => void) | null
}

// Memoize individual item slots to prevent re-rendering all items on selection change
const ItemGridSlot = memo(function ItemGridSlot({ 
  item,
  itemId,
  isSelected,
  isClickable,
  showCheckbox 
}: ItemGridSlotProps) {
  const handleCheckboxChange = useCallback(() => {
    globalHandlers.onItemSelect?.(itemId)
  }, [itemId])

  const handleItemClick = useCallback(() => {
    globalHandlers.onItemClick?.(item)
  }, [item])

  return (
    <Box
      className="item-grid-slot"
      position="relative"
      borderWidth="2px"
      borderColor={isSelected ? 'blue.400' : 'transparent'}
      borderRadius="sm"
      cursor={isClickable ? 'pointer' : 'default'}
      w="80px"
      h="80px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ItemSlot
        item={item}
        size="md"
        onClick={globalHandlers.onItemClick ? handleItemClick : undefined}
        isClickable={isClickable}
        showCheckbox={showCheckbox}
        isSelected={isSelected}
        onCheckboxChange={handleCheckboxChange}
      />
    </Box>
  )
}, (prev, next) => {
  // Only re-render if selection state or item ID changes
  return prev.itemId === next.itemId && 
         prev.isSelected === next.isSelected &&
         prev.isClickable === next.isClickable &&
         prev.showCheckbox === next.showCheckbox
})

export const ItemGrid = memo(function ItemGrid({ 
  items, 
  visibleCount, 
  selectedItems, 
  onItemClick,
  onItemSelect,
  isClickable = false,
  showCheckbox = false 
}: ItemGridProps) {
  // Update global handlers
  globalHandlers.onItemClick = onItemClick || null
  globalHandlers.onItemSelect = onItemSelect || null

  // Memoize visible items with restored icons to prevent recalculating on every render
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount).map(item => restoreItemIcon(item))
  }, [items, visibleCount])
  
  return (
    <Box
      className="item-grid"
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 80px)"
      gap="8px"
      justifyContent="start"
    >
      {visibleItems.map((item) => (
        <ItemGridSlot
          key={item.id}
          item={item}
          itemId={item.id}
          isSelected={selectedItems?.has(item.id) ?? false}
          isClickable={isClickable}
          showCheckbox={showCheckbox}
        />
      ))}
    </Box>
  )
})

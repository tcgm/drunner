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
  onItemClick?: (item: Item) => void
  onItemSelect?: (itemId: string) => void
}

// Memoize individual item slots to prevent re-rendering all items on selection change
const ItemGridSlot = memo(function ItemGridSlot({ 
  item,
  itemId,
  isSelected,
  isClickable,
  showCheckbox,
  onItemClick,
  onItemSelect
}: ItemGridSlotProps) {
  const handleCheckboxChange = useCallback(() => {
    onItemSelect?.(itemId)
  }, [itemId, onItemSelect])

  const handleItemClick = useCallback(() => {
    onItemClick?.(item)
  }, [item, onItemClick])

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
        onClick={onItemClick ? handleItemClick : undefined}
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
         prev.showCheckbox === next.showCheckbox &&
         prev.onItemClick === next.onItemClick &&
         prev.onItemSelect === next.onItemSelect
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
          onItemClick={onItemClick}
          onItemSelect={onItemSelect}
        />
      ))}
    </Box>
  )
})

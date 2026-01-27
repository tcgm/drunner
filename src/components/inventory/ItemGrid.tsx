import { Box, Checkbox } from '@chakra-ui/react'
import { useMemo, memo } from 'react'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

interface ItemGridProps {
  items: Item[]
  visibleCount: number
  selectedItems?: Set<string>
  onItemClick?: (item: Item) => void
  onItemSelect?: (item: Item) => void
  isClickable?: boolean
  showCheckbox?: boolean
}

interface ItemGridSlotProps {
  item: Item
  isSelected: boolean
  onItemClick?: (item: Item) => void
  onItemSelect?: (item: Item) => void
  isClickable: boolean
  showCheckbox: boolean
}

// Memoize individual item slots to prevent re-rendering all items on selection change
const ItemGridSlot = memo(function ItemGridSlot({ 
  item, 
  isSelected, 
  onItemClick, 
  onItemSelect,
  isClickable,
  showCheckbox 
}: ItemGridSlotProps) {
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
      _hover={isClickable ? {
        borderColor: 'blue.300',
      } : undefined}
    >
      {showCheckbox && (
        <Checkbox
          position="absolute"
          top="2px"
          left="2px"
          zIndex={2}
          isChecked={isSelected}
          onChange={() => onItemSelect?.(item)}
          colorScheme="blue"
          size="lg"
          bg="gray.800"
          borderRadius="sm"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <ItemSlot
        item={item}
        size="md"
        onClick={onItemClick ? () => onItemClick(item) : undefined}
        isClickable={isClickable}
      />
    </Box>
  )
}, (prev, next) => {
  // Only re-render if selection state or item changes
  return prev.item.id === next.item.id && 
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
  // Memoize visible items with restored icons to prevent recalculating on every render
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount).map(item => restoreItemIcon(item))
  }, [items, visibleCount])
  
  return (
    <Box
      className="item-grid"
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 80px)"
      gap={2.5}
      minH="400px"
      justifyContent="start"
    >
      {visibleItems.map((item) => (
        <ItemGridSlot
          key={item.id}
          item={item}
          isSelected={selectedItems?.has(item.id) ?? false}
          onItemClick={onItemClick}
          onItemSelect={onItemSelect}
          isClickable={isClickable}
          showCheckbox={showCheckbox}
        />
      ))}
    </Box>
  )
})

import { Box } from '@chakra-ui/react'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

interface ItemGridProps {
  items: Item[]
  visibleCount: number
  selectedItems?: Set<string>
  onItemClick?: (item: Item) => void
  isClickable?: boolean
}

export function ItemGrid({ 
  items, 
  visibleCount, 
  selectedItems, 
  onItemClick,
  isClickable = false 
}: ItemGridProps) {
  const visibleItems = items.slice(0, visibleCount)
  
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
        <Box
          key={item.id}
          className="item-grid-slot"
          position="relative"
          borderWidth="2px"
          borderColor={selectedItems?.has(item.id) ? 'blue.400' : 'transparent'}
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
          <ItemSlot
            item={restoreItemIcon(item)}
            size="md"
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            isClickable={isClickable}
          />
        </Box>
      ))}
    </Box>
  )
}

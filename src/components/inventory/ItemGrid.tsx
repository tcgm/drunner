import './ItemGrid.css'
import { Box } from '@chakra-ui/react'
import { useRef, useMemo, memo, useCallback, useLayoutEffect, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Item } from '@/types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'

const GAP = 8

interface ItemGridProps {
  items: Item[]
  visibleCount?: number // kept for API compat, ignored - virtualization handles this
  selectedItems?: Set<string>
  onItemClick?: (item: Item) => void
  onItemSelect?: (itemId: string) => void
  isClickable?: boolean
  showCheckbox?: boolean
  comparisonItem?: Item | null
  height?: string // scroll container height, defaults to 55vh
}

interface ItemGridSlotProps {
  item: Item
  itemId: string
  isSelected: boolean
  isClickable: boolean
  showCheckbox: boolean
  slotSize: number
  onItemClick?: (item: Item) => void
  onItemSelect?: (itemId: string) => void
  comparisonItem?: Item | null
}

const ItemGridSlot = memo(function ItemGridSlot({
  item,
  itemId,
  isSelected,
  isClickable,
  showCheckbox,
  slotSize,
  onItemClick,
  onItemSelect,
  comparisonItem
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
      flexShrink={0}
      borderWidth="2px"
      borderColor={isSelected ? 'blue.400' : 'transparent'}
      borderRadius="sm"
      cursor={isClickable ? 'pointer' : 'default'}
      w={`${slotSize}px`}
      h={`${slotSize}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <ItemSlot
        item={item}
        size="xl"
        onClick={onItemClick ? handleItemClick : undefined}
        isClickable={isClickable}
        showCheckbox={showCheckbox}
        isSelected={isSelected}
        onCheckboxChange={handleCheckboxChange}
        comparisonItem={comparisonItem}
      />
    </Box>
  )
}, (prev, next) => {
  return prev.itemId === next.itemId &&
    prev.isSelected === next.isSelected &&
    prev.isClickable === next.isClickable &&
    prev.showCheckbox === next.showCheckbox &&
    prev.slotSize === next.slotSize &&
    prev.onItemClick === next.onItemClick &&
    prev.onItemSelect === next.onItemSelect
})

export const ItemGrid = memo(function ItemGrid({
  items,
  // visibleCount is intentionally unused - virtualization replaces batching
  selectedItems,
  onItemClick,
  onItemSelect,
  isClickable = false,
  showCheckbox = false,
  comparisonItem,
  height = '55vh'
}: ItemGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [slotSize, setSlotSize] = useState(120)
  const [containerWidth, setContainerWidth] = useState(0)

  // Measure actual rendered slot size and container width
  useLayoutEffect(() => {
    // Read synchronously on first layout so initial render is correct
    if (measureRef.current) setSlotSize(measureRef.current.offsetWidth || 120)
    if (scrollRef.current) setContainerWidth(scrollRef.current.offsetWidth || 0)

    const obs = new ResizeObserver(() => {
      if (measureRef.current) setSlotSize(measureRef.current.offsetWidth || 120)
      if (scrollRef.current) setContainerWidth(scrollRef.current.offsetWidth || 0)
    })
    if (measureRef.current) obs.observe(measureRef.current)
    if (scrollRef.current) obs.observe(scrollRef.current)
    return () => obs.disconnect()
  }, [])

  const columns = useMemo(
    () => Math.max(1, Math.floor((containerWidth + GAP) / (slotSize + GAP))),
    [containerWidth, slotSize]
  )

  const restoredItems = useMemo(
    () => items.map(item => restoreItemIcon(item)),
    [items]
  )

  // Chunk flat item list into rows
  const rows = useMemo(() => {
    const result: Item[][] = []
    for (let i = 0; i < restoredItems.length; i += columns) {
      result.push(restoredItems.slice(i, i + columns))
    }
    return result
  }, [restoredItems, columns])

  const rowHeight = slotSize + GAP

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  })

  return (
    <>
      {/* Hidden element to resolve --item-slot-xl CSS variable to px */}
      <Box
        ref={measureRef}
        w="var(--item-slot-xl)"
        h="0"
        visibility="hidden"
        position="absolute"
        pointerEvents="none"
      />

      {/* Virtualized scroll container */}
      <Box
        ref={scrollRef}
        className="item-grid"
        height={height}
        overflowY="auto"
        overflowX="hidden"
      >
        {/* Total height spacer so scrollbar is correctly sized */}
        <Box height={`${virtualizer.getTotalSize()}px`} position="relative">
          {virtualizer.getVirtualItems().map(virtualRow => {
            const rowItems = rows[virtualRow.index]
            if (!rowItems) return null
            return (
              <Box
                key={virtualRow.key}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height={`${virtualRow.size}px`}
                transform={`translateY(${virtualRow.start}px)`}
                display="flex"
                gap={`${GAP}px`}
                pb={`${GAP}px`}
              >
                {rowItems.map(item => (
                  <ItemGridSlot
                    key={item.id}
                    item={item}
                    itemId={item.id}
                    isSelected={selectedItems?.has(item.id) ?? false}
                    isClickable={isClickable}
                    showCheckbox={showCheckbox}
                    slotSize={slotSize}
                    onItemClick={onItemClick}
                    onItemSelect={onItemSelect}
                    comparisonItem={comparisonItem}
                  />
                ))}
              </Box>
            )
          })}
        </Box>
      </Box>
    </>
  )
})


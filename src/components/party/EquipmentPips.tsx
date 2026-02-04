import { Box, Text, Tooltip } from '@chakra-ui/react'
import type { Item } from '@/types'
import { getRarityColors } from '@/systems/rarity/rarities'

interface EquipmentPipsProps {
  items: Item[]
  layout?: 'vertical' | 'circular'
  radius?: number
  size?: 'sm' | 'md'
}

/**
 * Displays equipment indicators as colored dots or stars (for unique items)
 * Supports vertical list or circular arrangement around a center point
 */
export function EquipmentPips({ items, layout = 'vertical', radius = 28, size = 'md' }: EquipmentPipsProps) {
  if (items.length === 0) return null

  const dotSize = size === 'sm' ? '6px' : '8px'
  const starSize = size === 'sm' ? 'xs' : 'xs'
  
  if (layout === 'vertical') {
    return (
      <>
        {items.map((item, idx) => {
          const colors = getRarityColors(item.rarity)
          return (
            <Tooltip key={idx} label={item.name} fontSize="xs" placement="right">
              {item.isUnique ? (
                <Text
                  fontSize={starSize}
                  color={colors.border}
                  style={{ filter: `drop-shadow(0 0 3px ${colors.glow})` }}
                  lineHeight="1"
                >
                  ★
                </Text>
              ) : (
                <Box
                  w={dotSize}
                  h={dotSize}
                  borderRadius="full"
                  bg={colors.border}
                  boxShadow={`0 0 4px ${colors.glow}`}
                />
              )}
            </Tooltip>
          )
        })}
      </>
    )
  }
  
  // Circular layout
  const angleStep = 360 / items.length
  
  return (
    <>
      {items.map((item, idx) => {
        const angle = (angleStep * idx - 90) * (Math.PI / 180)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const colors = getRarityColors(item.rarity)
        
        return (
          <Tooltip key={idx} label={item.name} fontSize="xs" placement="top">
            {item.isUnique ? (
              <Text
                position="absolute"
                left="50%"
                top="50%"
                transform={`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`}
                fontSize={starSize}
                color={colors.border}
                style={{ filter: `drop-shadow(0 0 4px ${colors.glow})` }}
                lineHeight="1"
              >
                ★
              </Text>
            ) : (
              <Box
                position="absolute"
                left="50%"
                top="50%"
                transform={`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`}
                w={dotSize}
                h={dotSize}
                borderRadius="full"
                bg={colors.border}
                boxShadow={`0 0 6px ${colors.glow}`}
                borderWidth="1px"
                borderColor="gray.900"
              />
            )}
          </Tooltip>
        )
      })}
    </>
  )
}

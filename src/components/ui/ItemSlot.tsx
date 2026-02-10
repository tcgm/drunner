import {
  Box,
  Text,
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Tooltip,
  Icon,
  Checkbox,
} from '@chakra-ui/react'
import { useState, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiGoldBar as GiTreasure, GiSparkles, GiCursedStar } from 'react-icons/gi'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Item } from '@/types'
import { useItemDetailModal } from '@/contexts/ItemDetailModalContext'
import { getItemSetName } from '@/data/items/sets'
import { restoreItemIcon } from '@/utils/itemUtils'
import { getModifierById } from '@/data/items/mods'
import { MultIcon } from '@/components/ui/MultIcon'
import { resolveItemData } from '@/utils/itemDataResolver'
import { getUniqueEffectForItem } from '@/systems/items/uniqueEffects'
import { RARITY_COLORS as CENTRALIZED_RARITY_COLORS } from '@/systems/rarity/raritySystem'

const MotionBox = motion.create(Box)

// Gem icons for each rarity - matching ItemDetailModal
const RARITY_GEM_ICONS: Record<Item['rarity'], IconType> = {
  junk: GameIcons.GiStoneBlock,
  abundant: GameIcons.GiRock,
  common: GameIcons.GiGems,
  uncommon: GameIcons.GiCutDiamond,
  rare: GameIcons.GiDiamondTrophy,
  veryRare: GameIcons.GiCrystalShine,
  magical: GameIcons.GiSparkles,
  elite: GameIcons.GiDiamonds,
  epic: GameIcons.GiCrystalCluster,
  legendary: GameIcons.GiCrystalShine,
  mythic: GameIcons.GiBatwingEmblem,
  mythicc: GameIcons.GiCrystalEye,
  artifact: GameIcons.GiCrystalEye,
  divine: GameIcons.GiAngelWings,
  celestial: GameIcons.GiStarFormation,
  realityAnchor: GameIcons.GiChainedHeart,
  structural: GameIcons.GiCubeforce,
  singularity: GameIcons.GiBlackHoleBolas,
  void: GameIcons.GiVortex,
  elder: GameIcons.GiEvilBook,
  layer: GameIcons.GiPerspectiveDiceSixFacesRandom,
  plane: GameIcons.GiCardRandom,
  author: GameIcons.GiQuillInk,
}

interface ItemSlotProps {
  item: Item
  onClick?: () => void
  isClickable?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCheckbox?: boolean
  isSelected?: boolean
  onCheckboxChange?: () => void
  comparisonItem?: Item | null // Item to compare against (equipped item)
  iconOnly?: boolean // Only show icon, no text
  stopPropagation?: boolean // Whether to stop event propagation (default: true)
}

// Create lookup objects from centralized rarity colors
const RARITY_GLOW_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(CENTRALIZED_RARITY_COLORS).map(([key, value]) => [key, value.glow])
)

const RARITY_COLORS: Record<string, { text: string; bg: string; gem: string }> = Object.fromEntries(
  Object.entries(CENTRALIZED_RARITY_COLORS).map(([key, value]) => [
    key,
    { text: value.text, bg: value.backgroundColor, gem: value.gem }
  ])
)

// Special colors for cursed and set items (not in main rarity system)
RARITY_GLOW_COLORS.cursed = 'rgba(75, 85, 99, 0.4)'
RARITY_GLOW_COLORS.set = 'rgba(20, 184, 166, 0.5)'
RARITY_COLORS.cursed = { text: '#6B7280', bg: '#111827', gem: '#4B5563' }
RARITY_COLORS.set = { text: '#5EEAD4', bg: '#134E4A', gem: '#14B8A6' }

export const ItemSlot = memo(function ItemSlot({
  item,
  onClick,
  isClickable = true,
  size = 'md',
  showCheckbox = false,
  isSelected = false,
  onCheckboxChange,
  comparisonItem,
  iconOnly = false,
  stopPropagation = true
}: ItemSlotProps) {
  const { openItemDetail } = useItemDetailModal()
  const [isHovered, setIsHovered] = useState(false)
  
  // Resolve any missing item data (e.g., consumable effects from metadata)
  // This mutates the item in place if resolution is needed
  useMemo(() => resolveItemData(item), [item])

  // Restore icon if missing (handles deserialization issues without needing to call restoreItemIcon everywhere)
  const restoredItem = useMemo(() => restoreItemIcon(item), [item])
  const ItemIcon = restoredItem.icon || GiTreasure

  // Check if item is cursed
  const isCursed = useMemo(() =>
    item.modifiers?.includes('cursed') ?? false
    , [item.modifiers])

  const handleClick = (e?: React.MouseEvent) => {
    console.log('[ItemSlot] Item clicked:', item.name)

    // Stop propagation to prevent parent click handlers (if enabled)
    if (e && stopPropagation) {
      e.stopPropagation()
    }

    // Check if there's a global swap handler active (from HeroModal)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).__heroModalSwapHandler) {
      console.log('[ItemSlot] Global swap handler found, calling it');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__heroModalSwapHandler(item)
      return
    }
    
    console.log('[ItemSlot] No global handler, checking onClick or isClickable')
    if (onClick) {
      console.log('[ItemSlot] Calling onClick handler')
      onClick()
    } else if (isClickable) {
      console.log('[ItemSlot] Opening item detail modal')
      openItemDetail(item)
    }
  }

  // Sanitize item name in case it got corrupted with icon function
  const displayName = useMemo(() => {
    if (typeof item.name === 'string' && item.name.includes('function ')) {
      // Extract the actual name after the function code
      const match = item.name.match(/}\)\(t\)\s+(.+)/)
      if (match && match[1]) {
        return match[1].trim()
      }
      // Fallback: just say "Unknown Item"
      return "Unknown Item"
    }
    return item.name
  }, [item.name])

  // Detect set membership
  const setName = useMemo(() => getItemSetName(item.name), [item.name])

  // Get unique effect if this item has one
  const uniqueEffect = useMemo(() => getUniqueEffectForItem(restoredItem), [restoredItem])

  // Get rarity gem icon
  const GemIcon = useMemo(() => RARITY_GEM_ICONS[item.rarity] || GameIcons.GiCutDiamond, [item.rarity])
  // const gemColor = useMemo(() => item.isUnique ? '#FFD700' : (RARITY_COLORS[item.rarity]?.gem || '#6B7280'), [item.rarity, item.isUnique])
 const gemColor = useMemo(() => (RARITY_COLORS[item.rarity]?.gem || '#6B7280'), [item.rarity])
  // Memoize tooltip content to avoid recreation on every render
  const tooltipContent = useMemo(() => (
    <VStack align="start" spacing={1} maxW="300px">
      <HStack justify="space-between" w="full">
        <Text fontSize="sm" fontWeight="bold" color={RARITY_COLORS[item.rarity]?.text || '#9CA3AF'}>
          {displayName}
        </Text>
        <VStack align="end" spacing={0}>
          {item.isUnique && (
            <Badge 
              fontSize="2xs"
              bg="gold"
              color="black"
              fontWeight="bold"
            >
              ⭐ UNIQUE
            </Badge>
          )}
          {setName && (
            <Badge
              fontSize="2xs"
              bg="teal.700"
              color="teal.200"
              fontWeight="bold"
              borderWidth="1px"
              borderColor="teal.400"
              boxShadow="0 0 8px rgba(20, 184, 166, 0.4)"
            >
              {setName.toUpperCase()}
            </Badge>
          )}
          {isCursed && (
            <Badge
              fontSize="2xs"
              bg="purple.900"
              color="purple.300"
              fontWeight="bold"
              borderWidth="1px"
              borderColor="purple.500"
              boxShadow="0 0 8px rgba(124, 58, 237, 0.6)"
            >
              ⚠️ CURSED
            </Badge>
          )}
          <Badge 
            fontSize="2xs"
            bg={RARITY_COLORS[item.rarity]?.bg || '#4A5568'}
            color="white"
          >
            {item.rarity.toUpperCase()}
          </Badge>
          <Text fontSize="2xs" color="gray.400">
            {item.type}
          </Text>
        </VStack>
      </HStack>
      <Text fontSize="2xs" color="gray.300">
        {item.description}
      </Text>
      {item.stats && Object.keys(item.stats).length > 0 && (
        <SimpleGrid columns={2} spacing={1} w="full" fontSize="2xs" color="gray.300">
          {(() => {
            // Get all unique stats from both items
            const allStats = new Set([
              ...Object.keys(item.stats || {}),
              ...(comparisonItem?.stats ? Object.keys(comparisonItem.stats) : [])
            ])

            return Array.from(allStats).map((stat) => {
              const value = (item.stats as Record<string, number>)?.[stat] || 0
              const compValue = (comparisonItem?.stats as Record<string, number>)?.[stat] || 0
              const diff = comparisonItem ? value - compValue : null

              return (
                <HStack key={stat} spacing={1}>
                  <Text>
                    {stat.toUpperCase()}: {value >= 0 ? '+' : ''}{value}
                  </Text>
                  {diff !== null && diff !== 0 && (
                    <Text
                      color={diff > 0 ? 'green.400' : 'red.400'}
                      fontWeight="bold"
                    >
                      ({diff > 0 ? '+' : ''}{diff})
                    </Text>
                  )}
                </HStack>
              )
            })
          })()}
        </SimpleGrid>
      )}
      {comparisonItem && (
        <>
          <Text fontSize="xs" color="gray.500" fontWeight="bold" mt={1}>
            ─── Currently Equipped ───
          </Text>
          <Text fontSize="2xs" color="gray.400" fontWeight="bold">
            {comparisonItem.name}
          </Text>
          {comparisonItem.stats && Object.keys(comparisonItem.stats).length > 0 && (
            <SimpleGrid columns={2} spacing={1} w="full" fontSize="2xs" color="gray.500">
              {(() => {
                // Get all unique stats from both items
                const allStats = new Set([
                  ...Object.keys(item.stats || {}),
                  ...Object.keys(comparisonItem.stats || {})
                ])

                return Array.from(allStats).map((stat) => {
                  const value = (comparisonItem.stats as Record<string, number>)?.[stat] || 0
                  return (
                    <Text key={stat}>
                      {stat.toUpperCase()}: {value >= 0 ? '+' : ''}{value}
                    </Text>
                  )
                })
              })()}
            </SimpleGrid>
          )}
        </>
      )}
      {item.isUnique && uniqueEffect && (
        <Box
          w="full"
          mt={1}
          p={1}
          bg="rgba(255, 215, 0, 0.15)"
          borderRadius="md"
          borderWidth="1px"
          borderColor="#FFD700"
        >
          <HStack spacing={1} w="full" mb={0.5}>
            <Icon as={GiSparkles} color="#FFD700" boxSize="12px" />
            <Text fontSize="2xs" color="#FFD700" fontWeight="bold">
              Unique Effect
            </Text>
          </HStack>
          <Text fontSize="2xs" color="#FFF8DC">
            {uniqueEffect.description}
          </Text>
        </Box>
      )}
      <Text fontSize="2xs" color="yellow.300">
        Value: {item.value} gold
      </Text>
    </VStack>
  ), [item, setName, comparisonItem, displayName, isCursed, uniqueEffect])

  // Build className string
  const slotClassName = [
    'item-slot',
    `item-slot--${size}`,
    setName ? 'item-slot--set' : `item-slot--${item.rarity}`,
    item.isUnique && 'item-slot--unique',
    isSelected && 'item-slot--selected',
    (isClickable || onClick) && 'item-slot--clickable',
    iconOnly ? 'item-slot--icon-only' : 'item-slot--with-padding'
  ].filter(Boolean).join(' ')

  return (
    <>
      <Tooltip
        label={tooltipContent}
        placement="auto"
        hasArrow
        bg="gray.700" 
        color="white"
        borderRadius="md"
        p={1}
        isOpen={isHovered}
      >
        <MotionBox
          className={slotClassName}
          width={iconOnly ? '100%' : undefined}
          height={iconOnly ? '100%' : undefined}
          data-item-name={item.name}
          data-item-rarity={item.rarity}
          data-item-icon={item.icon?.length || 'unknown'}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={false}
          animate={{ 
            scale: isHovered && (isClickable || onClick) ? 1.08 : 1,
          }}
          whileTap={isClickable || onClick ? { scale: 0.95 } : {}}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {/* Inner rarity border for set items */}
          {setName && (
            <div className={`item-slot__inner-border item-slot__inner-border--${item.rarity}`} />
          )}

          {/* Selection Checkbox */}
          {showCheckbox && (
            <Checkbox
              position="absolute"
              top="2px"
              left="2px"
              zIndex={20}
              isChecked={isSelected}
              onChange={onCheckboxChange}
              colorScheme="blue"
              size="lg"
              bg="gray.800"
              borderRadius="sm"
              pointerEvents="auto"
              onClick={(e) => {
                e.stopPropagation()
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
              }}
            />
          )}

          {/* Rarity Glow Animation */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '12px',
                  background: setName
                    ? 'radial-gradient(circle, rgba(20, 184, 166, 0.7) 0%, transparent 70%)'
                    : item.isUnique
                      ? 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)'
                      : `radial-gradient(circle, ${RARITY_GLOW_COLORS[item.rarity] || 'rgba(74, 85, 104, 0.4)'} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  zIndex: -1
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Unique Item Badge - Background layer */}
          {item.isUnique && (
            <motion.div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                bottom: '4px',
                right: '4px',
                zIndex: 0,
                pointerEvents: 'none'
              }}
              animate={{
                rotate: [0, 3, -3, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon
                as={GiSparkles} 
                boxSize="100%"
                color="gold"
                opacity={0.25}
                filter="drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))"
              />
            </motion.div>
          )}

          {/* Cursed Item Effect - Dark pulsing overlay */}
          {isCursed && (
            <>
              {/* Pulsing dark glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                  borderRadius: '8px'
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Cursed star icon overlay */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  bottom: '4px',
                  right: '4px',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.15, 1]
                }}
                transition={{
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Icon
                  as={GiCursedStar}
                  boxSize="100%"
                  color="purple.400"
                  opacity={0.35}
                  filter="drop-shadow(0 0 6px rgba(124, 58, 237, 0.9))"
                />
              </motion.div>
            </>
          )}

          {/* Set Indicator Badge */}
          {setName && (
            <motion.div
              style={{
                position: 'absolute',
                top: '2px',
                left: '2px',
                zIndex: 15
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* <Badge
                fontSize="2xs"
                bg={RARITY_COLORS.set.bg}
                color={RARITY_COLORS.set.text}
                px={1.5}
                py={0.5}
                borderRadius="md"
                fontWeight="bold"
                borderWidth="1px"
                borderColor={RARITY_COLORS.set.border}
                boxShadow={`0 0 8px ${RARITY_COLORS.set.border}80`}
              >
                🦊 SET
              </Badge> */}
            </motion.div>
          )}

          {/* Item Icon - Foreground layer */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: iconOnly ? '100%' : undefined,
              height: iconOnly ? '100%' : undefined
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -5, 5, 0] : 0
            }}
            transition={{
              scale: { duration: 0.2 },
              rotate: { duration: 0.5, ease: "easeInOut" }
            }}
          >
            <MultIcon
              icon={ItemIcon}
              boxSize={iconOnly 
                ? '100%'
                : (size === 'sm' ? '20px' : size === 'md' ? '28px' : size === 'xl' ? '48px' : '36px')
              }
              fontSize={iconOnly ? '100%' : (size === 'sm' ? '20px' : size === 'md' ? '28px' : size === 'xl' ? '48px' : '36px')}
              color={item.isUnique ? '#FFFFFF' : RARITY_COLORS[item.rarity]?.gem || '#6B7280'}
              mb={iconOnly ? 0 : 0.5}
              style={item.isUnique ? {
                filter: `drop-shadow(0 0 4px ${RARITY_COLORS[item.rarity]?.gem || '#FFD700'}) drop-shadow(0 0 8px ${RARITY_COLORS[item.rarity]?.gem || '#FFD700'}) drop-shadow(0 0 12px ${RARITY_COLORS[item.rarity]?.gem || '#FFD700'})`
              } : undefined}
            />
          </motion.div>
          
          {/* Item Name */}
          {!iconOnly && (
            <Text
              fontSize={size === 'sm' ? '3xs' : size === 'xl' ? 'xs' : '2xs'} 
              fontWeight="bold" 
              color="white"
              textAlign="center"
              lineHeight="1.1"
              noOfLines={5}
              width="100%"
              px={0.5}
            >
                {displayName}
            </Text>
          )}

          {/* Version indicator - barely visible - only show for v1 and v2 */}
          {(() => {
            const version = (item as { version?: number }).version
            if (version === 3) return null

            return (
              <Badge
                position="absolute"
                top="2px"
                left="0px"
                zIndex={20}
                pointerEvents="none"
                fontSize="3xs"
                background={'transparent'}
                color={version === 2 ? 'white.300' : 'white'}
                opacity={0.5}
              >
                {version === 2 ? 'v2' : 'v1'}
              </Badge>
            )
          })()}

          {/* Rarity indicator dot */}
          {/*<motion.div
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: item.isUnique ? '#FFD700' : RARITY_COLORS[item.rarity]?.border || '#4A5568',
              boxShadow: item.isUnique ? '0 0 6px rgba(255, 215, 0, 0.8)' : 'none'
            }}
            animate={{
              scale: isHovered ? [1, 1.3, 1] : 1,
              opacity: isHovered ? [1, 0.6, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }}
          />*/}

          {/* Rarity Gem Icon - Bottom Center (Card Game style) */}
          {!iconOnly && (
            <MotionBox
              position="absolute"
              bottom="-20%"
              left="50%"
              marginLeft={size === 'sm' ? '-6px' : size === 'md' ? '-9px' : size === 'xl' ? '-12px' : '-10px'}
              zIndex={20}
              pointerEvents="none"
              animate={{
                scale: isHovered ? [1, 1.15, 1] : 1,
              }}
              transition={{
                scale: {
                  duration: 0.6,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
            >
              <Icon
                as={GemIcon}
                boxSize={size === 'sm' ? '12px' : size === 'md' ? '18px' : size === 'xl' ? '24px' : '20px'}
                size={"xs"}
                color={gemColor}
                filter={`drop-shadow(0 0 4px ${gemColor}) drop-shadow(0 0 8px ${gemColor}80)`}
              />
            </MotionBox>
          )}
        </MotionBox>
      </Tooltip>
    </>
  )
}, (prevProps, nextProps) => {
  // Only re-render if item ID or critical props change
  return prevProps.item.id === nextProps.item.id &&
    prevProps.isClickable === nextProps.isClickable &&
    prevProps.size === nextProps.size &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.showCheckbox === nextProps.showCheckbox &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onCheckboxChange === nextProps.onCheckboxChange &&
    prevProps.stopPropagation === nextProps.stopPropagation
})
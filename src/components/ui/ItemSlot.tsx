import {
  Box,
  Text,
  Badge,
  VStack,
  HStack,
  SimpleGrid,
  Tooltip,
  useDisclosure,
  Icon,
  Checkbox,
} from '@chakra-ui/react'
import { useState, memo, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiGoldBar as GiTreasure, GiSparkles } from 'react-icons/gi'
import type { Item } from '@/types'
import { ItemDetailModal } from '@/components/ui/ItemDetailModal'
import { getItemSetName } from '@/data/items/sets'

const MotionBox = motion.create(Box)

interface ItemSlotProps {
  item: Item
  onClick?: () => void
  isClickable?: boolean
  size?: 'sm' | 'md' | 'lg'
  showCheckbox?: boolean
  isSelected?: boolean
  onCheckboxChange?: () => void
}

const SLOT_SIZES = {
  sm: '60px',
  md: '80px', 
  lg: '100px'
}

const RARITY_COLORS: Record<string, {
  border: string;
  borderHover: string;
  text: string;
  textLight: string;
  bg: string;
}> = {
  junk: {
    border: '#4A5568',
    borderHover: '#2D3748',
    text: '#9CA3AF',
    textLight: '#D1D5DB',
    bg: '#2D3748'
  },
  common: {
    border: '#22C55E',
    borderHover: '#16A34A',
    text: '#4ADE80',
    textLight: '#BBF7D0',
    bg: '#065F46'
  },
  uncommon: {
    border: '#3B82F6',
    borderHover: '#2563EB',
    text: '#60A5FA',
    textLight: '#DBEAFE',
    bg: '#1E3A8A'
  },
  rare: {
    border: '#A855F7',
    borderHover: '#9333EA',
    text: '#C084FC',
    textLight: '#E9D5FF',
    bg: '#581C87'
  },
  epic: {
    border: '#EC4899',
    borderHover: '#DB2777',
    text: '#F472B6',
    textLight: '#FCE7F3',
    bg: '#831843'
  },
  legendary: {
    border: '#F97316',
    borderHover: '#EA580C',
    text: '#FB923C',
    textLight: '#FED7AA',
    bg: '#9A3412'
  },
  mythic: {
    border: '#EF4444',
    borderHover: '#DC2626',
    text: '#F87171',
    textLight: '#FEE2E2',
    bg: '#991B1B'
  },
  artifact: {
    border: '#EAB308',
    borderHover: '#CA8A04',
    text: '#FACC15',
    textLight: '#FEF3C7',
    bg: '#92400E'
  },
  cursed: {
    border: '#1F2937',
    borderHover: '#111827',
    text: '#6B7280',
    textLight: '#F3F4F6',
    bg: '#111827'
  },
  abundant: {
    border: '#10B981',
    borderHover: '#059669',
    text: '#34D399',
    textLight: '#D1FAE5',
    bg: '#064E3B'
  },
  set: {
    border: '#14B8A6',
    borderHover: '#0D9488',
    text: '#5EEAD4',
    textLight: '#CCFBF1',
    bg: '#134E4A'
  }
}

export const ItemSlot = memo(function ItemSlot({
  item,
  onClick,
  isClickable = true,
  size = 'md',
  showCheckbox = false,
  isSelected = false,
  onCheckboxChange
}: ItemSlotProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  // Use the icon directly from the item, or fallback to GiTreasure
  const ItemIcon = item.icon || GiTreasure

  const handleClick = () => {
    // Check if there's a global swap handler active (from HeroModal)
    if (typeof window !== 'undefined' && (window as any).__heroModalSwapHandler) {
      (window as any).__heroModalSwapHandler(item)
      return
    }
    
    if (onClick) {
      onClick()
    } else if (isClickable) {
      onOpen()
    }
  }

  // Detect set membership
  const setName = useMemo(() => getItemSetName(item.name), [item.name])

  // Memoize tooltip content to avoid recreation on every render
  const tooltipContent = useMemo(() => (
    <VStack align="start" spacing={1} maxW="300px">
      <HStack justify="space-between" w="full">
        <Text fontSize="sm" fontWeight="bold" color={RARITY_COLORS[item.rarity]?.text || '#9CA3AF'}>
          {item.name}
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
              🦊 {setName.toUpperCase()}
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
          {Object.entries(item.stats).map(([stat, value]) => (
            <Text key={stat}>
              {stat.toUpperCase()}: +{value}
            </Text>
          ))}
        </SimpleGrid>
      )}
      <Text fontSize="2xs" color="yellow.300">
        Value: {item.value} gold
      </Text>
    </VStack>
  ), [item, setName])

  return (
    <>
      <Tooltip
        label={tooltipContent}
        placement="top"
        hasArrow
        bg="gray.700" 
        color="white"
        borderRadius="md"
        p={1}
        isOpen={isHovered}
      >
        <MotionBox
          className={`item-slot item-slot-${item.rarity} item-type-${item.type}${item.isUnique ? ' item-unique' : ''}${setName ? ' item-set' : ''}${isSelected ? ' item-selected' : ''}`}
          width={SLOT_SIZES[size]}
          height={SLOT_SIZES[size]}
          bg={setName ? RARITY_COLORS.set.bg : (RARITY_COLORS[item.rarity]?.bg || '#4A5568')}
          borderRadius="lg"
          borderWidth={setName ? '4px' : '2px'}
          borderColor={isSelected ? 'blue.400' : (setName ? RARITY_COLORS.set.border : (item.isUnique ? '#FFD700' : RARITY_COLORS[item.rarity]?.border || '#4A5568'))}
          position="relative"
          cursor={isClickable || onClick ? "pointer" : "default"}
          boxShadow={isSelected
            ? '0 0 16px rgba(96, 165, 250, 0.8), 0 0 24px rgba(96, 165, 250, 0.5)'
            : setName
              ? `0 0 12px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4)`
              : item.isUnique
                ? `0 0 12px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0 0 8px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}20`}
          data-item-name={item.name}
          data-item-rarity={item.rarity}
          data-item-icon={item.icon?.name || 'unknown'}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={1}
          initial={false}
          animate={{ 
            scale: isHovered && (isClickable || onClick) ? 1.08 : 1,
            boxShadow: isHovered 
              ? setName
                ? `0 0 32px rgba(20, 184, 166, 0.8), 0 0 48px rgba(20, 184, 166, 0.6), 0 0 64px rgba(20, 184, 166, 0.4)`
                : item.isUnique
                  ? `0 0 32px rgba(255, 215, 0, 0.8), 0 0 48px rgba(255, 215, 0, 0.5), 0 0 64px rgba(255, 215, 0, 0.3)`
                  : `0 0 24px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}60, 0 0 40px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}40`
              : setName
                ? `0 0 12px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4)`
                : item.isUnique
                  ? `0 0 12px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)`
                  : `0 0 8px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}20`
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
            <Box
              position="absolute"
              top="-4px"
              left="-4px"
              right="-4px"
              bottom="-4px"
              borderRadius="md"
              borderWidth="2px"
              borderColor={RARITY_COLORS[item.rarity]?.border || '#4A5568'}
              pointerEvents="none"
              zIndex={1}
              opacity={0.8}
            />
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
                    ? `radial-gradient(circle, rgba(20, 184, 166, 0.7) 0%, transparent 70%)`
                    : item.isUnique
                      ? `radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)`
                      : `radial-gradient(circle, ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}40 0%, transparent 70%)`,
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
              alignItems: 'center'
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
            <Icon
              as={ItemIcon}
              boxSize={size === 'sm' ? '20px' : size === 'md' ? '28px' : '36px'}
              color="white"
              mb={0.5}
            />
          </motion.div>
          
          {/* Item Name */}
          <Text
            fontSize={size === 'sm' ? '3xs' : '2xs'} 
            fontWeight="bold" 
            color="white"
            textAlign="center"
            lineHeight="1.1"
            noOfLines={5}
            width="100%"
            px={0.5}
          >
            {item.name}
          </Text>
          
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
        </MotionBox>
      </Tooltip>

      <ItemDetailModal 
        item={item}
        isOpen={isOpen}
        onClose={onClose}
      />
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
    prevProps.onCheckboxChange === nextProps.onCheckboxChange
})
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
} from '@chakra-ui/react'
import { useState } from 'react'
import { 
  GiSwordsPower, 
  GiChestArmor, 
  GiHelmet as GiLeatherHelm, 
  GiBoots, 
  GiRing, 
  GiGoldBar as GiTreasure,
  GiBattleAxe,
  GiStiletto,
  GiWizardStaff,
  GiBowArrow,
  GiMaceHead as GiMace,
  GiZeusSword as GiHolySword
} from 'react-icons/gi'
import type { Item } from '@/types'
import { ItemDetailModal } from '@/components/ui/ItemDetailModal'

interface ItemSlotProps {
  item: Item
  onClick?: () => void
  isClickable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const SLOT_SIZES = {
  sm: '60px',
  md: '80px', 
  lg: '100px'
}

const RARITY_COLORS = {
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
  set: {
    border: '#14B8A6',
    borderHover: '#0D9488',
    text: '#5EEAD4',
    textLight: '#CCFBF1',
    bg: '#134E4A'
  }
}

const getItemIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    GiSwordsPower,
    GiChestArmor,
    GiLeatherHelm,
    GiBoots,
    GiRing,
    GiTreasure,
    GiBattleAxe,
    GiStiletto,
    GiWizardStaff,
    GiBowArrow,
    GiMace,
    GiHolySword
  }
  
  return iconMap[iconName] || GiTreasure
}

export function ItemSlot({ item, onClick, isClickable = true, size = 'md' }: ItemSlotProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  const ItemIcon = getItemIcon(item.icon)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (isClickable) {
      onOpen()
    }
  }

  const tooltipContent = (
    <VStack align="start" spacing={1} maxW="300px">
      <HStack justify="space-between" w="full">
        <Text fontSize="sm" fontWeight="bold" color={RARITY_COLORS[item.rarity]?.text || '#9CA3AF'}>
          {item.name}
        </Text>
        <VStack align="end" spacing={0}>
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
  )

  return (
    <>
      <Tooltip 
        label={tooltipContent} 
        placement="top" 
        hasArrow 
        bg="gray.700" 
        color="white"
        borderRadius="md"
        p={3}
        isOpen={isHovered}
      >
        <Box
          className={`item-slot item-slot-${item.rarity} item-type-${item.type}`}
          width={SLOT_SIZES[size]}
          height={SLOT_SIZES[size]}
          bg={RARITY_COLORS[item.rarity]?.bg || '#4A5568'}
          borderRadius="lg"
          borderWidth="3px"
          borderColor={RARITY_COLORS[item.rarity]?.border || '#4A5568'}
          position="relative"
          cursor={isClickable || onClick ? "pointer" : "default"}
          transition="all 0.2s"
          _hover={{
            borderColor: RARITY_COLORS[item.rarity]?.borderHover || '#2D3748',
            bg: RARITY_COLORS[item.rarity]?.borderHover || '#2D3748',
            transform: isClickable || onClick ? "scale(1.05)" : "none",
            boxShadow: `0 0 12px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}40`
          }}
          boxShadow={`0 0 8px ${RARITY_COLORS[item.rarity]?.border || '#4A5568'}20`}
          data-item-name={item.name}
          data-item-rarity={item.rarity}
          data-item-icon={item.icon}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={2}
        >
          {/* Item Icon */}
          <Icon 
            as={ItemIcon} 
            boxSize={size === 'sm' ? '20px' : size === 'md' ? '28px' : '36px'}
            color="white"
            mb={0.5}
          />
          
          {/* Item Name */}
          <Text 
            fontSize={size === 'sm' ? '3xs' : '2xs'} 
            fontWeight="bold" 
            color="white"
            textAlign="center"
            lineHeight="1.1"
            noOfLines={2}
            width="100%"
            px={0.5}
          >
            {item.name}
          </Text>
          
          {/* Rarity indicator dot */}
          <Box
            position="absolute"
            top="2px"
            right="2px"
            width="8px"
            height="8px"
            borderRadius="full"
            bg={RARITY_COLORS[item.rarity]?.bg || '#4A5568'}
          />
        </Box>
      </Tooltip>

      <ItemDetailModal 
        item={item}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  )
}
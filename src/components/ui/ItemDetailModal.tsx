import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Box,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { Icon as ChakraIcon } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Item } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RarityLabel } from './RarityLabel'

const RARITY_COLORS = {
  junk: {
    border: '#4A5568',
    glow: 'rgba(74, 85, 104, 0.5)',
    text: '#9CA3AF',
    textLight: '#D1D5DB',
    bg: 'rgba(74, 85, 104, 0.2)',
    gem: '#6B7280'
  },
  common: {
    border: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.6)',
    text: '#4ADE80',
    textLight: '#BBF7D0',
    bg: 'rgba(34, 197, 94, 0.1)',
    gem: '#22C55E'
  },
  uncommon: {
    border: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.6)',
    text: '#60A5FA',
    textLight: '#DBEAFE',
    bg: 'rgba(59, 130, 246, 0.1)',
    gem: '#3B82F6'
  },
  rare: {
    border: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.6)',
    text: '#C084FC',
    textLight: '#E9D5FF',
    bg: 'rgba(168, 85, 247, 0.1)',
    gem: '#A855F7'
  },
  epic: {
    border: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.6)',
    text: '#F472B6',
    textLight: '#FCE7F3',
    bg: 'rgba(236, 72, 153, 0.1)',
    gem: '#EC4899'
  },
  legendary: {
    border: '#F97316',
    glow: 'rgba(249, 115, 22, 0.7)',
    text: '#FB923C',
    textLight: '#FED7AA',
    bg: 'rgba(249, 115, 22, 0.1)',
    gem: '#F97316'
  },
  mythic: {
    border: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.7)',
    text: '#F87171',
    textLight: '#FEE2E2',
    bg: 'rgba(239, 68, 68, 0.1)',
    gem: '#EF4444'
  },
  artifact: {
    border: '#EAB308',
    glow: 'rgba(234, 179, 8, 0.7)',
    text: '#FACC15',
    textLight: '#FEF3C7',
    bg: 'rgba(234, 179, 8, 0.1)',
    gem: '#EAB308'
  },
  cursed: {
    border: '#7C3AED',
    glow: 'rgba(124, 58, 237, 0.6)',
    text: '#A78BFA',
    textLight: '#EDE9FE',
    bg: 'rgba(124, 58, 237, 0.1)',
    gem: '#7C3AED'
  },
  set: {
    border: '#14B8A6',
    glow: 'rgba(20, 184, 166, 0.6)',
    text: '#5EEAD4',
    textLight: '#CCFBF1',
    bg: 'rgba(20, 184, 166, 0.1)',
    gem: '#14B8A6'
  }
}

// Animations
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color); }
  50% { box-shadow: 0 0 30px var(--glow-color), 0 0 60px var(--glow-color); }
`

interface ItemDetailModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  const rarityTheme = RARITY_COLORS[item.rarity] || RARITY_COLORS.common
  const IconComponent = item.icon || GameIcons.GiSwordman
  
  // Split stats into left and right columns
  const stats = item.stats ? Object.entries(item.stats) : []
  const leftStats = stats.slice(0, Math.ceil(stats.length / 2))
  const rightStats = stats.slice(Math.ceil(stats.length / 2))

  const getStatColor = (stat: string) => {
    if (stat === 'hp' || stat === 'maxHp') return GAME_CONFIG.colors.hp.light
    if (stat === 'attack') return GAME_CONFIG.colors.stats.attack
    if (stat === 'defense') return GAME_CONFIG.colors.stats.defense
    if (stat === 'speed') return GAME_CONFIG.colors.stats.speed
    if (stat === 'luck') return GAME_CONFIG.colors.stats.luck
    if (stat === 'magicPower') return GAME_CONFIG.colors.stats.magicPower
    return 'green.300'
  }

  const formatStatName = (stat: string) => {
    if (stat === 'maxHp') return 'Max HP'
    if (stat === 'magicPower') return 'Magic Power'
    return stat.charAt(0).toUpperCase() + stat.slice(1)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        className={`item-detail-modal item-detail-modal--${item.rarity}${item.isUnique ? ' item-detail-modal--unique' : ''}`}
        bg="gray.900"
        color="white"
        borderWidth="3px"
        borderColor={item.isUnique ? '#FFD700' : rarityTheme.border}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        maxH="90vh"
        sx={{
          '--glow-color': item.isUnique ? 'rgba(255, 215, 0, 0.4)' : rarityTheme.glow,
          animation: `${glow} 2s ease-in-out infinite`,
        }}
      >
        {/* Decorative corner accents */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="60px"
          h="60px"
          borderLeft={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          borderTop={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          opacity={0.3}
          pointerEvents="none"
          zIndex={1}
        />
        <Box
          position="absolute"
          top={0}
          right={0}
          w="60px"
          h="60px"
          borderRight={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          borderTop={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          opacity={0.3}
          pointerEvents="none"
          zIndex={1}
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          w="60px"
          h="60px"
          borderLeft={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          borderBottom={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          opacity={0.3}
          pointerEvents="none"
          zIndex={1}
        />
        <Box
          position="absolute"
          bottom={0}
          right={0}
          w="60px"
          h="60px"
          borderRight={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          borderBottom={`3px solid ${item.isUnique ? '#FFD700' : rarityTheme.border}`}
          opacity={0.3}
          pointerEvents="none"
          zIndex={1}
        />

        {/* Background gradient */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={`radial-gradient(circle at center, ${rarityTheme.bg} 0%, transparent 70%)`}
          pointerEvents="none"
        />

        <ModalCloseButton zIndex={2} />
        
        <ModalBody p={5} position="relative" zIndex={1}>
          <VStack spacing={4}>
            {/* Item Name */}
            <VStack spacing={0}>
              <RarityLabel
                rarity={item.rarity}
                text={item.name}
                isUnique={item.isUnique}
                size="xl"
                withGlow
                withPulse={item.isUnique}
                className="item-detail-modal-name"
              />
              {item.isUnique && (
                <Text fontSize="sm" color="yellow.200" fontStyle="italic">
                  ✦ Unique Item ✦
                </Text>
              )}
            </VStack>

            {/* Main Content Area with Stats on Sides */}
            <HStack spacing={4} align="start" w="full">
              {/* Left Stats Column */}
              <VStack className="item-detail-modal-left-stats" spacing={2} flex={1} align="stretch">
                {leftStats.map(([stat, value]) => (
                  <HStack key={stat} justify="space-between" p={2} bg="whiteAlpha.50" borderRadius="md">
                    <Text fontSize="sm" color="gray.400">
                      {formatStatName(stat)}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={getStatColor(stat)}>
                      +{value}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              {/* Center - Large Icon with Fancy Frame */}
              <VStack className="item-detail-modal-center" spacing={2}>
                <Box position="relative">
                  {/* Outer glow ring */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    w="140px"
                    h="140px"
                    borderRadius="full"
                    bg={`radial-gradient(circle, ${rarityTheme.glow} 0%, transparent 70%)`}
                    sx={{ animation: `${pulse} 2s ease-in-out infinite` }}
                  />
                  
                  {/* Icon frame */}
                  <Box
                    className="item-detail-modal-icon-frame"
                    position="relative"
                    w="110px"
                    h="110px"
                    borderRadius="xl"
                    bg="gray.800"
                    borderWidth="4px"
                    borderColor={item.isUnique ? '#FFD700' : rarityTheme.border}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    sx={{
                      animation: `${float} 3s ease-in-out infinite`,
                      boxShadow: `0 0 30px ${rarityTheme.glow}, inset 0 0 20px ${rarityTheme.bg}`
                    }}
                  >
                    {/* Shimmer effect overlay */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg={`linear-gradient(90deg, transparent 0%, ${rarityTheme.glow} 50%, transparent 100%)`}
                      backgroundSize="200% 100%"
                      sx={{ animation: `${shimmer} 3s linear infinite` }}
                      opacity={0.3}
                    />
                    
                    {/* Icon */}
                    <ChakraIcon 
                      as={IconComponent} 
                      boxSize="65px" 
                      color={item.isUnique ? '#FFD700' : rarityTheme.text}
                      filter={`drop-shadow(0 0 8px ${rarityTheme.glow})`}
                      position="relative"
                      zIndex={1}
                    />
                  </Box>
                </Box>

                {/* Rarity Gem Indicator */}
                <Tooltip 
                  label={
                    <RarityLabel
                      rarity={item.rarity}
                      text={`${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} Quality`}
                      isUnique={item.isUnique}
                      size="sm"
                      withGlow
                      withShimmer
                    />
                  }
                  placement="bottom"
                  hasArrow
                  bg="gray.900"
                  borderWidth="2px"
                  borderColor={item.isUnique ? '#FFD700' : rarityTheme.border}
                  borderRadius="md"
                  p={2}
                >
                  <Box
                    className="item-detail-modal-rarity-gem"
                    position="relative"
                    cursor="help"
                  >
                    <Icon 
                      as={GameIcons.GiCutDiamond} 
                      boxSize="32px" 
                      color={rarityTheme.gem}
                      filter={`drop-shadow(0 0 6px ${rarityTheme.glow})`}
                      sx={{ animation: `${pulse} 2s ease-in-out infinite` }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      bg={`radial-gradient(circle, ${rarityTheme.glow} 0%, transparent 70%)`}
                      sx={{ animation: `${pulse} 2s ease-in-out infinite` }}
                      zIndex={-1}
                    />
                  </Box>
                </Tooltip>
              </VStack>

              {/* Right Stats Column */}
              <VStack className="item-detail-modal-right-stats" spacing={2} flex={1} align="stretch">
                {rightStats.map(([stat, value]) => (
                  <HStack key={stat} justify="space-between" p={2} bg="whiteAlpha.50" borderRadius="md">
                    <Text fontSize="sm" color="gray.400">
                      {formatStatName(stat)}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={getStatColor(stat)}>
                      +{value}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </HStack>

            {/* Description */}
            <Box
              className="item-detail-modal-description"
              w="full"
              bg="whiteAlpha.50"
              p={3}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
            >
              <Text fontSize="sm" color="gray.300" textAlign="center" fontStyle="italic">
                "{item.description}"
              </Text>
            </Box>

            {/* Footer Info */}
            <HStack 
              className="item-detail-modal-footer"
              w="full" 
              justify="space-between" 
              pt={1}
              borderTopWidth="1px"
              borderColor="whiteAlpha.200"
            >
              <Text fontSize="sm" color="gray.500">
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
              <HStack spacing={1}>
                <Icon as={GameIcons.GiTwoCoins} color="yellow.400" />
                <Text fontSize="md" fontWeight="bold" color="yellow.400">
                  {item.value}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
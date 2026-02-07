import { memo, useMemo, useState } from 'react'
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
  Collapse,
  Button,
  Code,
} from '@chakra-ui/react'
import { Icon as ChakraIcon } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Item } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RarityLabel } from './RarityLabel'
import { getModifierById } from '@/data/items/mods'
import { getItemSetName, ALL_SETS } from '@/data/items/sets'
import { MultIcon } from '@/components/ui/MultIcon'
import { restoreItemIcon } from '@/utils/itemUtils'
import { dehydrateItem } from '@/utils/itemHydration'

// Gem icons for each rarity - increasing complexity and fanciness
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

const RARITY_COLORS = {
  junk: {
    border: '#4A5568',
    glow: 'rgba(74, 85, 104, 0.5)',
    text: '#9CA3AF',
    textLight: '#D1D5DB',
    bg: 'rgba(74, 85, 104, 0.2)',
    gem: '#6B7280'
  },
  abundant: {
    border: '#10B981',
    glow: 'rgba(16, 185, 129, 0.6)',
    text: '#34D399',
    textLight: '#D1FAE5',
    bg: 'rgba(16, 185, 129, 0.1)',
    gem: '#10B981'
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
  veryRare: {
    border: '#D946EF',
    glow: 'rgba(217, 70, 239, 0.6)',
    text: '#E879F9',
    textLight: '#FAE8FF',
    bg: 'rgba(217, 70, 239, 0.1)',
    gem: '#D946EF'
  },
  magical: {
    border: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.6)',
    text: '#A78BFA',
    textLight: '#EDE9FE',
    bg: 'rgba(139, 92, 246, 0.1)',
    gem: '#8B5CF6'
  },
  elite: {
    border: '#DB2777',
    glow: 'rgba(219, 39, 119, 0.6)',
    text: '#F472B6',
    textLight: '#FCE7F3',
    bg: 'rgba(219, 39, 119, 0.1)',
    gem: '#DB2777'
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
  mythicc: {
    border: '#DC2626',
    glow: 'rgba(220, 38, 38, 0.8)',
    text: '#EF4444',
    textLight: '#FEE2E2',
    bg: 'rgba(220, 38, 38, 0.15)',
    gem: '#DC2626'
  },
  artifact: {
    border: '#EAB308',
    glow: 'rgba(234, 179, 8, 0.7)',
    text: '#FACC15',
    textLight: '#FEF3C7',
    bg: 'rgba(234, 179, 8, 0.1)',
    gem: '#EAB308'
  },
  divine: {
    border: '#FBBF24',
    glow: 'rgba(251, 191, 36, 0.8)',
    text: '#FCD34D',
    textLight: '#FEF3C7',
    bg: 'rgba(251, 191, 36, 0.15)',
    gem: '#FBBF24'
  },
  celestial: {
    border: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.8)',
    text: '#22D3EE',
    textLight: '#CFFAFE',
    bg: 'rgba(6, 182, 212, 0.15)',
    gem: '#06B6D4'
  },
  realityAnchor: {
    border: '#0EA5E9',
    glow: 'rgba(14, 165, 233, 0.8)',
    text: '#38BDF8',
    textLight: '#E0F2FE',
    bg: 'rgba(14, 165, 233, 0.15)',
    gem: '#0EA5E9'
  },
  structural: {
    border: '#6366F1',
    glow: 'rgba(99, 102, 241, 0.8)',
    text: '#818CF8',
    textLight: '#E0E7FF',
    bg: 'rgba(99, 102, 241, 0.15)',
    gem: '#6366F1'
  },
  singularity: {
    border: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.8)',
    text: '#A78BFA',
    textLight: '#EDE9FE',
    bg: 'rgba(139, 92, 246, 0.15)',
    gem: '#8B5CF6'
  },
  void: {
    border: '#1F2937',
    glow: 'rgba(31, 41, 55, 0.9)',
    text: '#6B7280',
    textLight: '#D1D5DB',
    bg: 'rgba(31, 41, 55, 0.3)',
    gem: '#374151'
  },
  elder: {
    border: '#4C1D95',
    glow: 'rgba(76, 29, 149, 0.9)',
    text: '#7C3AED',
    textLight: '#DDD6FE',
    bg: 'rgba(76, 29, 149, 0.2)',
    gem: '#5B21B6'
  },
  layer: {
    border: '#BE185D',
    glow: 'rgba(190, 24, 93, 0.9)',
    text: '#EC4899',
    textLight: '#FBCFE8',
    bg: 'rgba(190, 24, 93, 0.2)',
    gem: '#9F1239'
  },
  plane: {
    border: '#BE123C',
    glow: 'rgba(190, 18, 60, 0.9)',
    text: '#F43F5E',
    textLight: '#FFE4E6',
    bg: 'rgba(190, 18, 60, 0.2)',
    gem: '#9F1239'
  },
  author: {
    border: '#FFFFFF',
    glow: 'rgba(255, 255, 255, 0.9)',
    text: '#FFFFFF',
    textLight: '#FFFFFF',
    bg: 'rgba(255, 255, 255, 0.1)',
    gem: '#F3F4F6'
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

// Optimized animations - use transform and opacity only for performance
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`

interface ItemDetailModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
}

export const ItemDetailModal = memo(function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  // Dev mode JSON viewer state
  const [showJson, setShowJson] = useState(false)
  const [showStorageFormat, setShowStorageFormat] = useState(false)
  const isDev = import.meta.env.DEV

  // Restore icon if missing (handles deserialization issues)
  const restoredItem = useMemo(() => restoreItemIcon(item), [item])
  const rarityTheme = RARITY_COLORS[restoredItem.rarity] || RARITY_COLORS.common
  const IconComponent = restoredItem.icon || GameIcons.GiSwordman
  const GemIcon = RARITY_GEM_ICONS[restoredItem.rarity] || GameIcons.GiCutDiamond
  
  // Prepare JSON for display (exclude icon function)
  const itemJson = useMemo(() => {
    const { icon, ...rest } = restoredItem
    return JSON.stringify(rest, null, 2)
  }, [restoredItem])

  // Prepare storage format JSON (V3 dehydrated)
  const storageJson = useMemo(() => {
    try {
      const dehydrated = dehydrateItem(restoredItem)
      return JSON.stringify(dehydrated, null, 2)
    } catch (error) {
      return `Error dehydrating item: ${error}`
    }
  }, [restoredItem])

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
  const setName = getItemSetName(displayName)
  const setDefinition = setName ? ALL_SETS.find(s => s.name === setName) : null

  // Use set theme if item is part of a set
  const effectiveTheme = setName ? RARITY_COLORS.set : rarityTheme
  const borderColor = item.isUnique ? '#FFD700' : effectiveTheme.border
  const glowColor = item.isUnique ? 'rgba(255, 215, 0, 0.4)' : (setName ? 'rgba(20, 184, 166, 0.5)' : rarityTheme.glow)

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
        className={`item-detail-modal item-detail-modal--${item.rarity}${item.isUnique ? ' item-detail-modal--unique' : ''}${setName ? ' item-detail-modal--set' : ''}`}
        bg="gray.900"
        color="white"
        borderWidth="3px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        position="relative"
        maxH="90%"
        maxW="90%"
        boxShadow={`0 0 20px ${glowColor}`}
        sx={{
          willChange: 'opacity',
        }}
      >
        {/* Decorative corner accents */}
        <div className="item-detail-modal__corner item-detail-modal__corner--top-left" />
        <div className="item-detail-modal__corner item-detail-modal__corner--top-right" />
        <div className="item-detail-modal__corner item-detail-modal__corner--bottom-left" />
        <div className="item-detail-modal__corner item-detail-modal__corner--bottom-right" />

        {/* Background gradient */}
        <div className="item-detail-modal__bg-gradient" />

        <ModalCloseButton zIndex={2} />
        
        <ModalBody p={5} position="relative" zIndex={1} overflowY="auto" maxH="100%">
          <VStack spacing={4}>
            {/* Item Name */}
            <VStack spacing={0}>
              <RarityLabel
                rarity={item.rarity}
                text={displayName}
                isUnique={item.isUnique}
                modifiers={item.modifiers}
                size="xl"
                withGlow
                withPulse={item.isUnique || (item.modifiers && item.modifiers.length > 0)}
                className="item-detail-modal-name"
              />
              {item.isUnique && (
                <Text fontSize="sm" color="yellow.200" fontStyle="italic">
                  ✦ Unique Item ✦
                </Text>
              )}
              {item.modifiers && item.modifiers.length > 0 && item.modifiers.map(modId => {
                const mod = getModifierById(modId);
                if (!mod) return null;
                const ModIcon = mod.icon;
                return (
                  <Text key={modId} fontSize="sm" color={mod.color} fontStyle="italic">
                    {ModIcon && <ModIcon />} {mod.name} {ModIcon && <ModIcon />}
                  </Text>
                );
              })}
            </VStack>

            {/* Main Content Area with Stats on Sides */}
            <HStack spacing={4} align="start" w="full">
              {/* Left Stats Column */}
              <VStack className="item-detail-modal-left-stats" spacing={2} flex={1} align="stretch">
                {leftStats.map(([stat, value]) => (
                  <div key={stat} className="item-detail-modal__stat-row">
                    <Text fontSize="sm" color="gray.400">
                      {formatStatName(stat)}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={getStatColor(stat)}>
                      {value >= 0 ? '+' : ''}{value}
                    </Text>
                  </div>
                ))}
              </VStack>

              {/* Center - Large Icon with Fancy Frame */}
              <VStack className="item-detail-modal-center" spacing={2}>
                <Box position="relative">
                  {/* Outer glow ring */}
                  <div className="item-detail-modal__icon-glow" />
                  
                  {/* Icon frame */}
                  <div className="item-detail-modal__icon-frame">
                    {/* Shimmer effect overlay */}
                    <div className="item-detail-modal__shimmer" />
                    
                    {/* Icon */}
                    <MultIcon
                      icon={IconComponent}
                      boxSize="65px"
                      fontSize="65px"
                      color={(() => {
                        if (item.modifiers && item.modifiers.length > 0) {
                          const mod = getModifierById(item.modifiers[0]);
                          return mod ? mod.color : (item.isUnique ? '#FFD700' : rarityTheme.text);
                        }
                        return item.isUnique ? '#FFD700' : rarityTheme.text;
                      })()}
                      style={{
                        position: 'relative',
                        zIndex: 1,
                      }}
                      className={`itemDetailModalIcon ${item.name}`}
                    />
                  </div>
                </Box>

                {/* Rarity Gem Indicator */}
                <Tooltip 
                  label={
                    <RarityLabel
                      rarity={item.rarity}
                      text={`${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)} Quality`}
                      isUnique={item.isUnique}
                      modifiers={item.modifiers}
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
                      as={GemIcon} 
                      boxSize="32px" 
                      color={rarityTheme.gem}
                    />
                    <div className="item-detail-modal__gem-glow" />
                  </Box>
                </Tooltip>
              </VStack>

              {/* Right Stats Column */}
              <VStack className="item-detail-modal-right-stats" spacing={2} flex={1} align="stretch">
                {rightStats.map(([stat, value]) => (
                  <div key={stat} className="item-detail-modal__stat-row">
                    <Text fontSize="sm" color="gray.400">
                      {formatStatName(stat)}
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color={getStatColor(stat)}>
                      {value >= 0 ? '+' : ''}{value}
                    </Text>
                  </div>
                ))}
              </VStack>
            </HStack>

            {/* Description */}
            <div className="item-detail-modal__description">
              <Text fontSize="sm" color="gray.300" textAlign="center" fontStyle="italic">
                "{item.description}"
              </Text>
            </div>

            {/* Set Information */}
            {setDefinition && (
              <Box
                className="item-detail-modal-set-info"
                w="full"
                bg="rgba(20, 184, 166, 0.2)"
                p={1}
                borderRadius="xl"
                borderWidth="3px"
                borderColor={RARITY_COLORS.set.border}
                boxShadow={`0 0 20px ${RARITY_COLORS.set.border}60, 0 0 30px ${RARITY_COLORS.set.border}30`}
                position="relative"
                overflow="hidden"
              >
                {/* Animated glow background */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="120%"
                  h="120%"
                  bg={`radial-gradient(circle, ${RARITY_COLORS.set.border}20 0%, transparent 70%)`}
                  pointerEvents="none"
                  animation="pulse 3s ease-in-out infinite"
                />
                <VStack spacing={1} align="start" position="relative" zIndex={1}>
                  <HStack spacing={2}>
                    <Icon as={GameIcons.GiCagedBall} color={RARITY_COLORS.set.text} boxSize="24px" />
                    <Text fontSize="md" fontWeight="bold" color={RARITY_COLORS.set.text}>
                      {setName} Set
                    </Text>
                  </HStack>
                  <VStack align="start" spacing={2} w="full" pl={2}>
                    <Text fontSize="sm" color={RARITY_COLORS.set.textLight} fontWeight="bold">
                      Set Bonuses:
                    </Text>
                    {Object.entries(setDefinition.bonuses)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([pieceCount, bonus]) => (
                        <Box
                          key={pieceCount}
                          w="full"
                          bg="rgba(20, 184, 166, 0.1)"
                          p={2}
                          borderRadius="md"
                          borderLeft={`3px solid ${RARITY_COLORS.set.border}`}
                        >
                          <Text fontSize="sm" color={RARITY_COLORS.set.textLight} fontWeight="semibold">
                            ({pieceCount} pieces) {bonus.description}
                          </Text>
                        </Box>
                      ))}
                  </VStack>
                </VStack>
              </Box>
            )}

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

            {/* Dev Mode: JSON Viewer */}
            {isDev && (
              <VStack w="full" spacing={2} pt={2} borderTopWidth="1px" borderColor="whiteAlpha.200">
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="cyan"
                  onClick={() => setShowJson(!showJson)}
                  rightIcon={<Icon as={showJson ? GameIcons.GiPlainCircle : GameIcons.GiCircle} />}
                  w="full"
                >
                  {showJson ? 'Hide' : 'Show'} Item JSON (Dev)
                </Button>
                <Collapse in={showJson} animateOpacity style={{ width: '100%' }}>
                  <VStack w="full" spacing={2}>
                    <HStack w="full" spacing={2}>
                      <Button
                        size="xs"
                        variant={!showStorageFormat ? "solid" : "ghost"}
                        colorScheme="cyan"
                        onClick={() => setShowStorageFormat(false)}
                        flex={1}
                      >
                        Runtime (V2)
                      </Button>
                      <Button
                        size="xs"
                        variant={showStorageFormat ? "solid" : "ghost"}
                        colorScheme="purple"
                        onClick={() => setShowStorageFormat(true)}
                        flex={1}
                      >
                        Storage (V3)
                      </Button>
                    </HStack>
                    <Box
                      bg="blackAlpha.600"
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={showStorageFormat ? "purple.600" : "cyan.600"}
                      maxH="300px"
                      overflowY="auto"
                      w="full"
                    >
                      <Code
                        display="block"
                        whiteSpace="pre"
                        fontSize="xs"
                        bg="transparent"
                        color={showStorageFormat ? "purple.300" : "cyan.300"}
                        w="full"
                      >
                        {showStorageFormat ? storageJson : itemJson}
                      </Code>
                    </Box>
                  </VStack>
                </Collapse>
              </VStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
})
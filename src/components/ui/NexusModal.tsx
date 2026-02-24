/**
 * NexusModal – Nexus building UI
 * Displays permanent meta-progression upgrades purchasable with Meta XP.
 * Each upgrade has rarity-phased tiers; costs ramp exponentially both within
 * a phase and across phases (via GAME_CONFIG.nexus curve settings).
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Tooltip,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react'
import { GiGreatPyramid, GiStarsStack } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import type { ItemRarity } from '@/types'
import {
  NEXUS_UPGRADES,
  NEXUS_CATEGORY_META,
  NEXUS_CATEGORY_ORDER,
  getNexusBonus,
  getNextTierCost,
  getNexusTierBreakdown,
  type NexusUpgrade,
} from '@/data/nexus'

interface NexusModalProps {
  isOpen: boolean
  onClose: () => void
  metaXp: number
  nexusUpgrades: Record<string, number>
  onPurchase: (upgradeId: string) => boolean
}

export function NexusModal({ isOpen, onClose, metaXp, nexusUpgrades, onPurchase }: NexusModalProps) {
  const upgradesByCategory = NEXUS_CATEGORY_ORDER.map(cat => ({
    category: cat,
    meta: NEXUS_CATEGORY_META[cat],
    upgrades: NEXUS_UPGRADES.filter(u => u.category === cat),
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="cyan.800"
        boxShadow="0 0 40px #06B6D430"
        maxH="85vh"
        mx={3}
      >
        <ModalHeader borderBottom="1px solid" borderColor="gray.700" pb={3}>
          <HStack spacing={3}>
            <Icon as={GiGreatPyramid} color="cyan.300" boxSize={7} />
            <VStack spacing={0} align="flex-start">
              <Text color="cyan.200" fontWeight="bold" fontSize="lg" lineHeight={1.2}>
                Nexus
              </Text>
              <Text color="gray.400" fontSize="xs" fontWeight="normal">
                Eternal enhancements forged from accumulated experience
              </Text>
            </VStack>
            <Box flex={1} />
            {/* Meta XP balance */}
            <HStack spacing={1} bg="blackAlpha.600" px={3} py={1} borderRadius="md">
              <Icon as={GiStarsStack} color={GAME_CONFIG.colors.xp.light} boxSize={4} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.xp.light}>
                {metaXp.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="gray.500">Meta XP</Text>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" top={3} right={3} />

        <ModalBody py={4} px={4} overflowY="auto">
          <VStack spacing={6} align="stretch">
            {upgradesByCategory.map(({ category, meta, upgrades }) => (
              <Box key={category}>
                {/* Category header */}
                <HStack mb={3} spacing={2}>
                  <Box h="1px" flex={1} bg="gray.700" />
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="bold"
                    bg="gray.800"
                    color={meta.color}
                    border="1px solid"
                    borderColor={meta.color + '50'}
                    letterSpacing="wider"
                    textTransform="uppercase"
                  >
                    {meta.label}
                  </Badge>
                  <Box h="1px" flex={1} bg="gray.700" />
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {upgrades.map(upgrade => (
                    <UpgradeCard
                      key={upgrade.id}
                      upgrade={upgrade}
                      nexusUpgrades={nexusUpgrades}
                      metaXp={metaXp}
                      onPurchase={onPurchase}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// ─── Individual Upgrade Card ───────────────────────────────────────────────────

interface UpgradeCardProps {
  upgrade: NexusUpgrade
  nexusUpgrades: Record<string, number>
  metaXp: number
  onPurchase: (upgradeId: string) => boolean
}

/** Roman-numeral labels for tiers 1-5 within a rarity phase */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

function UpgradeCard({ upgrade, nexusUpgrades, metaXp, onPurchase }: UpgradeCardProps) {
  const breakdown = getNexusTierBreakdown(upgrade.id, nexusUpgrades)
  const nextCost = getNextTierCost(upgrade.id, nexusUpgrades)
  const canAfford = nextCost !== null && metaXp >= nextCost
  const currentBonus = getNexusBonus(upgrade.id, nexusUpgrades)
  const nextBonus = breakdown.isMaxed ? currentBonus : currentBonus + Math.round(upgrade.bonusPerTier * GAME_CONFIG.nexus.bonusMultiplier)

  const phaseColor = breakdown.rarityColor

  // Phase-advancing: the next tier starts a new rarity phase (tierWithinRarity is 0 and tiers > 0)
  const isPhaseAdvance = !breakdown.isMaxed && breakdown.tierWithinRarity === 0 && breakdown.absoluteTier > 0

  const borderColor = breakdown.isMaxed
    ? phaseColor + '80'
    : canAfford
    ? phaseColor + '70'
    : 'gray.700'

  const bgGlow = canAfford && !breakdown.isMaxed
    ? `0 0 14px ${phaseColor}20`
    : 'none'

  return (
    <Box
      bg="blackAlpha.500"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      position="relative"
      transition="border-color 0.2s, box-shadow 0.2s"
      boxShadow={bgGlow}
      _hover={!breakdown.isMaxed && canAfford ? { borderColor: phaseColor, boxShadow: `0 0 18px ${phaseColor}35` } : {}}
    >
      {/* Maxed badge */}
      {breakdown.isMaxed && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          fontSize="2xs"
          letterSpacing="wider"
          bg={phaseColor + '25'}
          color={phaseColor}
          border="1px solid"
          borderColor={phaseColor + '60'}
          px={2}
          py={0.5}
          borderRadius="md"
        >
          ASCENDED
        </Badge>
      )}

      {/* Icon + name row */}
      <HStack spacing={3} mb={3} align="flex-start">
        <Box
          p={2}
          borderRadius="md"
          bg="blackAlpha.500"
          border="1px solid"
          borderColor={upgrade.color + '40'}
          flexShrink={0}
          boxShadow={`0 0 8px ${upgrade.color}20`}
        >
          <Icon as={upgrade.icon} color={upgrade.color} boxSize={6} />
        </Box>
        <VStack spacing={0} align="flex-start" flex={1} minW={0}>
          <Text color="white" fontWeight="bold" fontSize="sm" lineHeight={1.3}>
            {upgrade.name}
          </Text>
          <Text color="gray.400" fontSize="xs" lineHeight={1.4} noOfLines={2}>
            {upgrade.description}
          </Text>
        </VStack>
      </HStack>

      {/* Rarity phase progress */}
      <Box mb={3}>
        <HStack justify="space-between" mb={1}>
          {/* Rarity phase badge */}
          <HStack spacing={1.5}>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              fontSize="2xs"
              fontWeight="bold"
              px={2}
              py={0.5}
              borderRadius="sm"
              bg={phaseColor + '20'}
              color={'gray.300'}
              border="1px solid"
              borderColor={phaseColor + '50'}
              letterSpacing="wide"
              textTransform="uppercase"
            >
              <Icon as={RARITY_CONFIGS[breakdown.rarityId as ItemRarity].icon} boxSize={2.5} flexShrink={0} />
              {breakdown.isMaxed
                ? breakdown.rarityName
                : isPhaseAdvance
                ? `↑ ${breakdown.rarityName}`
                : breakdown.rarityName}
            </Box>
            {!breakdown.isMaxed && (
              <Text fontSize="xs" color="gray.300">
                {ROMAN[breakdown.tierWithinRarity] ?? breakdown.tierWithinRarity + 1}
                {' / '}
                {ROMAN[breakdown.tiersPerRarity - 1] ?? breakdown.tiersPerRarity}
              </Text>
            )}
          </HStack>

          {/* Bonus display */}
          <Text fontSize="xs" color={upgrade.color} fontWeight="bold">
            +{currentBonus}{upgrade.unit}
            {!breakdown.isMaxed && (
              <Text as="span" color="gray.500" fontWeight="normal">
                {' → '}
                <Text as="span" color="white">+{nextBonus}{upgrade.unit}</Text>
              </Text>
            )}
          </Text>
        </HStack>

        {/* Within-phase progress bar */}
        <Tooltip
          label={`${breakdown.rarityName} phase: ${breakdown.tierWithinRarity} / ${breakdown.tiersPerRarity} tiers`}
          placement="top"
          hasArrow
        >
          <Box>
            <Progress
              value={(breakdown.tierWithinRarity / breakdown.tiersPerRarity) * 100}
              size="xs"
              borderRadius="full"
              bg="gray.700"
              sx={{
                '& > div': {
                  background: breakdown.isMaxed
                    ? `linear-gradient(90deg, ${phaseColor}70, ${phaseColor})`
                    : phaseColor,
                  transition: 'width 0.35s ease',
                },
              }}
            />
          </Box>
        </Tooltip>

        {/* Phase-advance hint */}
        {isPhaseAdvance && (
          <Text fontSize="2xs" color={phaseColor} mt={1} opacity={0.8}>
            ✦ Entering {breakdown.rarityName} phase — costs {GAME_CONFIG.nexus.rarityMagnitudeMultiplier}× higher
          </Text>
        )}
      </Box>

      {/* Purchase row */}
      {!breakdown.isMaxed && (
        <HStack justify="space-between" align="center">
          <HStack spacing={1}>
            <Icon
              as={GiStarsStack}
              color={canAfford ? GAME_CONFIG.colors.xp.light : 'gray.600'}
              boxSize={3.5}
            />
            <Text
              fontSize="xs"
              fontWeight="bold"
              color={canAfford ? GAME_CONFIG.colors.xp.light : 'gray.600'}
            >
              {nextCost?.toLocaleString()} Meta XP
            </Text>
          </HStack>
          <Tooltip
            label={!canAfford ? `Need ${((nextCost ?? 0) - metaXp).toLocaleString()} more Meta XP` : ''}
            placement="top"
            isDisabled={canAfford}
            hasArrow
          >
            <Button
              size="xs"
              onClick={() => onPurchase(upgrade.id)}
              isDisabled={!canAfford}
              bg={canAfford ? (isPhaseAdvance ? '#B7791F30' : '#27653030') : 'gray.700'}
              color={canAfford ? (isPhaseAdvance ? '#F6AD55' : '#68D391') : 'gray.500'}
              border="1px solid"
              borderColor={canAfford ? (isPhaseAdvance ? '#F6AD5570' : '#68D39170') : 'gray.600'}
              _hover={canAfford ? (isPhaseAdvance
                ? { bg: '#B7791F50', borderColor: '#F6AD55' }
                : { bg: '#27653055', borderColor: '#68D391' }
              ) : {}}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              px={4}
            >
              {isPhaseAdvance ? 'Ascend' : 'Upgrade'}
            </Button>
          </Tooltip>
        </HStack>
      )}

      {breakdown.isMaxed && (
        <Text fontSize="xs" color={phaseColor} textAlign="center" fontStyle="italic" opacity={0.9}>
          +{currentBonus}{upgrade.unit} — Eternally Enhanced
        </Text>
      )}
    </Box>
  )
}

/**
 * NexusModal – Nexus building UI
 * Displays permanent meta-progression upgrades purchasable with Meta XP.
 * Each upgrade has multiple tiers; costs escalate with each tier.
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
  Divider,
  Progress,
} from '@chakra-ui/react'
import { GiGreatPyramid, GiStarsStack } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import {
  NEXUS_UPGRADES,
  NEXUS_CATEGORY_META,
  getNexusBonus,
  getNextTierCost,
  type NexusUpgrade,
  type NexusCategory,
} from '@/data/nexusUpgrades'

interface NexusModalProps {
  isOpen: boolean
  onClose: () => void
  metaXp: number
  nexusUpgrades: Record<string, number>
  onPurchase: (upgradeId: string) => boolean
}

const CATEGORY_ORDER: NexusCategory[] = ['fortune', 'combat', 'resilience', 'arcane']

export function NexusModal({ isOpen, onClose, metaXp, nexusUpgrades, onPurchase }: NexusModalProps) {
  const upgradesByCategory = CATEGORY_ORDER.map(cat => ({
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

function UpgradeCard({ upgrade, nexusUpgrades, metaXp, onPurchase }: UpgradeCardProps) {
  const currentTier = nexusUpgrades[upgrade.id] ?? 0
  const isMaxed = currentTier >= upgrade.maxTier
  const nextCost = getNextTierCost(upgrade.id, nexusUpgrades)
  const canAfford = nextCost !== null && metaXp >= nextCost
  const currentBonus = getNexusBonus(upgrade.id, nexusUpgrades)
  const nextBonus = isMaxed ? currentBonus : currentBonus + upgrade.bonusPerTier

  const borderColor = isMaxed
    ? upgrade.color + '80'
    : canAfford
    ? upgrade.color + '60'
    : 'gray.700'

  const bgColor = isMaxed ? 'blackAlpha.600' : canAfford ? 'blackAlpha.500' : 'blackAlpha.400'

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      position="relative"
      transition="border-color 0.2s, box-shadow 0.2s"
      _hover={!isMaxed && canAfford ? { borderColor: upgrade.color, boxShadow: `0 0 12px ${upgrade.color}30` } : {}}
    >
      {/* Maxed badge */}
      {isMaxed && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="cyan"
          variant="subtle"
          fontSize="2xs"
          letterSpacing="wider"
        >
          MAXED
        </Badge>
      )}

      <HStack spacing={3} mb={3} align="flex-start">
        <Box
          p={2}
          borderRadius="md"
          bg="blackAlpha.500"
          border="1px solid"
          borderColor={upgrade.color + '40'}
          flexShrink={0}
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

      {/* Tier progress bar */}
      <Box mb={3}>
        <HStack justify="space-between" mb={1}>
          <Text fontSize="xs" color="gray.500">
            Tier {currentTier} / {upgrade.maxTier}
          </Text>
          <Text fontSize="xs" color={upgrade.color} fontWeight="bold">
            +{currentBonus}{upgrade.unit}
            {!isMaxed && (
              <Text as="span" color="gray.500" fontWeight="normal">
                {' '}→{' '}
                <Text as="span" color="white">+{nextBonus}{upgrade.unit}</Text>
              </Text>
            )}
          </Text>
        </HStack>
        <Progress
          value={(currentTier / upgrade.maxTier) * 100}
          size="xs"
          borderRadius="full"
          bg="gray.700"
          sx={{
            '& > div': {
              background: isMaxed
                ? `linear-gradient(90deg, ${upgrade.color}80, ${upgrade.color})`
                : upgrade.color,
              transition: 'width 0.3s ease',
            },
          }}
        />
      </Box>

      {/* Purchase row */}
      {!isMaxed && (
        <HStack justify="space-between" align="center">
          <HStack spacing={1}>
            <Icon as={GiStarsStack} color={canAfford ? GAME_CONFIG.colors.xp.light : 'gray.600'} boxSize={3.5} />
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
              bg={canAfford ? 'cyan.700' : 'gray.700'}
              color={canAfford ? 'white' : 'gray.500'}
              _hover={canAfford ? { bg: 'cyan.600' } : {}}
              _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
              px={4}
            >
              Upgrade
            </Button>
          </Tooltip>
        </HStack>
      )}

      {isMaxed && (
        <Text fontSize="xs" color={upgrade.color} textAlign="center" fontStyle="italic">
          +{currentBonus}{upgrade.unit} — Fully Enhanced
        </Text>
      )}
    </Box>
  )
}

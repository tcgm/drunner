import {
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Badge,
  Button,
  Tooltip,
} from '@chakra-ui/react'
import { GiStarFormation, GiCoins, GiSwordman, GiShield } from 'react-icons/gi'
import { FaHourglass } from 'react-icons/fa'
import type { HireableHero } from '@/types'
import type { HeroRarity } from '@/types'
import { HERO_RARITY_CONFIG } from '@/systems/heroGeneration'
import { SPECIES_DEFINITIONS } from '@/data/heroes/species'
import { CORE_CLASSES } from '@/data/classes'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'

// ── Rarity colour helper ─────────────────────────────────────────────────

const RARITY_HEX: Record<HeroRarity, string> = {
  common:    '#9CA3AF',
  uncommon:  '#4ADE80',
  rare:      '#60A5FA',
  epic:      '#A855F7',
  legendary: '#F97316',
}

// ── Individual hero card ──────────────────────────────────────────────────

interface HeroCardProps {
  hero: HireableHero
  bankGold: number
  onHire: (heroId: string) => void
}

function HeroCard({ hero, bankGold, onHire }: HeroCardProps) {
  const rCfg = HERO_RARITY_CONFIG[hero.heroRarity]
  const color = RARITY_HEX[hero.heroRarity]
  const speciesDef = SPECIES_DEFINITIONS[hero.species]
  const canAfford = bankGold >= hero.hireCost

  // Resolve class icon
  const iconName = hero.heroClass.icon as keyof typeof GameIcons
  const ClassIcon: IconType = (GameIcons[iconName] ?? GiSwordman) as IconType

  return (
    <Box
      background={`linear-gradient(135deg, ${color}0e 0%, rgba(26,32,44,0.97) 100%)`}
      border="1px solid"
      borderColor={`${color}88`}
      borderRadius="xl"
      p={3.5}
      boxShadow={`0 0 10px ${color}28`}
      _hover={{ borderColor: color, boxShadow: `0 0 18px ${color}44` }}
      transition="all 0.15s"
    >
      {/* Header row */}
      <HStack spacing={3} mb={2} align="flex-start">
        <Box
          bg="gray.900"
          border="1px solid"
          borderColor={`${color}55`}
          borderRadius="lg"
          p={2}
          flexShrink={0}
          boxShadow={`inset 0 0 8px ${color}18`}
        >
          <Icon as={ClassIcon} color={color} boxSize={5} />
        </Box>

        <VStack spacing={0} align="flex-start" flex={1} minW={0}>
          {/* Name + rarity */}
          <HStack spacing={1.5} flexWrap="wrap">
            <Text
              color={color}
              fontWeight="bold"
              fontSize="sm"
              noOfLines={1}
              textShadow={`0 0 10px ${color}55`}
            >
              {hero.name}
            </Text>
            <Text
              as="span"
              color={color}
              fontWeight="semibold"
              fontSize="2xs"
              opacity={0.8}
              letterSpacing="wide"
              flexShrink={0}
            >
              [{rCfg.label}]
            </Text>
          </HStack>

          {/* Class · Species · Level */}
          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="orange" fontSize="2xs" variant="subtle">
              {hero.heroClass.name}
            </Badge>
            <Badge colorScheme="gray" fontSize="2xs" variant="subtle">
              {speciesDef.name}
            </Badge>
            <Badge colorScheme="blue" fontSize="2xs" variant="subtle">
              Lv {hero.level}
            </Badge>
          </HStack>
        </VStack>
      </HStack>

      {/* Stat bonuses */}
      {hero.statBonuses.length > 0 && (
        <Box
          bg="blackAlpha.400"
          borderRadius="md"
          px={2.5}
          py={1.5}
          mb={2}
          border="1px solid"
          borderColor="whiteAlpha.50"
        >
          <HStack spacing={2} flexWrap="wrap">
            {hero.statBonuses.map((b, i) => (
              <HStack key={i} spacing={0.5}>
                <Icon
                  as={b.stat === 'attack' ? GiSwordman : GiShield}
                  boxSize={2.5}
                  color={b.source === 'species' ? 'teal.400' : color}
                />
                <Text
                  fontSize="2xs"
                  color={b.source === 'species' ? 'teal.300' : color}
                  fontWeight="bold"
                >
                  +{b.value} {b.stat === 'maxHp' ? 'HP' : b.stat}
                </Text>
              </HStack>
            ))}
          </HStack>
        </Box>
      )}

      {/* Footer: cost + hire button */}
      <HStack justify="space-between" align="center">
        <HStack spacing={1}>
          <Icon as={GiCoins} color="yellow.500" boxSize={3.5} />
          <Text
            color={canAfford ? 'yellow.400' : 'red.400'}
            fontWeight="bold"
            fontSize="sm"
          >
            {hero.hireCost.toLocaleString()}g
          </Text>
        </HStack>
        <Tooltip
          label={!canAfford ? `Insufficient gold (need ${hero.hireCost.toLocaleString()}g)` : ''}
          isDisabled={canAfford}
          placement="top"
          hasArrow
        >
          <Button
            size="xs"
            colorScheme={canAfford ? 'orange' : 'gray'}
            isDisabled={!canAfford}
            onClick={() => onHire(hero.id)}
            fontWeight="bold"
            letterSpacing="wide"
          >
            Hire
          </Button>
        </Tooltip>
      </HStack>
    </Box>
  )
}

// ── Hero Board panel ──────────────────────────────────────────────────────

interface HeroBoardProps {
  availableHeroes: HireableHero[]
  bankGold: number
  onHire: (heroId: string) => void
  refreshLabel: string
  onForceRefresh?: () => void
}

export function HeroBoard({
  availableHeroes,
  bankGold,
  onHire,
  refreshLabel,
  onForceRefresh,
}: HeroBoardProps) {
  return (
    <Box flex={{ base: 'none', md: '0 0 40%' }} display="flex" flexDirection="column" overflow="hidden" minH={0}>
      {/* Board header */}
      <Box
        px={5} py={3}
        borderBottom="1px solid" borderColor="gray.800"
        bgGradient="linear(to-r,rgba(49,30,120,0.18),transparent)"
        flexShrink={0}
      >
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={GiStarFormation} color="purple.400" boxSize={5} />
            <Text color="purple.300" fontWeight="bold" fontSize="md" letterSpacing="wide">
              Adventurers' Board
            </Text>
            {availableHeroes.length > 0 && (
              <Badge colorScheme="purple" fontSize="xs" borderRadius="full">
                {availableHeroes.length} available
              </Badge>
            )}
          </HStack>
          <HStack spacing={2}>
            {onForceRefresh && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="purple"
                onClick={onForceRefresh}
                fontSize="2xs"
              >
                Refresh
              </Button>
            )}
            <HStack spacing={1} fontSize="2xs" color="gray.600">
              <Icon as={FaHourglass} boxSize={2.5} />
              <Text>Refreshes {refreshLabel}</Text>
            </HStack>
          </HStack>
        </HStack>
      </Box>

      {/* Hero list */}
      <Box
        flex={1} overflowY="auto" px={5} py={4}
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '2px' },
        }}
      >
        {availableHeroes.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Icon as={GiStarFormation} color="gray.700" boxSize={12} mb={4} />
            <Text color="gray.600" fontSize="sm">
              No adventurers available.
            </Text>
            <Text color="gray.700" fontSize="xs" mt={1}>
              Visit again later or refresh the board.
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {availableHeroes.map(hero => (
              <HeroCard
                key={hero.id}
                hero={hero}
                bankGold={bankGold}
                onHire={onHire}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}

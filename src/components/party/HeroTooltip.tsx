import {
  Tooltip,
  VStack,
  HStack,
  Text,
  Icon,
  Badge,
} from '@chakra-ui/react'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'
import { formatDefenseReduction } from '@/utils/defenseUtils'

interface HeroTooltipProps {
  hero: Hero
  children: React.ReactNode
}

export default function HeroTooltip({ hero, children }: HeroTooltipProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

  return (
    <Tooltip
      label={
        <VStack className="hero-tooltip" spacing={2} align="stretch" p={2} minW="250px">
          {/* Header */}
          <HStack className="hero-tooltip-header" spacing={3}>
            <Icon className="hero-tooltip-icon" as={IconComponent} boxSize={10} color="orange.400" />
            <VStack className="hero-tooltip-info" align="start" spacing={0} flex={1}>
              <Text className="hero-tooltip-name" fontSize="md" fontWeight="bold" color="orange.400">
                {hero.name}
              </Text>
              <HStack className="hero-tooltip-badges" spacing={2}>
                <Badge colorScheme="orange" fontSize="xs">
                  Lv {hero.level}
                </Badge>
                <Text fontSize="xs" color="gray.300">
                  {hero.class.name}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* HP Bar */}
          <StatBar 
            label="HP"
            current={hero.stats.hp}
            max={hero.stats.maxHp}
            colorScheme="green"
            size="sm"
            valueSize="xs"
          />

          {/* XP Bar */}
          <StatBar 
            label="XP"
            current={hero.xp}
            max={calculateXpForLevel(hero.level)}
            colorScheme="cyan"
            size="sm"
            valueSize="xs"
          />

          {/* Stats Grid */}
          <HStack className="hero-tooltip-stats" spacing={3} justify="space-around" pt={1}>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--attack" spacing={0}>
              <Icon as={GameIcons.GiSwordman} color={GAME_CONFIG.colors.stats.attack} boxSize={4} />
              <Text fontSize="xs" color="gray.400">ATK</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>
                {hero.stats.attack}
              </Text>
            </VStack>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--defense" spacing={0}>
              <Icon as={GameIcons.GiShield} color={GAME_CONFIG.colors.stats.defense} boxSize={4} />
              <Text fontSize="xs" color="gray.400">DEF</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>
                {hero.stats.defense}
              </Text>
              <Text fontSize="2xs" color="gray.500">{formatDefenseReduction(hero.stats.defense)}</Text>
            </VStack>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--speed" spacing={0}>
              <Icon as={GameIcons.GiRun} color={GAME_CONFIG.colors.stats.speed} boxSize={4} />
              <Text fontSize="xs" color="gray.400">SPD</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>
                {hero.stats.speed}
              </Text>
            </VStack>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--luck" spacing={0}>
              <Icon as={GameIcons.GiClover} color={GAME_CONFIG.colors.stats.luck} boxSize={4} />
              <Text fontSize="xs" color="gray.400">LCK</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>
                {hero.stats.luck}
              </Text>
            </VStack>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--wisdom" spacing={0}>
              <Icon as={GameIcons.GiSpellBook} color={GAME_CONFIG.colors.stats.wisdom} boxSize={4} />
              <Text fontSize="xs" color="gray.400">WIS</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.wisdom}>
                {hero.stats.wisdom ?? 0}
              </Text>
            </VStack>
            <VStack className="hero-tooltip-stat hero-tooltip-stat--charisma" spacing={0}>
              <Icon as={GameIcons.GiTiedScroll} color={GAME_CONFIG.colors.stats.charisma} boxSize={4} />
              <Text fontSize="xs" color="gray.400">CHA</Text>
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.stats.charisma}>
                {hero.stats.charisma ?? 0}
              </Text>
            </VStack>
          </HStack>

          {/* Abilities Count */}
          {hero.abilities.length > 0 && (
            <HStack className="hero-tooltip-abilities" justify="center" pt={1}>
              <Icon as={GameIcons.GiSparkles} boxSize={3} color="purple.400" />
              <Text fontSize="xs" color="gray.400">
                {hero.abilities.length} {hero.abilities.length === 1 ? 'Ability' : 'Abilities'}
              </Text>
            </HStack>
          )}

          <Text fontSize="2xs" color="gray.500" textAlign="center" pt={1}>
            Click for full details
          </Text>
        </VStack>
      }
      placement="right"
      hasArrow
      bg="gray.800"
      color="white"
      borderWidth="2px"
      borderColor="orange.500"
      borderRadius="lg"
      p={0}
      openDelay={300}
      closeDelay={100}
    >
      {children}
    </Tooltip>
  )
}

import {
  Tooltip,
  VStack,
  HStack,
  Text,
  Box,
  Progress,
  Icon,
  Badge,
} from '@chakra-ui/react'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'

interface HeroTooltipProps {
  hero: Hero
  children: React.ReactNode
}

export default function HeroTooltip({ hero, children }: HeroTooltipProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  const hpPercent = (hero.stats.hp / hero.stats.maxHp) * 100
  const xpPercent = (hero.xp / (hero.level * 100)) * 100

  return (
    <Tooltip
      label={
        <VStack spacing={2} align="stretch" p={2} minW="250px">
          {/* Header */}
          <HStack spacing={3}>
            <Icon as={IconComponent} boxSize={10} color="orange.400" />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="md" fontWeight="bold" color="orange.400">
                {hero.name}
              </Text>
              <HStack spacing={2}>
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
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="bold" color="green.400">
                HP
              </Text>
              <Text fontSize="xs" color="gray.200">
                {hero.stats.hp} / {hero.stats.maxHp}
              </Text>
            </HStack>
            <Progress
              value={hpPercent}
              size="sm"
              colorScheme={hpPercent > 50 ? 'green' : hpPercent > 25 ? 'yellow' : 'red'}
              borderRadius="full"
              bg="gray.700"
            />
          </Box>

          {/* XP Bar */}
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="bold" color="blue.400">
                XP
              </Text>
              <Text fontSize="xs" color="gray.200">
                {hero.xp} / {hero.level * 100}
              </Text>
            </HStack>
            <Progress
              value={xpPercent}
              size="sm"
              colorScheme="blue"
              borderRadius="full"
              bg="gray.700"
            />
          </Box>

          {/* Stats Grid */}
          <HStack spacing={3} justify="space-around" pt={1}>
            <VStack spacing={0}>
              <Icon as={GameIcons.GiSwordman} color="red.400" boxSize={4} />
              <Text fontSize="xs" color="gray.400">ATK</Text>
              <Text fontSize="sm" fontWeight="bold" color="red.300">
                {hero.stats.attack}
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Icon as={GameIcons.GiShield} color="blue.400" boxSize={4} />
              <Text fontSize="xs" color="gray.400">DEF</Text>
              <Text fontSize="sm" fontWeight="bold" color="blue.300">
                {hero.stats.defense}
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Icon as={GameIcons.GiRun} color="green.400" boxSize={4} />
              <Text fontSize="xs" color="gray.400">SPD</Text>
              <Text fontSize="sm" fontWeight="bold" color="green.300">
                {hero.stats.speed}
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Icon as={GameIcons.GiClover} color="yellow.400" boxSize={4} />
              <Text fontSize="xs" color="gray.400">LCK</Text>
              <Text fontSize="sm" fontWeight="bold" color="yellow.300">
                {hero.stats.luck}
              </Text>
            </VStack>
          </HStack>

          {/* Abilities Count */}
          {hero.abilities.length > 0 && (
            <HStack justify="center" pt={1}>
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

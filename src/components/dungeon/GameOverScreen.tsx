import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiDeathSkull } from 'react-icons/gi'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/game'

interface GameOverScreenProps {
  depth: number
  onExit: () => void
}

export default function GameOverScreen({ depth, onExit }: GameOverScreenProps) {
  const { party } = useGameStore()
  const penaltyType = GAME_CONFIG.deathPenalty.type

  const getPenaltyDescription = () => {
    switch (penaltyType) {
      case 'halve-levels':
        return 'Heroes will lose half their levels (minimum level 1)'
      case 'reset-levels':
        return 'Heroes will be reset to level 1'
      case 'lose-equipment':
        return 'Heroes will lose all equipment but keep their levels'
      case 'none':
        return 'No penalties - heroes keep everything'
      default:
        return 'Unknown penalty'
    }
  }

  const calculatePenalty = (hero: typeof party[0]) => {
    switch (penaltyType) {
      case 'halve-levels':
        const newLevel = Math.max(1, Math.floor(hero.level / 2))
        return `Level ${hero.level} → ${newLevel}`
      case 'reset-levels':
        return `Level ${hero.level} → 1`
      case 'lose-equipment':
        const equippedCount = Object.values(hero.equipment).filter(item => item !== null).length
        return equippedCount > 0 ? `Lose ${equippedCount} item${equippedCount > 1 ? 's' : ''}` : 'No equipment'
      case 'none':
        return 'No penalty'
      default:
        return ''
    }
  }

  return (
    <Flex h="calc(100vh - 4rem)" align="center" justify="center" p={4}>
      <VStack spacing={6} maxW="800px" w="full">
        <Icon as={GiDeathSkull} boxSize={32} color="red.400" />
        <Heading size="2xl" color="red.400">
          Party Defeated
        </Heading>
        <Text fontSize="xl" color="gray.400">
          Your party has fallen on Floor {depth}
        </Text>

        {/* Penalty Information */}
        <Box
          bg="red.900"
          borderWidth="2px"
          borderColor="red.500"
          borderRadius="lg"
          p={4}
          w="full"
        >
          <VStack spacing={3} align="start">
            <Heading size="sm" color="red.300">Death Penalty: {penaltyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Heading>
            <Text fontSize="sm" color="red.200">
              {getPenaltyDescription()}
            </Text>

            {party.length > 0 && (
              <Box w="full" pt={2}>
                <Text fontSize="xs" color="red.300" mb={2} fontWeight="bold">
                  Penalties per Hero:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                  {party.map(hero => (
                    <Box
                      key={hero.id}
                      bg="red.950"
                      borderRadius="md"
                      p={2}
                      borderWidth="1px"
                      borderColor="red.700"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="sm" color="orange.200" fontWeight="bold">
                          {hero.name}
                        </Text>
                        <Badge colorScheme="red" fontSize="xs">
                          {calculatePenalty(hero)}
                        </Badge>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Box>

        <Text fontSize="md" color="gray.500">
          Return to main menu to start a new run
        </Text>
        <Button size="lg" colorScheme="orange" onClick={onExit}>
          Return to Main Menu
        </Button>
      </VStack>
    </Flex>
  )
}

import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiDeathSkull } from 'react-icons/gi'
import { useEffect } from 'react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/game'

interface GameOverScreenProps {
  depth: number
  onExit: () => void
}

export default function GameOverScreen({ depth, onExit }: GameOverScreenProps) {
  const { party, activeRun, endGame } = useGameStore()
  const penaltyType = GAME_CONFIG.deathPenalty.type
  
  // End the run when the game over screen is shown
  useEffect(() => {
    endGame()
  }, [])

  const getPenaltyDescription = () => {
    switch (penaltyType) {
      case 'halve-levels':
        return 'Heroes have lost half their levels (minimum level 1)'
      case 'reset-levels':
        return 'Heroes have been reset to level 1'
      case 'lose-equipment':
        return 'Heroes have lost all equipment but kept their levels'
      case 'none':
        return 'No penalties - heroes keep everything'
      default:
        return 'Unknown penalty'
    }
  }

  const calculatePenalty = (hero: typeof party[0], originalLevel: number) => {
    switch (penaltyType) {
      case 'halve-levels': {
        return `Level ${originalLevel} → ${hero.level}`
      }
      case 'reset-levels':
        return `Level ${originalLevel} → ${hero.level}`
      case 'lose-equipment': {
        const equippedCount = Object.values(hero.equipment).filter(item => item !== null).length
        return equippedCount > 0 ? `Lose ${equippedCount} item${equippedCount > 1 ? 's' : ''}` : 'No equipment lost'
      }
      case 'none':
        return 'No penalty'
      default:
        return ''
    }
  }

  return (
    <Flex h="100vh" align="center" justify="center" p={4}>
      <VStack spacing={4} maxW="700px" w="full">
        <Icon as={GiDeathSkull} boxSize={20} color="red.400" />
        <Heading size="xl" color="red.400">
          Party Defeated
        </Heading>
        <Text fontSize="lg" color="gray.400">
          Your party has fallen on Floor {depth}
        </Text>

        {/* Penalty Information */}
        <Box
          bg="red.900"
          borderWidth="2px"
          borderColor="red.500"
          borderRadius="lg"
          p={3}
          w="full"
          maxH="40vh"
          overflowY="auto"
        >
          <VStack spacing={2} align="start">
            <Heading size="sm" color="red.300">Death Penalty: {penaltyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Heading>
            <Text fontSize="sm" color="red.200">
              {getPenaltyDescription()}
            </Text>

            {party.length > 0 && activeRun && (
              <Box w="full" pt={2}>
                <Text fontSize="xs" color="red.300" mb={1.5} fontWeight="bold">
                  Penalties Applied:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                  {party.map(hero => {
                    const originalHero = activeRun.heroesUsed.find(h => h.name === hero.name)
                    const originalLevel = originalHero?.level || hero.level
                    return (
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
                            {calculatePenalty(hero, originalLevel)}
                          </Badge>
                        </Flex>
                      </Box>
                    )
                  })}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </Box>

        <Button size="lg" colorScheme="orange" onClick={onExit} mt={2}>
          Return to Main Menu
        </Button>
      </VStack>
    </Flex>
  )
}

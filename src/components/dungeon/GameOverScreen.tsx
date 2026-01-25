import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiDeathSkull } from 'react-icons/gi'
import { useEffect } from 'react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/game'

const MotionVStack = motion.create(VStack)
const MotionBox = motion.create(Box)

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
      <MotionVStack 
        spacing={4} 
        maxW="700px" 
        w="full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0]
          }}
          transition={{
            scale: { type: "spring", stiffness: 200, damping: 20 },
            rotate: { duration: 0.6 },
            y: { 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          <Icon as={GiDeathSkull} boxSize={20} color="red.400" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Heading size="xl" color="red.400">
            Party Defeated
          </Heading>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Text fontSize="lg" color="gray.400">
            Your party has fallen on Floor {depth}
          </Text>
        </motion.div>

        {/* Penalty Information */}
        <MotionBox
          bg="red.900"
          borderWidth="2px"
          borderColor="red.500"
          borderRadius="lg"
          p={3}
          w="full"
          maxH="40vh"
          overflowY="auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                  {party.map((hero, index) => {
                    const originalHero = activeRun.heroesUsed.find(h => h.name === hero.name)
                    const originalLevel = originalHero?.level || hero.level
                    return (
                      <motion.div
                        key={hero.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Box
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
                      </motion.div>
                    )
                  })}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </MotionBox>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button size="lg" colorScheme="orange" onClick={onExit} mt={2}>
            Return to Main Menu
          </Button>
        </motion.div>
      </MotionVStack>
    </Flex>
  )
}

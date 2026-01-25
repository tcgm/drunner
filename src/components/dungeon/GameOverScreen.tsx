import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge, Divider, HStack } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiDeathSkull, GiTwoCoins, GiLaurelsTrophy, GiSwordWound, GiHearts, GiChest } from 'react-icons/gi'
import { useEffect } from 'react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'

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
  }, [endGame])

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
    <Flex className="game-over-screen" h="100vh" align="center" justify="center" p={2} overflowY="auto">
      <MotionVStack 
        className="game-over-screen-content"
        spacing={2} 
        maxW="600px" 
        w="full"
        py={4}
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
          <Icon as={GiDeathSkull} boxSize={12} color="red.400" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Heading size="lg" color="red.400">
            Party Defeated
          </Heading>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Text fontSize="md" color="gray.400">
            Your party has fallen on Floor {depth}
          </Text>
        </motion.div>

        {/* Run Statistics */}
        {activeRun && (
          <MotionBox
            bg="rgba(0,0,0,0.3)"
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.700"
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <VStack spacing={2} align="stretch">
              <Text color="gray.300" fontSize="xs" fontWeight="semibold" textAlign="center">
                Run Statistics
              </Text>
              
              <SimpleGrid columns={3} spacing={2}>
                <Box textAlign="center">
                  <Icon as={GiTwoCoins} boxSize={5} color="yellow.400" mb={1} />
                  <Text color="gray.400" fontSize="xs">Gold Earned</Text>
                  <Text color="yellow.400" fontSize="md" fontWeight="bold">
                    {activeRun.goldEarned || 0}
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Icon as={GiLaurelsTrophy} boxSize={5} color="green.400" mb={1} />
                  <Text color="gray.400" fontSize="xs">Events</Text>
                  <Text color="green.400" fontSize="md" fontWeight="bold">
                    {activeRun.eventsCompleted || 0}
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Icon as={GiDeathSkull} boxSize={5} color="red.400" mb={1} />
                  <Text color="gray.400" fontSize="xs">Enemies</Text>
                  <Text color="red.400" fontSize="md" fontWeight="bold">
                    {activeRun.enemiesDefeated || 0}
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Icon as={GiChest} boxSize={5} color="blue.400" mb={1} />
                  <Text color="gray.400" fontSize="xs">Items</Text>
                  <Text color="blue.400" fontSize="md" fontWeight="bold">
                    {activeRun.itemsFound || 0}
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Icon as={GiSwordWound} boxSize={5} color="orange.400" mb={1} />
                  <Text color="gray.400" fontSize="xs">Damage</Text>
                  <Text color="orange.400" fontSize="md" fontWeight="bold">
                    {activeRun.damageTaken || 0}
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Icon as={GiHearts} boxSize={5} color="green.300" mb={1} />
                  <Text color="gray.400" fontSize="xs">Healing</Text>
                  <Text color="green.300" fontSize="md" fontWeight="bold">
                    {activeRun.healingReceived || 0}
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </MotionBox>
        )}

        {/* Death Details */}
        {activeRun?.deathDetails && (
          <MotionBox
            bg="rgba(139, 0, 0, 0.2)"
            p={3}
            borderRadius="md"
            border="2px solid"
            borderColor="red.600"
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <VStack spacing={2} align="stretch">
              <HStack justify="center" spacing={2}>
                <Icon as={GiDeathSkull} boxSize={4} color="red.400" />
                <Text color="red.300" fontSize="sm" fontWeight="bold">
                  Killing Blow
                </Text>
              </HStack>
              
              <Box textAlign="center" mb={1}>
                <Badge colorScheme="red" fontSize="xs" px={2} py={0.5}>
                  {activeRun.deathDetails.eventType.toUpperCase()}
                </Badge>
                <Text color="red.200" fontSize="md" fontWeight="semibold" mt={0.5}>
                  {activeRun.deathDetails.eventTitle}
                </Text>
              </Box>

              {activeRun.deathDetails.heroDamage.length > 0 && (
                <>
                  <Divider borderColor="red.800" />
                  <Text color="red.300" fontSize="2xs" fontWeight="semibold" textAlign="center">
                    Damage Dealt to Heroes
                  </Text>
                  <SimpleGrid columns={2} spacing={1.5}>
                    {activeRun.deathDetails.heroDamage.map((damage, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                      >
                        <Box
                          bg="rgba(0,0,0,0.3)"
                          p={1.5}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="red.900"
                        >
                          <HStack justify="space-between">
                            <Text color="gray.300" fontSize="xs">
                              {damage.heroName}
                            </Text>
                            <HStack spacing={0.5}>
                              <Icon as={GiSwordWound} boxSize={3} color="red.400" />
                              <Text color="red.400" fontSize="xs" fontWeight="bold">
                                {damage.damageReceived}
                              </Text>
                            </HStack>
                          </HStack>
                        </Box>
                      </motion.div>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </VStack>
          </MotionBox>
        )}
        
        <MotionBox
          bg="red.900"
          borderWidth="2px"
          borderColor="red.500"
          borderRadius="lg"
          p={2.5}
          w="full"
          maxH="200px"
          overflowY="auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <VStack spacing={1.5} align="start">
            <Heading size="xs" color="red.300">Death Penalty: {penaltyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Heading>
            <Text fontSize="xs" color="red.200">
              {getPenaltyDescription()}
            </Text>

            {party.length > 0 && activeRun && (
              <Box w="full" pt={1.5}>
                <Text fontSize="2xs" color="red.300" mb={1} fontWeight="bold">
                  Penalties Applied:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={1.5} w="full">
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
                          p={1.5}
                          borderWidth="1px"
                          borderColor="red.700"
                        >
                          <Flex justify="space-between" align="center">
                            <Text fontSize="xs" color="orange.200" fontWeight="bold">
                              {hero.name}
                            </Text>
                            <Badge colorScheme="red" fontSize="2xs">
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
          <Button size="md" colorScheme="orange" onClick={onExit} mt={1}>
            Return to Main Menu
          </Button>
        </motion.div>
      </MotionVStack>
    </Flex>
  )
}

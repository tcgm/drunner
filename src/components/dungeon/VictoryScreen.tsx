import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge, Divider, HStack } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiTwoCoins, GiTrophyCup, GiLaurelsTrophy, GiSwordWound, GiHearts, GiChest, GiDeathSkull } from 'react-icons/gi'
import { useEffect } from 'react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'

const MotionVStack = motion.create(VStack)
const MotionBox = motion.create(Box)

interface VictoryScreenProps {
  depth: number
  onExit: () => void
}

export default function VictoryScreen({ depth, onExit }: VictoryScreenProps) {
  const { party, activeRun, victoryGame, dungeon } = useGameStore()
  
  // Trigger victory when the screen is shown
  useEffect(() => {
    victoryGame()
  }, [victoryGame])

  return (
    <Flex className="victory-screen" h="100vh" align="center" justify="center" p={4}>
      <MotionVStack 
        className="victory-screen-content"
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
          <Icon as={GiTrophyCup} boxSize={20} color="yellow.400" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Heading size="xl" color="yellow.400">
            Victory!
          </Heading>
        </motion.div>
        
        <MotionBox
          bg="rgba(0,0,0,0.3)"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="yellow.600"
          w="full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VStack spacing={3} align="stretch">
            <Text color="gray.200" fontSize="md" textAlign="center">
              You have conquered the dungeon and defeated the Dungeon Lord!
            </Text>
            <Text color="green.400" fontSize="lg" fontWeight="bold" textAlign="center">
              Depth Reached: {depth}
            </Text>
            
            <Divider borderColor="yellow.800" my={2} />
            
            <SimpleGrid columns={3} spacing={3}>
              <Box textAlign="center">
                <Icon as={GiTwoCoins} boxSize={5} color="yellow.400" mb={1} />
                <Text color="gray.400" fontSize="xs">Gold Earned</Text>
                <Text color="yellow.400" fontSize="md" fontWeight="bold">
                  {activeRun?.goldEarned || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiLaurelsTrophy} boxSize={5} color="green.400" mb={1} />
                <Text color="gray.400" fontSize="xs">Events</Text>
                <Text color="green.400" fontSize="md" fontWeight="bold">
                  {activeRun?.eventsCompleted || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiDeathSkull} boxSize={5} color="red.400" mb={1} />
                <Text color="gray.400" fontSize="xs">Enemies</Text>
                <Text color="red.400" fontSize="md" fontWeight="bold">
                  {activeRun?.enemiesDefeated || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiChest} boxSize={5} color="blue.400" mb={1} />
                <Text color="gray.400" fontSize="xs">Items Found</Text>
                <Text color="blue.400" fontSize="md" fontWeight="bold">
                  {activeRun?.itemsFound || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiSwordWound} boxSize={5} color="orange.400" mb={1} />
                <Text color="gray.400" fontSize="xs">Damage Taken</Text>
                <Text color="orange.400" fontSize="md" fontWeight="bold">
                  {activeRun?.damageTaken || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiHearts} boxSize={5} color="green.300" mb={1} />
                <Text color="gray.400" fontSize="xs">Healing</Text>
                <Text color="green.300" fontSize="md" fontWeight="bold">
                  {activeRun?.healingReceived || 0}
                </Text>
              </Box>
            </SimpleGrid>

            {/* Expanded Event Type Statistics */}
            <Divider borderColor="yellow.800" my={2} />
            <Text color="gray.400" fontSize="xs" textAlign="center" mb={2}>Event Breakdown</Text>
            <SimpleGrid columns={4} spacing={2} fontSize="xs">
              <Box textAlign="center">
                <Text color="gray.500">Combat</Text>
                <Text fontWeight="bold" color="red.300">
                  {activeRun?.combatEvents || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Treasure</Text>
                <Text fontWeight="bold" color="yellow.300">
                  {activeRun?.treasureEvents || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Rest</Text>
                <Text fontWeight="bold" color="green.300">
                  {activeRun?.restEvents || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Bosses</Text>
                <Text fontWeight="bold" color="purple.300">
                  {activeRun?.bossesDefeated || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Merchant</Text>
                <Text fontWeight="bold" color="purple.400">
                  {activeRun?.merchantVisits || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Traps</Text>
                <Text fontWeight="bold" color="orange.300">
                  {activeRun?.trapsTriggered || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Choice</Text>
                <Text fontWeight="bold" color="blue.300">
                  {activeRun?.choiceEvents || 0}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.500">Level Ups</Text>
                <Text fontWeight="bold" color="cyan.300">
                  {activeRun?.totalLevelsGained || 0}
                </Text>
              </Box>
            </SimpleGrid>
            
            {(activeRun?.xpGained ?? 0) > 0 && (
              <>
                <Divider borderColor="yellow.800" my={2} />
                <Box textAlign="center">
                  <Text color="gray.400" fontSize="xs">Total XP Gained</Text>
                  <Text color="purple.300" fontSize="lg" fontWeight="bold">
                    {activeRun?.xpGained || 0}
                  </Text>
                </Box>
              </>
            )}
            
            {(activeRun?.xpMentored ?? 0) > 0 || (activeRun?.metaXpGained ?? 0) > 0 ? (
              <>
                <Divider borderColor="yellow.800" my={2} />
                <HStack spacing={4} justify="center">
                  {(activeRun?.xpMentored ?? 0) > 0 && (
                    <Box textAlign="center">
                      <Text color="gray.400" fontSize="xs">XP Mentored</Text>
                      <Text color="cyan.300" fontSize="md" fontWeight="bold">
                        {activeRun?.xpMentored}
                      </Text>
                    </Box>
                  )}
                  {(activeRun?.metaXpGained ?? 0) > 0 && (
                    <Box textAlign="center">
                      <Text color="gray.400" fontSize="xs">Meta XP Gained</Text>
                      <Text color={GAME_CONFIG.colors.xp.light} fontSize="md" fontWeight="bold">
                        {activeRun?.metaXpGained}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </>
            ) : null}
          </VStack>
        </MotionBox>
        
        <MotionBox
          bg="rgba(0,0,0,0.3)"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="green.700"
          w="full"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <VStack spacing={2} align="stretch">
            <Text color="green.400" fontSize="md" fontWeight="semibold" mb={2}>
              Victorious Heroes
            </Text>
            
            <SimpleGrid columns={2} spacing={3}>
              {party.filter(h => h !== null).map((hero, idx) => {
                const originalLevel = activeRun?.heroesUsed.find(h => h.name === hero.name)?.level || hero.level
                
                return (
                  <Box 
                    key={idx}
                    p={2}
                    bg="rgba(0,0,0,0.2)"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.800"
                  >
                    <Text color="gray.200" fontSize="sm" fontWeight="semibold">
                      {hero.name}
                    </Text>
                    <Text color="gray.400" fontSize="xs">
                      {hero.class.name}
                    </Text>
                    <Badge colorScheme="green" fontSize="xs" mt={1}>
                      Level {hero.level}
                    </Badge>
                    <Text color="green.400" fontSize="xs" mt={1}>
                      {hero.isAlive ? '⚔️ Survived' : '💀 Died Heroically'}
                    </Text>
                  </Box>
                )
              })}
            </SimpleGrid>
          </VStack>
        </MotionBox>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            size="lg"
            colorScheme="yellow"
            onClick={onExit}
            w="full"
          >
            Return to Town
          </Button>
        </motion.div>
      </MotionVStack>
    </Flex>
  )
}

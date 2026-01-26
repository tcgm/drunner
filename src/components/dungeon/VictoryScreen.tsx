import { VStack, Heading, Button, Text, Flex, Box, SimpleGrid, Badge } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiTwoCoins, GiTrophyCup, GiLaurelsTrophy } from 'react-icons/gi'
import { useEffect } from 'react'
import { useGameStore } from '@store/gameStore'

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
  }, [])

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
            
            <SimpleGrid columns={2} spacing={4} mt={2}>
              <Box textAlign="center">
                <Icon as={GiTwoCoins} boxSize={6} color="yellow.400" mb={1} />
                <Text color="gray.300" fontSize="sm">Gold Earned</Text>
                <Text color="yellow.400" fontSize="lg" fontWeight="bold">
                  {dungeon.gold}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon as={GiLaurelsTrophy} boxSize={6} color="green.400" mb={1} />
                <Text color="gray.300" fontSize="sm">Events Completed</Text>
                <Text color="green.400" fontSize="lg" fontWeight="bold">
                  {activeRun?.eventsCompleted || 0}
                </Text>
              </Box>
              {activeRun && activeRun.xpMentored > 0 && (
                <Box textAlign="center">
                  <Text color="gray.300" fontSize="sm">XP Mentored</Text>
                  <Text color="cyan.300" fontSize="lg" fontWeight="bold">
                    {activeRun.xpMentored}
                  </Text>
                </Box>
              )}
              {activeRun && activeRun.metaXpGained > 0 && (
                <Box textAlign="center">
                  <Text color="gray.300" fontSize="sm">Meta XP Gained</Text>
                  <Text color="purple.300" fontSize="lg" fontWeight="bold">
                    {activeRun.metaXpGained}
                  </Text>
                </Box>
              )}
            </SimpleGrid>
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

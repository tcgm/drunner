import { VStack, Text, Box, Heading, SimpleGrid, Badge, Flex } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GAME_CONFIG } from '@/config/gameConfig'
import type { Hero, Run } from '@/types'

const MotionBox = motion.create(Box)

interface DeathPenaltyProps {
  party: (Hero | null)[]
  run: Run | null
}

export default function DeathPenalty({ party, run }: DeathPenaltyProps) {
  const penaltyType = GAME_CONFIG.deathPenalty.type

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

  const calculatePenalty = (hero: Hero, originalLevel: number) => {
    switch (penaltyType) {
      case 'halve-levels':
        return `Level ${originalLevel} → ${hero.level}`
      case 'reset-levels':
        return `Level ${originalLevel} → ${hero.level}`
      case 'lose-equipment': {
        const equippedCount = Object.values(hero.slots).filter(item => item !== null).length
        return equippedCount > 0 ? `Lost ${equippedCount} item${equippedCount > 1 ? 's' : ''}` : 'No equipment lost'
      }
      case 'none':
        return 'No penalty'
      default:
        return ''
    }
  }

  const penaltyName = penaltyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <MotionBox
      bg="rgba(139, 0, 0, 0.3)"
      borderWidth="2px"
      borderColor="red.500"
      borderRadius="lg"
      p={5}
      w="full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" color="red.300" textAlign="center">
          Death Penalty: {penaltyName}
        </Heading>
        <Text fontSize="md" color="red.200" textAlign="center">
          {getPenaltyDescription()}
        </Text>

        {party.length > 0 && run && (
          <Box w="full">
            <Text fontSize="sm" color="red.300" mb={3} fontWeight="bold" textAlign="center">
              Penalties Applied:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full">
              {party.filter(h => h !== null).map((hero, index) => {
                const originalHero = run.heroesUsed.find(h => h.name === hero.name)
                const originalLevel = originalHero?.level || hero.level
                
                return (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Box
                      bg="rgba(0, 0, 0, 0.4)"
                      borderRadius="md"
                      p={3}
                      borderWidth="1px"
                      borderColor="red.700"
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontSize="md" color="orange.200" fontWeight="bold">
                          {hero.name}
                        </Text>
                        <Badge colorScheme="red" fontSize="sm" px={2}>
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
  )
}

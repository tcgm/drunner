import { VStack, Text, Box, SimpleGrid, Badge, Divider, HStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Hero, Run } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'

const MotionBox = motion.create(Box)

interface PartyDisplayProps {
  party: (Hero | null)[]
  run: Run | null
}

export default function PartyDisplay({ party, run }: PartyDisplayProps) {
  return (
    <VStack spacing={4} align="stretch" overflowY="auto" pl={2} w="full">
      <MotionBox
        bg="rgba(0,0,0,0.4)"
        p={5}
        borderRadius="lg"
        border="2px solid"
        borderColor="green.700"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        flex={1}
      >
        <Text color="green.400" fontSize="lg" fontWeight="bold" mb={4}>
          Your Heroes
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {party.filter(h => h !== null).map((hero, idx) => {
            const originalLevel = run?.heroesUsed.find(h => h.name === hero.name)?.level || hero.level
            
            return (
              <Box 
                key={idx}
                p={4}
                bg="rgba(0,0,0,0.3)"
                borderRadius="lg"
                border="2px solid"
                borderColor={hero.isAlive ? "green.700" : "red.700"}
              >
                <VStack align="start" spacing={2}>
                  <Text color="gray.200" fontSize="lg" fontWeight="bold">
                    {hero.name}
                  </Text>
                  <Text color="gray.400" fontSize="md">
                    {hero.class.name}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="green" fontSize="sm">
                      Level {hero.level}
                    </Badge>
                    {hero.level > originalLevel && (
                      <Badge colorScheme="cyan" fontSize="sm">
                        +{hero.level - originalLevel}
                      </Badge>
                    )}
                  </HStack>
                  <Text 
                    color={hero.isAlive ? "green.400" : "red.400"} 
                    fontSize="md" 
                    fontWeight="semibold"
                  >
                    {hero.isAlive ? '⚔️ Survived' : '💀 Died Heroically'}
                  </Text>
                  <Divider borderColor="gray.700" />
                  <SimpleGrid columns={2} spacing={2} w="full" fontSize="sm">
                    <Text color="gray.400">HP: <Text as="span" color="green.300">{hero.stats.hp}/{calculateTotalStats(hero).maxHp}</Text></Text>
                    <Text color="gray.400">ATK: <Text as="span" color="red.300">{calculateTotalStats(hero).attack}</Text></Text>
                    <Text color="gray.400">DEF: <Text as="span" color="blue.300">{calculateTotalStats(hero).defense}</Text></Text>
                    <Text color="gray.400">SPD: <Text as="span" color="yellow.300">{calculateTotalStats(hero).speed}</Text></Text>
                  </SimpleGrid>
                </VStack>
              </Box>
            )
          })}
        </SimpleGrid>
      </MotionBox>
    </VStack>
  )
}

import { VStack, Text, Box, SimpleGrid, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiTwoCoins, GiLaurelsTrophy, GiSwordWound, GiHearts, GiChest, GiDeathSkull } from 'react-icons/gi'
import { GAME_CONFIG } from '@/config/gameConfig'
import type { Run } from '@/types'

const MotionBox = motion.create(Box)

interface RunStatisticsProps {
  run: Run | null
}

export default function RunStatistics({ run }: RunStatisticsProps) {
  if (!run) return null

  return (
    <VStack spacing={4} align="stretch" overflowY="auto" pr={2} w="full">
      {/* Primary Stats */}
      <MotionBox
        bg="rgba(0,0,0,0.4)"
        p={5}
        borderRadius="lg"
        border="2px solid"
        borderColor="yellow.600"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Text color="yellow.400" fontSize="lg" fontWeight="bold" mb={4}>
          Run Statistics
        </Text>
        <SimpleGrid columns={3} spacing={4}>
          <Box textAlign="center">
            <Icon as={GiTwoCoins} boxSize={8} color="yellow.400" mb={2} />
            <Text color="gray.400" fontSize="sm">Gold Earned</Text>
            <Text color="yellow.400" fontSize="xl" fontWeight="bold">
              {run.goldEarned || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Icon as={GiLaurelsTrophy} boxSize={8} color="green.400" mb={2} />
            <Text color="gray.400" fontSize="sm">Events</Text>
            <Text color="green.400" fontSize="xl" fontWeight="bold">
              {run.eventsCompleted || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Icon as={GiDeathSkull} boxSize={8} color="red.400" mb={2} />
            <Text color="gray.400" fontSize="sm">Enemies</Text>
            <Text color="red.400" fontSize="xl" fontWeight="bold">
              {run.enemiesDefeated || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Icon as={GiChest} boxSize={8} color="blue.400" mb={2} />
            <Text color="gray.400" fontSize="sm">Items Found</Text>
            <Text color="blue.400" fontSize="xl" fontWeight="bold">
              {run.itemsFound || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Icon as={GiSwordWound} boxSize={8} color="orange.400" mb={2} />
            <Text color="gray.400" fontSize="sm">Damage Taken</Text>
            <Text color="orange.400" fontSize="xl" fontWeight="bold">
              {run.damageTaken || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Icon as={GiHearts} boxSize={8} color="green.300" mb={2} />
            <Text color="gray.400" fontSize="sm">Healing</Text>
            <Text color="green.300" fontSize="xl" fontWeight="bold">
              {run.healingReceived || 0}
            </Text>
          </Box>
        </SimpleGrid>
      </MotionBox>

      {/* Event Breakdown */}
      <MotionBox
        bg="rgba(0,0,0,0.4)"
        p={5}
        borderRadius="lg"
        border="1px solid"
        borderColor="yellow.700"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Text color="yellow.400" fontSize="md" fontWeight="bold" mb={3}>
          Event Breakdown
        </Text>
        <SimpleGrid columns={4} spacing={3}>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Combat</Text>
            <Text fontWeight="bold" color="red.300" fontSize="lg">
              {run.combatEvents || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Treasure</Text>
            <Text fontWeight="bold" color="yellow.300" fontSize="lg">
              {run.treasureEvents || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Rest</Text>
            <Text fontWeight="bold" color="green.300" fontSize="lg">
              {run.restEvents || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Bosses</Text>
            <Text fontWeight="bold" color="purple.300" fontSize="lg">
              {run.bossesDefeated || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Merchant</Text>
            <Text fontWeight="bold" color="purple.400" fontSize="lg">
              {run.merchantVisits || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Traps</Text>
            <Text fontWeight="bold" color="orange.300" fontSize="lg">
              {run.trapsTriggered || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Choice</Text>
            <Text fontWeight="bold" color="blue.300" fontSize="lg">
              {run.choiceEvents || 0}
            </Text>
          </Box>
          <Box textAlign="center">
            <Text color="gray.400" fontSize="sm">Levels</Text>
            <Text fontWeight="bold" color="cyan.300" fontSize="lg">
              {run.totalLevelsGained || 0}
            </Text>
          </Box>
        </SimpleGrid>
      </MotionBox>

      {/* XP Stats */}
      {((run.xpGained ?? 0) > 0 || (run.xpMentored ?? 0) > 0 || (run.metaXpGained ?? 0) > 0) && (
        <MotionBox
          bg="rgba(0,0,0,0.4)"
          p={5}
          borderRadius="lg"
          border="1px solid"
          borderColor="purple.700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Text color="purple.400" fontSize="md" fontWeight="bold" mb={3}>
            Experience
          </Text>
          <SimpleGrid columns={3} spacing={4}>
            {(run.xpGained ?? 0) > 0 && (
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">XP Gained</Text>
                <Text color="purple.300" fontSize="xl" fontWeight="bold">
                  {run.xpGained || 0}
                </Text>
              </Box>
            )}
            {(run.xpMentored ?? 0) > 0 && (
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">XP Mentored</Text>
                <Text color="cyan.300" fontSize="xl" fontWeight="bold">
                  {run.xpMentored}
                </Text>
              </Box>
            )}
            {(run.metaXpGained ?? 0) > 0 && (
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">Meta XP</Text>
                <Text color={GAME_CONFIG.colors.xp.light} fontSize="xl" fontWeight="bold">
                  {run.metaXpGained}
                </Text>
              </Box>
            )}
          </SimpleGrid>
        </MotionBox>
      )}
    </VStack>
  )
}

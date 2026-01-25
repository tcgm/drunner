import { VStack, Heading, Button, Box, Text, HStack, Badge, SimpleGrid } from '@chakra-ui/react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/game'
import type { Run } from '@/types'

interface RunHistoryScreenProps {
  onBack: () => void
}

export default function RunHistoryScreen({ onBack }: RunHistoryScreenProps) {
  const { runHistory, activeRun } = useGameStore()

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (start: number, end?: number) => {
    const duration = (end || Date.now()) - start
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  const RunCard = ({ run }: { run: Run }) => (
    <Box
      bg="gray.800"
      borderRadius="lg"
      p={4}
      borderWidth="2px"
      borderColor={
        run.result === 'active' ? 'orange.500' : 
        run.result === 'victory' ? 'green.500' : 
        run.result === 'retreat' ? 'yellow.500' :
        'red.500'
      }
    >
      <VStack align="start" spacing={3}>
        <HStack justify="space-between" w="full">
          <HStack spacing={2}>
            <Badge 
              colorScheme={
                run.result === 'active' ? 'orange' : 
                run.result === 'victory' ? 'green' : 
                run.result === 'retreat' ? 'yellow' :
                'red'
              }
              fontSize="sm"
            >
              {run.result === 'active' ? 'In Progress' : 
               run.result === 'victory' ? 'Victory' : 
               run.result === 'retreat' ? 'Retreated' :
               'Defeated'}
            </Badge>
            <Badge colorScheme="blue" fontSize="sm">
              Floor {run.finalDepth}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {formatDate(run.startDate)}
          </Text>
        </HStack>

        <SimpleGrid columns={3} spacing={4} w="full">
          <Box>
            <Text fontSize="xs" color="gray.400">Duration</Text>
            <Text fontSize="sm" fontWeight="bold" color="orange.200">
              {formatDuration(run.startDate, run.endDate)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">Events</Text>
            <Text fontSize="sm" fontWeight="bold" color="cyan.200">
              {run.eventsCompleted}
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">
              {run.result === 'retreat' || run.result === 'victory' ? 'Gold Gained' : 'Gold Lost'}
            </Text>
            <Text 
              fontSize="sm" 
              fontWeight="bold" 
              color={run.result === 'retreat' || run.result === 'victory' ? 'green.300' : 'red.300'}
            >
              {run.result === 'retreat' || run.result === 'victory' 
                ? `+${Math.max(0, run.goldEarned - run.goldSpent)}`
                : (run.result === 'defeat' && GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat 
                    ? `-${Math.max(0, run.goldEarned - run.goldSpent)}` 
                    : '0')}
            </Text>
          </Box>
        </SimpleGrid>

        <Box w="full" bg="gray.900" borderRadius="md" p={2}>
          <Text fontSize="xs" color="gray.400" mb={1}>Gold Details</Text>
          <SimpleGrid columns={3} spacing={2}>
            <Box>
              <Text fontSize="xs" color="green.400">Earned</Text>
              <Text fontSize="sm" fontWeight="bold" color="green.300">
                +{run.goldEarned}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="orange.400">Spent</Text>
              <Text fontSize="sm" fontWeight="bold" color="orange.300">
                -{run.goldSpent}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="red.400">Lost</Text>
              <Text fontSize="sm" fontWeight="bold" color="red.300">
                {run.result === 'defeat' && GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat 
                  ? `-${Math.max(0, run.goldEarned - run.goldSpent)}` 
                  : '0'}
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box w="full">
          <Text fontSize="xs" color="gray.400" mb={1}>Party</Text>
          <HStack spacing={2} flexWrap="wrap">
            {run.heroesUsed.map((hero, idx) => (
              <Badge key={idx} colorScheme="purple" fontSize="xs">
                {hero.class} (Lvl {hero.level})
              </Badge>
            ))}
          </HStack>
        </Box>
      </VStack>
    </Box>
  )

  const allRuns = activeRun ? [activeRun, ...runHistory] : runHistory

  return (
    <Box h="100vh" w="100vw" bg="gray.900" display="flex" flexDirection="column" overflow="hidden">
      {/* Top Bar */}
      <Box bg="gray.950" borderBottom="2px solid" borderColor="orange.800" px={4} py={3} flexShrink={0}>
        <HStack justify="space-between">
          <Heading size="md" color="orange.400">Run History</Heading>
          <Button variant="outline" colorScheme="gray" onClick={onBack} size="sm">
            Back to Menu
          </Button>
        </HStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflowY="auto" p={6}>
        <VStack spacing={4} maxW="800px" mx="auto">
          {allRuns.length === 0 ? (
            <Box tex
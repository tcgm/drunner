import { VStack, Text, HStack } from '@chakra-ui/react'

interface FloorStatsProps {
  eventsCleared: number
  enemiesDefeated: number
  treasureFound: number
}

export default function FloorStats({ eventsCleared, enemiesDefeated, treasureFound }: FloorStatsProps) {
  return (
    <>
      <Text fontSize="sm" fontWeight="bold" mb={2}>Current Floor</Text>
      <VStack align="stretch" spacing={1} fontSize="xs" color="gray.400">
        <HStack justify="space-between">
          <Text>Events Cleared:</Text>
          <Text color="white" fontWeight="bold">{eventsCleared}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Enemies Defeated:</Text>
          <Text color="white" fontWeight="bold">{enemiesDefeated}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Treasure Found:</Text>
          <Text color="white" fontWeight="bold">{treasureFound}</Text>
        </HStack>
      </VStack>
    </>
  )
}

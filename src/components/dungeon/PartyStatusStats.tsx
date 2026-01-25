import { VStack, Text, HStack } from '@chakra-ui/react'

interface PartyStatusStatsProps {
  aliveCount: number
  totalCount: number
  avgLevel: number
  currentHp: number
  maxHp: number
}

export default function PartyStatusStats({ aliveCount, totalCount, avgLevel, currentHp, maxHp }: PartyStatusStatsProps) {
  return (
    <>
      <Text fontSize="sm" fontWeight="bold" mb={2}>Party Status</Text>
      <VStack align="stretch" spacing={1} fontSize="xs" color="gray.400">
        <HStack justify="space-between">
          <Text>Alive:</Text>
          <Text color="green.400" fontWeight="bold">
            {aliveCount}/{totalCount}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Avg Level:</Text>
          <Text color="white" fontWeight="bold">
            {avgLevel}
          </Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Total HP:</Text>
          <Text color="white" fontWeight="bold">
            {currentHp}/{maxHp}
          </Text>
        </HStack>
      </VStack>
    </>
  )
}

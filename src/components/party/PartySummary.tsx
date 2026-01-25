import { VStack, HStack, Box, Text } from '@chakra-ui/react'
import type { Hero } from '@/types'

interface PartySummaryProps {
  party: Hero[]
}

export default function PartySummary({ party }: PartySummaryProps) {
  if (party.length === 0) return null
  
  const totalHp = party.reduce((sum, h) => sum + h.stats.maxHp, 0)
  const avgAttack = Math.round(party.reduce((sum, h) => sum + h.stats.attack, 0) / party.length)
  const avgDefense = Math.round(party.reduce((sum, h) => sum + h.stats.defense, 0) / party.length)
  const avgSpeed = Math.round(party.reduce((sum, h) => sum + h.stats.speed, 0) / party.length)
  
  return (
    <Box w="full" p={3} bg="gray.900" borderRadius="lg" borderWidth="2px" borderColor="gray.700" flexShrink={0}>
      <Text fontSize="sm" color="gray.400" mb={2} fontWeight="bold">Party Summary</Text>
      <HStack spacing={6} fontSize="sm" justify="center">
        <VStack spacing={0}>
          <Text color="gray.400">Total HP</Text>
          <Text color="cyan.400" fontWeight="bold" fontSize="lg">{totalHp}</Text>
        </VStack>
        <VStack spacing={0}>
          <Text color="gray.400">Avg ATK</Text>
          <Text color="red.400" fontWeight="bold" fontSize="lg">{avgAttack}</Text>
        </VStack>
        <VStack spacing={0}>
          <Text color="gray.400">Avg DEF</Text>
          <Text color="blue.400" fontWeight="bold" fontSize="lg">{avgDefense}</Text>
        </VStack>
        <VStack spacing={0}>
          <Text color="gray.400">Avg SPD</Text>
          <Text color="green.400" fontWeight="bold" fontSize="lg">{avgSpeed}</Text>
        </VStack>
      </HStack>
    </Box>
  )
}

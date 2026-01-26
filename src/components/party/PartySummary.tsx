import { HStack, Box, Text } from '@chakra-ui/react'
import type { Hero } from '../../types'
import { GAME_CONFIG } from '@/config/gameConfig'

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
    <Box className="party-summary" w="full" p={2} bg="gray.900" borderRadius="lg" borderWidth="2px" borderColor="gray.700" flexShrink={0}>
      <HStack className="party-summary-stats" spacing={6} fontSize="sm" justify="center">
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Total HP:</Text>
          <Text color={GAME_CONFIG.colors.hp.base} fontWeight="bold">{totalHp}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg ATK:</Text>
          <Text color={GAME_CONFIG.colors.stats.attack} fontWeight="bold">{avgAttack}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg DEF:</Text>
          <Text color={GAME_CONFIG.colors.stats.defense} fontWeight="bold">{avgDefense}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg SPD:</Text>
          <Text color={GAME_CONFIG.colors.stats.speed} fontWeight="bold">{avgSpeed}</Text>
        </HStack>
      </HStack>
    </Box>
  )
}

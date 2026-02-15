import './PartySummary.css'
import { HStack, Box, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import type { Hero } from '../../types'
import { GAME_CONFIG } from '@/config/gameConfig'

interface PartySummaryProps {
  party: Hero[]
}

export default function PartySummary({ party }: PartySummaryProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerWidth <= 768 && window.matchMedia('(orientation portrait)').matches)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  if (party.length === 0) return null
  
  const totalHp = party.reduce((sum, h) => sum + h.stats.maxHp, 0)
  const avgAttack = Math.round(party.reduce((sum, h) => sum + h.stats.attack, 0) / party.length)
  const avgDefense = Math.round(party.reduce((sum, h) => sum + h.stats.defense, 0) / party.length)
  const avgSpeed = Math.round(party.reduce((sum, h) => sum + h.stats.speed, 0) / party.length)
  
  if (isPortrait) {
    // Portrait Mode - Compact single row
    return (
      <Box className="party-summary" w="full" p={1.5} bg="gray.900" borderRadius="md" borderWidth="2px" borderColor="gray.700" flexShrink={0}>
        <HStack className="party-summary-stats" spacing={1.5} fontSize="xs" justify="space-around" wrap="nowrap">
          <HStack spacing={0.5} flex={1} justify="center">
            <Text color="gray.500" fontSize="2xs">HP</Text>
            <Text color={GAME_CONFIG.colors.hp.base} fontWeight="bold" fontSize="xs">{totalHp}</Text>
          </HStack>
          <HStack spacing={0.5} flex={1} justify="center">
            <Text color="gray.500" fontSize="2xs">ATK</Text>
            <Text color={GAME_CONFIG.colors.stats.attack} fontWeight="bold" fontSize="xs">{avgAttack}</Text>
          </HStack>
          <HStack spacing={0.5} flex={1} justify="center">
            <Text color="gray.500" fontSize="2xs">DEF</Text>
            <Text color={GAME_CONFIG.colors.stats.defense} fontWeight="bold" fontSize="xs">{avgDefense}</Text>
          </HStack>
          <HStack spacing={0.5} flex={1} justify="center">
            <Text color="gray.500" fontSize="2xs">SPD</Text>
            <Text color={GAME_CONFIG.colors.stats.speed} fontWeight="bold" fontSize="xs">{avgSpeed}</Text>
          </HStack>
        </HStack>
      </Box>
    )
  }

  // Desktop Mode - Original design
  return (
    <Box className="party-summary" w="full" p={2} bg="gray.900" borderRadius="lg" borderWidth="2px" borderColor="gray.700" flexShrink={0}>
      <HStack className="party-summary-stats" spacing={6} fontSize="sm" justify="center">
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Total HP</Text>
          <Text color={GAME_CONFIG.colors.hp.base} fontWeight="bold">{totalHp}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg ATK</Text>
          <Text color={GAME_CONFIG.colors.stats.attack} fontWeight="bold">{avgAttack}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg DEF</Text>
          <Text color={GAME_CONFIG.colors.stats.defense} fontWeight="bold">{avgDefense}</Text>
        </HStack>
        <HStack spacing={1}>
          <Text color="gray.400" fontSize="xs">Avg SPD</Text>
          <Text color={GAME_CONFIG.colors.stats.speed} fontWeight="bold">{avgSpeed}</Text>
        </HStack>
      </HStack>
    </Box>
  )
}

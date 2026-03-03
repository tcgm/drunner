import './DungeonHeader.css'
import { GAME_CONFIG } from '@/config/gameConfig'
import { Heading, Text, Box, HStack, Spacer } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiTwoCoins } from 'react-icons/gi'
import { useOrientation } from '@/contexts/OrientationContext'

interface DungeonHeaderProps {
  floor: number
  maxFloors: number
  depth: number
  gold: number
}

export default function DungeonHeader({ floor, maxFloors, depth, gold }: DungeonHeaderProps) {
  const { isPortrait } = useOrientation()

  if (isPortrait) {
    // Portrait Mode - Single compact line, values only
    return (
      <Box className="dungeon-header dungeon-header-portrait" bg="gray.800" borderRadius="lg" p={2}>
        <HStack spacing={2} justify="space-between" align="center">
          <Heading size="sm" color="orange.400" whiteSpace="nowrap" flexShrink={0}>
            Floor {floor}/<Text as="span" color="white">{maxFloors}</Text>
          </Heading>
          
          <HStack spacing={3} flexShrink={0}>
            <HStack spacing={1}>
              <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} boxSize={3.5} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{gold}</Text>
            </HStack>
            
            <Text fontSize="sm" fontWeight="bold">
              Depth {depth}
            </Text>
          </HStack>
        </HStack>
      </Box>
    )
  }

  // Normal/Desktop Mode - Full layout with labels
  return (
    <Box className="dungeon-header dungeon-header-desktop" bg="gray.800" borderRadius="lg" p={2}>
      <HStack spacing={2}>
        <HStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.400">Current Location</Text>
          <Spacer w={1} />
          <Heading size="sm" color="orange.400">
            Floor {floor}
          </Heading>
        </HStack>
        
        <Spacer />
        
        <HStack spacing={6}>
          <HStack spacing={0}>
            <Text fontSize="sm" color="gray.400">Gold</Text>
            <Spacer w={1} />
            <HStack>
              <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{gold}</Text>
            </HStack>
          </HStack>
          
          <HStack spacing={0}>
            <Text fontSize="sm" color="gray.400">Depth</Text>
            <Spacer w={1} />
            <Text fontSize="sm" fontWeight="bold">
              {depth}
            </Text>
          </HStack>
          
          <HStack spacing={0}>
            <Text fontSize="sm" color="gray.400">Floor Progress</Text>
            <Spacer w={1} />
            <Text fontSize="sm" fontWeight="bold">
              {floor}/{maxFloors}
            </Text>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}

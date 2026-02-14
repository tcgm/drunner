import { GAME_CONFIG } from '@/config/gameConfig'
import { Heading, Text, Box, HStack, Spacer } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiTwoCoins } from 'react-icons/gi'

interface DungeonHeaderProps {
  floor: number
  maxFloors: number
  depth: number
  gold: number
}

export default function DungeonHeader({ floor, maxFloors, depth, gold }: DungeonHeaderProps) {
  return (
    <Box className="dungeon-header" bg="gray.800" borderRadius="lg" p={2}>
      <HStack className="dungeon-header-content" spacing={2}>
        <HStack className="dungeon-header-floor" align="start" spacing={0}>
          <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">Current Location</Text>
          <Spacer w={1} />
          <Heading size="sm" color="orange.400" whiteSpace="nowrap">
            Floor {floor}
          </Heading>
        </HStack>
        
        <Spacer />
        
        <HStack className="dungeon-header-stats" spacing={6} flexWrap="wrap">
          <HStack className="dungeon-header-gold" spacing={0}>
            <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">Gold</Text>
            <Spacer w={1} />
            <HStack spacing={1}>
              <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} />
              <Text fontSize="sm" fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{gold}</Text>
            </HStack>
          </HStack>
          
          <HStack className="dungeon-header-depth" spacing={0}>
            <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">Depth</Text>
            <Spacer w={1} />
            <Text fontSize="sm" fontWeight="bold">
              {depth}
            </Text>
          </HStack>
          
          <HStack className="dungeon-header-floor-progress" spacing={0}>
            <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">Floor Progress</Text>
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

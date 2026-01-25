import { Heading, Text, Box, HStack, Spacer } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiTwoCoins } from 'react-icons/gi'

interface DungeonHeaderProps {
  depth: number
  maxDepth: number
  gold: number
}

export default function DungeonHeader({ depth, maxDepth, gold }: DungeonHeaderProps) {
  return (
    <Box bg="gray.800" borderRadius="lg" p={2}>
      <HStack>
        <HStack align="start" spacing={0}>
          <Text fontSize="sm" color="gray.400">Current Location</Text>
          <Spacer w={1} />
          <Heading size="sm" color="orange.400">
            Floor {depth}
          </Heading>
        </HStack>
        
        <Spacer />
        
        <HStack spacing={6}>
          <HStack spacing={0}>
            <Text fontSize="sm" color="gray.400">Gold</Text>
            <Spacer w={1} />
            <HStack>
              <Icon as={GiTwoCoins} color="yellow.400" />
              <Text fontSize="sm" fontWeight="bold">{gold}</Text>
            </HStack>
          </HStack>
          
          <HStack spacing={0}>
            <Text fontSize="sm" color="gray.400">Depth</Text>
            <Spacer w={1} />
            <Text fontSize="sm" fontWeight="bold">
              {depth}/{maxDepth}
            </Text>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}

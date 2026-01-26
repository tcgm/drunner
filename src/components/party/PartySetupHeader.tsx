import { Box, HStack, Heading, Text, Button } from '@chakra-ui/react'

interface PartySetupHeaderProps {
  bankGold: number
  metaXp: number
  onBack: () => void
  onStart: () => void
  canStart: boolean
}

export function PartySetupHeader({ bankGold, metaXp, onBack, onStart, canStart }: PartySetupHeaderProps) {
  return (
    <Box bg="gray.950" borderBottom="2px solid" borderColor="orange.800" px={4} py={2} flexShrink={0}>
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Heading size="sm" color="orange.400">Assemble Your Party</Heading>
          <HStack spacing={2} bg="gray.800" px={3} py={1} borderRadius="md">
            <Text fontSize="xs" color="gray.400">Bank Gold:</Text>
            <Text fontSize="sm" fontWeight="bold" color="yellow.300">{bankGold}</Text>
          </HStack>
          <HStack spacing={2} bg="gray.800" px={3} py={1} borderRadius="md">
            <Text fontSize="xs" color="gray.400">Meta XP:</Text>
            <Text fontSize="sm" fontWeight="bold" color="cyan.300">{metaXp}</Text>
          </HStack>
        </HStack>
        <HStack spacing={2}>
          <Button variant="outline" colorScheme="gray" onClick={onBack} size="xs">
            Back
          </Button>
          <Button 
            colorScheme="orange" 
            onClick={onStart}
            isDisabled={!canStart}
            size="sm"
            px={6}
          >
            Enter Dungeon
          </Button>
        </HStack>
      </HStack>
    </Box>
  )
}

import { VStack, Heading, Button, Text } from '@chakra-ui/react'
import { useGameStore } from '@store/gameStore'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const { dungeon } = useGameStore()
  
  return (
    <VStack spacing={8}>
      <Heading size="xl">Dungeon - Floor {dungeon.depth}</Heading>
      <Text color="gray.400">
        Dungeon exploration coming soon...
      </Text>
      <Button colorScheme="red" onClick={onExit}>
        Exit Dungeon
      </Button>
    </VStack>
  )
}

import { VStack, Heading, Button } from '@chakra-ui/react'

interface MainMenuScreenProps {
  onNewGame: () => void
}

export default function MainMenuScreen({ onNewGame }: MainMenuScreenProps) {
  return (
    <VStack spacing={8} py={20}>
      <Heading size="2xl" color="orange.400">
        Dungeon Runner
      </Heading>
      <VStack spacing={4}>
        <Button colorScheme="orange" size="lg" onClick={onNewGame}>
          New Game
        </Button>
        <Button colorScheme="gray" size="lg" isDisabled>
          Continue (Coming Soon)
        </Button>
        <Button colorScheme="gray" size="lg" isDisabled>
          Settings (Coming Soon)
        </Button>
      </VStack>
    </VStack>
  )
}

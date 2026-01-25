import { VStack, Heading, Button, Box } from '@chakra-ui/react'

interface MainMenuScreenProps {
  onNewGame: () => void
}

export default function MainMenuScreen({ onNewGame }: MainMenuScreenProps) {
  return (
    <Box h="100vh" w="100vw" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
      <VStack spacing={8}>
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
    </Box>
  )
}

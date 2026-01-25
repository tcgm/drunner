import { VStack, Heading, Button, Box } from '@chakra-ui/react'
import { useGameStore } from '@store/gameStore'

interface MainMenuScreenProps {
  onNewRun: () => void
  onContinue: () => void
  onRunHistory: () => void
}

export default function MainMenuScreen({ onNewRun, onContinue, onRunHistory }: MainMenuScreenProps) {
  const { activeRun } = useGameStore()
  
  // Check if there's an active dungeon run in progress
  const hasActiveRun = activeRun !== null && activeRun.result === 'active'
  
  return (
    <Box h="100vh" w="100vw" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
      <VStack spacing={8}>
        <Heading size="2xl" color="orange.400">
          Dungeon Runner
        </Heading>
        <VStack spacing={4}>
          <Button colorScheme="orange" size="lg" onClick={onNewRun}>
            New Run
          </Button>
          <Button 
            colorScheme="orange" 
            variant="outline"
            size="lg" 
            onClick={onContinue}
            isDisabled={!hasActiveRun}
          >
            Continue Run
          </Button>
          <Button 
            colorScheme="gray" 
            size="lg" 
            onClick={onRunHistory}
          >
            Run History
          </Button>
          <Button colorScheme="gray" size="lg" isDisabled>
            Settings (Coming Soon)
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}

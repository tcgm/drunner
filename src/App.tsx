import { Box, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import PartySetupScreen from '@components/screens/PartySetupScreen'
import DungeonScreen from '@components/screens/DungeonScreen'
import RunHistoryScreen from '@components/screens/RunHistoryScreen'
import DevTools from '@components/ui/DevTools'
import { useGameStore } from '@store/gameStore'

type Screen = 'menu' | 'party-setup' | 'dungeon' | 'run-history'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const { activeRun, retreatFromDungeon } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleNewRun = () => {
    // Check if there's an active run
    if (activeRun && activeRun.result === 'active') {
      onOpen()
    } else {
      setCurrentScreen('party-setup')
    }
  }
  
  const handleConfirmNewRun = () => {
    // Retreat from current run before starting new one
    retreatFromDungeon()
    onClose()
    setCurrentScreen('party-setup')
  }

  const handleContinue = () => {
    // Continue an in-progress dungeon run
    setCurrentScreen('dungeon')
  }

  return (
    <Box h="100vh" w="100vw" bg="gray.900" overflow="hidden">
      {currentScreen === 'menu' && (
        <MainMenuScreen 
          onNewRun={handleNewRun}
          onContinue={handleContinue}
          onRunHistory={() => setCurrentScreen('run-history')}
        />
      )}
      {currentScreen === 'party-setup' && (
        <PartySetupScreen 
          onStart={() => setCurrentScreen('dungeon')}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'dungeon' && (
        <DungeonScreen onExit={() => setCurrentScreen('menu')} />
      )}
      {currentScreen === 'run-history' && (
        <RunHistoryScreen onBack={() => setCurrentScreen('menu')} />
      )}
      
      {/* New Run Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="orange.400">
              Active Run in Progress
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              You have an active run in progress. Starting a new run will end the current run 
              and mark it as a retreat. Your heroes will keep their progress. Continue?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="orange" onClick={handleConfirmNewRun} ml={3}>
                Start New Run
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      <DevTools />
    </Box>
  )
}

export default App

import { Box, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import { PartySetupScreen } from '@components/screens/PartySetupScreen'
import DungeonScreen from '@components/screens/DungeonScreen'
import RunHistoryScreen from '@components/screens/RunHistoryScreen'
import DevTools from '@components/ui/DevTools'
import { MusicControls } from '@components/ui/MusicControls'
import { MusicManager } from '@components/ui/MusicManager'
import { MigrationWarningDialog } from '@components/ui/MigrationWarningDialog'
import { useGameStore } from '@store/gameStore'
import type { Hero } from '@/types'

const MotionBox = motion.create(Box)

type Screen = 'menu' | 'party-setup' | 'dungeon' | 'run-history'

const screenVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.4
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2
    }
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const { activeRun, retreatFromDungeon, startDungeon, party, alkahest, pendingMigration } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const handleStartDungeon = (startingFloor: number = 0) => {
    // Calculate alkahest cost
    const activeHeroes = party.filter((h): h is Hero => h !== null)
    const partyAvgLevel = activeHeroes.length > 0
      ? Math.floor(activeHeroes.reduce((sum, h) => sum + h.level, 0) / activeHeroes.length)
      : 1
    const freeFloorThreshold = Math.floor(partyAvgLevel * 0.5) // Using the config value
    
    let alkahestCost = 0
    if (startingFloor > freeFloorThreshold) {
      const floorsSkipped = startingFloor - freeFloorThreshold
      alkahestCost = Math.floor(100 * Math.pow(1.5, floorsSkipped - 1))
    }
    
    startDungeon(startingFloor, alkahestCost) // Actually start the dungeon in the game store
    setCurrentScreen('dungeon')
  }
  
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
      {/* Centralized Music Manager */}
      <MusicManager currentScreen={currentScreen} />
      
      <AnimatePresence mode="wait">
        {currentScreen === 'menu' && (
          <MotionBox
            key="menu"
            h="full"
            w="full"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MainMenuScreen 
              onNewRun={handleNewRun}
              onContinue={handleContinue}
              onRunHistory={() => setCurrentScreen('run-history')}
            />
          </MotionBox>
        )}
        {currentScreen === 'party-setup' && (
          <MotionBox
            key="party-setup"
            h="full"
            w="full"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <PartySetupScreen 
              onStart={handleStartDungeon}
              onBack={() => setCurrentScreen('menu')}
            />
          </MotionBox>
        )}
        {currentScreen === 'dungeon' && (
          <MotionBox
            key="dungeon"
            h="full"
            w="full"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DungeonScreen onExit={() => setCurrentScreen('menu')} />
          </MotionBox>
        )}
        {currentScreen === 'run-history' && (
          <MotionBox
            key="run-history"
            h="full"
            w="full"
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <RunHistoryScreen onBack={() => setCurrentScreen('menu')} />
          </MotionBox>
        )}
      </AnimatePresence>
      
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
      
      {/* Migration Warning Dialog */}
      <MigrationWarningDialog isOpen={pendingMigration} />
      
      {/* Global Music Controls */}
      <MusicControls />
      
      <DevTools />
    </Box>
  )
}

export default App

import { Box, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import { PartySetupScreen } from '@components/screens/PartySetupScreen'
import DungeonScreen from '@components/screens/DungeonScreen'
import RunHistoryScreen from '@components/screens/RunHistoryScreen'
import DevTools from '@components/ui/DevTools'
import { MusicControls } from '@components/ui/MusicControls'
import { MusicManager } from '@components/ui/MusicManager'
import { MigrationWarningDialog } from '@components/ui/MigrationWarningDialog'
import { ItemDetailModalProvider } from '@/contexts/ItemDetailModalContext'
import { HeroModalProvider } from '@/contexts/HeroModalContext'
import { OrientationProvider } from '@/contexts/OrientationContext'
import { useGameStore } from '@/core/gameStore'
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
  const [hmrCounter, setHmrCounter] = useState(0)
  const { activeRun, retreatFromDungeon, startDungeon, party, alkahest, pendingMigration } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // HMR: Force component remount on module reload to restore item icons
  useEffect(() => {
    if (import.meta.hot) {
      const dispose = import.meta.hot.dispose(() => {
        console.log('[App] HMR: Module disposed - items will be restored on next render')
      })

      // Listen for HMR updates
      import.meta.hot.on('vite:beforeUpdate', () => {
        console.log('[App] HMR: Forcing remount to restore item icons')
        setHmrCounter(prev => prev + 1)
      })

      return dispose
    }
  }, [])

  // Remove HTML loading screen once React is ready
  useEffect(() => {
    const loader = document.getElementById('app-loader')
    if (loader) {
      loader.style.opacity = '0'
      loader.style.transition = 'opacity 0.3s'
      setTimeout(() => loader.remove(), 300)
    }
  }, [])
  
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
    <OrientationProvider>
      <ItemDetailModalProvider>
        <HeroModalProvider>
          <Box position="fixed" top={0} left={0} right={0} bottom={0} bg="gray.900" overflow="hidden" key={hmrCounter}>
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
        </HeroModalProvider>
      </ItemDetailModalProvider>
    </OrientationProvider>
  )
}

export default App

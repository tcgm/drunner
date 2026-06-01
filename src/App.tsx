import { Box, useDisclosure, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainMenuScreen from '@components/screens/MainMenuScreen'
import TownHubScreen from '@components/screens/TownHubScreen'
import { DungeonPrepScreen } from '@components/screens/DungeonPrepScreen'
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
import { setActiveNexusUpgrades } from '@/data/nexus'
import { calculateFreeFloorThreshold, calculateFloorSkipCost } from '@/utils/dungeonUtils'
import { useSyncGameState, useMultiplayerStore, usePartySync } from '@/multiplayer'
import { usePlayerProfileStore } from '@/core/playerProfileStore'
import type { Hero } from '@/types'

const MotionBox = motion.create(Box)

type Screen = 'menu' | 'town-hub' | 'dungeon-prep' | 'party-setup' | 'dungeon' | 'run-history'

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

// Zoom transition for town hub and dungeon prep
const zoomVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      duration: 0.5
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.1,
    transition: {
      duration: 0.3
    }
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [hmrCounter, setHmrCounter] = useState(0)
  const [openGuildHallOnTown, setOpenGuildHallOnTown] = useState(false)
  const { activeRun, retreatFromDungeon, startDungeon, party, alkahest, pendingMigration, nexusUpgrades } = useGameStore()
  const mpRole = useMultiplayerStore((s) => s.role)
  const mpActiveRun = useGameStore((s) => s.activeRun)

  // Mount the multiplayer sync hook for the lifetime of the app
  useSyncGameState()
  // Mount the party sync hook (slot ownership + profile broadcast + run-end distribution)
  usePartySync()

  // Seed multiplayer display name from persisted player profile on first mount
  const profileName = usePlayerProfileStore((s) => s.displayName)
  const setLocalPlayerName = useMultiplayerStore((s) => s.setLocalPlayerName)
  useEffect(() => {
    setLocalPlayerName(profileName)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync nexus upgrades into the module-level context used by game systems
  useEffect(() => { setActiveNexusUpgrades(nexusUpgrades ?? {}) }, [nexusUpgrades])
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Guest: show a toast when the host starts or ends a run so the
  // player is informed without being forcibly redirected.
  const toast = useToast()
  const prevRunResultRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    const prev = prevRunResultRef.current
    const cur  = mpActiveRun?.result
    prevRunResultRef.current = cur
    if (mpRole !== 'guest') return
    if (prev === undefined) return // skip initial mount
    if (cur === 'active' && prev !== 'active') {
      toast({
        title: 'Run started!',
        description: 'The host has begun a dungeon run. Head to the dungeon when ready.',
        status: 'info',
        duration: 6000,
        isClosable: true,
        position: 'bottom-right',
      })
    }
  }, [mpRole, mpActiveRun?.result, toast])

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
    // Calculate alkahest cost using shared utility
    const freeFloorThreshold = calculateFreeFloorThreshold(party)
    const alkahestCost = calculateFloorSkipCost(startingFloor, freeFloorThreshold)
    
    const activeHeroes = party.filter((h): h is Hero => h !== null)
    console.log(`[HandleStartDungeon] activeHeroes:`, activeHeroes.map(h => ({ name: h.name, level: h.level })))
    console.log(`[HandleStartDungeon] freeFloorThreshold: ${freeFloorThreshold}, startingFloor: ${startingFloor}`)
    console.log(`[HandleStartDungeon] alkahestCost: ${alkahestCost}${alkahestCost === 0 ? ' (FREE)' : ''}`)
    
    startDungeon(startingFloor, alkahestCost) // Actually start the dungeon in the game store
    usePlayerProfileStore.getState().incrementRunsStarted()
    setCurrentScreen('dungeon')
  }
  
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleNewRun = () => {
    // Check if there's an active run
    if (activeRun && activeRun.result === 'active') {
      onOpen()
    } else {
      // Go to town hub instead of directly to party setup
      setCurrentScreen('town-hub')
    }
  }
  
  const handleConfirmNewRun = () => {
    // Retreat from current run before starting new one
    retreatFromDungeon()
    onClose()
    // Go to town hub instead of directly to party setup
    setCurrentScreen('town-hub')
  }

  const handleContinue = () => {
    // Continue an in-progress dungeon run
    setCurrentScreen('dungeon')
  }

  const handleEnterDungeonPrep = () => {
    setOpenGuildHallOnTown(false)
    // If there's an active run in progress, resume it via the same path as main menu "Continue"
    if (activeRun && activeRun.result === 'active') {
      handleContinue()
    } else {
      // Navigate from town hub to dungeon prep to start a new run
      setCurrentScreen('dungeon-prep')
    }
  }

  const handleBackToTown = () => {
    // Navigate back to town hub from dungeon prep
    setCurrentScreen('town-hub')
  }

  const handleBackToMenu = () => {
    setOpenGuildHallOnTown(false)
    // Navigate back to main menu from town hub
    setCurrentScreen('menu')
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
                onMultiplayerJoined={() => {
                  // Joining a session doesn't force any screen change.
                  // Players access the dungeon / town themselves.
                }}
              />
            </MotionBox>
          )}
          {currentScreen === 'town-hub' && (
            <MotionBox
              key="town-hub"
              h="full"
              w="full"
              variants={zoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <TownHubScreen
                onEnterDungeon={handleEnterDungeonPrep}
                onBack={handleBackToMenu}
                    openGuildHallOnMount={openGuildHallOnTown}
              />
            </MotionBox>
          )}
          {currentScreen === 'dungeon-prep' && (
            <MotionBox
              key="dungeon-prep"
              h="full"
              w="full"
              variants={zoomVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DungeonPrepScreen
                onStart={handleStartDungeon}
                onBack={handleBackToTown}
                    onGoToTown={() => { setOpenGuildHallOnTown(true); setCurrentScreen('town-hub') }}
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
                    onGoToTown={() => { setOpenGuildHallOnTown(true); setCurrentScreen('town-hub') }}
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
              <DungeonScreen onExit={() => setCurrentScreen('town-hub')} />
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

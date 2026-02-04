import { Flex, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from '@chakra-ui/react'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useGameStore } from '@store/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import PartySidebar from '@components/dungeon/PartySidebar'
import DungeonHeader from '@components/dungeon/DungeonHeader'
import EventArea from '@components/dungeon/EventArea'
import DungeonActionBar from '@components/dungeon/DungeonActionBar'
import InfoSidebar from '@components/dungeon/InfoSidebar'
import GameOverScreen from '@components/dungeon/GameOverScreen'
import VictoryScreen from '@components/dungeon/VictoryScreen'
import DungeonInventoryModal from '@components/dungeon/DungeonInventoryModal'
import JournalModal from '@components/dungeon/JournalModal'
import { useMusicContext } from '@/utils/useMusicContext'
import { MusicContext } from '@/types/audio'
// import CombatLogModal from '@components/dungeon/CombatLogModal' // Disabled - functionality merged into Journal
import type { EventChoice, Hero } from '@/types'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const { dungeon, party, advanceDungeon, selectChoice, isGameOver, lastOutcome, retreatFromDungeon, activeRun } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isInventoryOpen, onOpen: onInventoryOpen, onClose: onInventoryClose } = useDisclosure()
  const { isOpen: isJournalOpen, onOpen: onJournalOpen, onClose: onJournalClose } = useDisclosure()
  // const { isOpen: isCombatLogOpen, onOpen: onCombatLogOpen, onClose: onCombatLogClose } = useDisclosure() // Disabled
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [heroEffects, setHeroEffects] = useState<Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>>({})
  
  // Determine music context based on current dungeon state
  const musicContext = useMemo(() => {
    const currentEvent = dungeon.currentEvent;
    
    // No event yet - normal exploration
    if (!currentEvent) {
      return MusicContext.DUNGEON_NORMAL;
    }
    
    // Boss events
    if (currentEvent.type === 'boss') {
      // Final boss (Floor 100)
      if (currentEvent.isFinalBoss) {
        return MusicContext.FINAL_BOSS;
      }
      
      // Zone bosses (10, 20, 30, etc.)
      if (currentEvent.isZoneBoss) {
        return MusicContext.ZONE_BOSS;
      }
      
      // Floor bosses (5, 15, 25, etc.)
      if (dungeon.bossType === 'floor') {
        return MusicContext.FLOOR_BOSS;
      }
      
      // Regular dungeon bosses
      return MusicContext.DUNGEON_BOSS;
    }
    
    // Special event types
    if (currentEvent.type === 'merchant') {
      return MusicContext.SHOP;
    }
    
    if (currentEvent.type === 'rest') {
      return MusicContext.REST;
    }
    
    // Default to normal dungeon music
    return MusicContext.DUNGEON_NORMAL;
  }, [dungeon.currentEvent, dungeon.bossType]);
  
  // Apply the music context
  useMusicContext(musicContext);
  
  // When outcome changes, create floating numbers
  useEffect(() => {
    if (!lastOutcome) return
    
    const newEffects: Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>> = {}
    
    lastOutcome.effects.forEach((effect) => {
      if (!effect.target || effect.value === undefined) return
      
      effect.target.forEach((heroId) => {
        if (!newEffects[heroId]) {
          newEffects[heroId] = []
        }
        
        if (effect.type === 'damage' || effect.type === 'heal' || effect.type === 'xp' || effect.type === 'gold') {
          newEffects[heroId].push({
            type: effect.type,
            value: effect.value!,
            id: `${effect.type}-${heroId}-${Date.now()}-${Math.random()}`
          })
        }
      })
    })
    
    // Schedule state update to avoid cascading renders
    const effectTimer = setTimeout(() => {
      setHeroEffects(newEffects)
    }, 0)
    
    // Clear effects after animation completes
    const clearTimer = setTimeout(() => {
      setHeroEffects({})
    }, GAME_CONFIG.floatingNumbers.duration + 100)
    
    return () => {
      clearTimeout(effectTimer)
      clearTimeout(clearTimer)
    }
  }, [lastOutcome])
  
  const handleSelectChoice = (choice: EventChoice) => {
    selectChoice(choice)
  }
  
  const handleContinue = () => {
    advanceDungeon()
  }
  
  const handleRetreat = () => {
    retreatFromDungeon()
    onClose()
    onExit()
  }
  
  // Victory check - player completed max floors (check floor, not depth!)
  if (dungeon.floor > GAME_CONFIG.dungeon.maxFloors) {
    return <VictoryScreen depth={dungeon.depth} onExit={onExit} />
  }
  
  // Game over check - but only show defeat screen if actually defeated
  if (isGameOver && activeRun?.result !== 'victory') {
    return <GameOverScreen floor={dungeon.floor} depth={dungeon.depth} onExit={onExit} />
  }
  
  // Victory screen - show if game is over with victory result
  if (isGameOver && activeRun?.result === 'victory') {
    return <VictoryScreen depth={dungeon.depth} onExit={onExit} />
  }
  
  // Filter out null heroes for components that expect Hero[]
  const activeParty = party.filter((hero): hero is Hero => hero !== null)
  
  return (
    <Flex className="dungeon-screen" h="100vh" gap={2} p={2}>
      <PartySidebar party={activeParty} heroEffects={heroEffects} />
      
      <Flex className="dungeon-screen-main" direction="column" flex={1} gap={2} minH={0}>
        <DungeonHeader 
          floor={dungeon.floor}
          maxFloors={GAME_CONFIG.dungeon.maxFloors}
          depth={dungeon.depth}
          gold={dungeon.gold} 
        />
        
        <EventArea
          currentEvent={dungeon.currentEvent}
          currentOutcome={lastOutcome}
          party={activeParty}
          depth={dungeon.depth}
          gold={dungeon.gold}
          bossType={dungeon.bossType}
          onSelectChoice={handleSelectChoice}
          onContinue={handleContinue}
          onAdvance={advanceDungeon}
        />
        
        <DungeonActionBar
          showContinue={!dungeon.currentEvent && !lastOutcome}
          onContinue={advanceDungeon}
          onInventory={onInventoryOpen}
          onJournal={onJournalOpen}
          onRetreat={onOpen}
          onExit={onExit}
        />
      </Flex>
      
      <InfoSidebar party={activeParty} activeRun={activeRun} />
      
      {/* Retreat Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="orange.400">
              Retreat from Dungeon?
            </AlertDialogHeader>

            <AlertDialogBody color="gray.300">
              Are you sure you want to retreat? Your heroes will keep their levels and equipment,
              but this run will be marked as a retreat in your history.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Stay
              </Button>
              <Button colorScheme="orange" onClick={handleRetreat} ml={3}>
                Retreat
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Inventory Modal */}
      <DungeonInventoryModal
        isOpen={isInventoryOpen}
        onClose={onInventoryClose}
        inventory={dungeon.inventory}
        gold={dungeon.gold}
      />

      {/* Journal Modal */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={onJournalClose}
      />

      {/* Combat Log Modal - Disabled (functionality merged into Journal, but component preserved for future use) */}
      {/* <CombatLogModal isOpen={isCombatLogOpen} onClose={onCombatLogClose} /> */}
    </Flex>
  )
}

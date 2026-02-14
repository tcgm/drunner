import { Flex, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, IconButton, Box, VStack } from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import { useGameStore } from '@/core/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import PartySidebar from '@components/dungeon/PartySidebar'
import CompactPartyBar from '@components/dungeon/CompactPartyBar'
import PartyMemberCard from '@components/party/PartyMemberCard'
import DungeonHeader from '@components/dungeon/DungeonHeader'
import EventArea from '@components/dungeon/EventArea'
import DungeonActionBar from '@components/dungeon/DungeonActionBar'
import InfoSidebar from '@components/dungeon/InfoSidebar'
import GameOverScreen from '@components/dungeon/GameOverScreen'
import VictoryScreen from '@components/dungeon/VictoryScreen'
import DungeonInventoryModal from '@components/dungeon/DungeonInventoryModal'
import JournalModal from '@components/dungeon/JournalModal'
import { BossCombatScreen } from '@/components/combat'
import { refreshPartyAbilities } from '@/utils/abilityUtils'
import { initializeBossCombatState } from '@/systems/combat'
import { MusicContext } from '@/types/audio'
import { GiCardJackHearts, GiInfo } from 'react-icons/gi'
// import CombatLogModal from '@components/dungeon/CombatLogModal' // Disabled - functionality merged into Journal
import type { EventChoice, Hero, DungeonEvent } from '@/types'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const {
    dungeon,
    party,
    advanceDungeon,
    selectChoice,
    isGameOver,
    lastOutcome,
    retreatFromDungeon,
    activeRun,
    applyBossVictoryRewards,
    endGame,
    changeMusicContext
  } = useGameStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isInventoryOpen, onOpen: onInventoryOpen, onClose: onInventoryClose } = useDisclosure()
  const { isOpen: isJournalOpen, onOpen: onJournalOpen, onClose: onJournalClose } = useDisclosure()
  const { isOpen: isPartyOpen, onOpen: onPartyOpen, onClose: onPartyClose } = useDisclosure()
  const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure()
  // const { isOpen: isCombatLogOpen, onOpen: onCombatLogOpen, onClose: onCombatLogClose } = useDisclosure() // Disabled
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [heroEffects, setHeroEffects] = useState<Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>>({})
  const [inBossCombat, setInBossCombat] = useState(false)
  const [bossEvent, setBossEvent] = useState<DungeonEvent | null>(null)
  
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

  // Boss combat handlers
  const handleBossVictory = () => {
    // Apply victory rewards from boss event
    if (bossEvent) {
      applyBossVictoryRewards(bossEvent)
    }
    setInBossCombat(false)
    setBossEvent(null)
    // Continue to next event after rewards applied
    advanceDungeon()
    // Explicitly change music back to normal dungeon music
    changeMusicContext(MusicContext.DUNGEON_NORMAL)
  }

  const handleBossDefeat = () => {
    setInBossCombat(false)
    setBossEvent(null)
    // Trigger game over
    endGame()
  }

  const handleBossFlee = () => {
    setInBossCombat(false)
    setBossEvent(null)
    retreatFromDungeon()
    onExit()
  }

  // Initialize boss combat state when boss event is encountered
  useEffect(() => {
    if (dungeon.currentEvent && dungeon.currentEvent.type === 'boss' && !inBossCombat) {
      // Always initialize fresh combat state for new boss encounter
      // (Events are reused from shared arrays, so old combatState may persist)
      dungeon.currentEvent.combatState = initializeBossCombatState(
        dungeon.currentEvent,
        dungeon
      )
      setBossEvent(dungeon.currentEvent)
      setInBossCombat(true)
    }
  }, [dungeon.currentEvent, dungeon, inBossCombat])

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
  
  // Render boss combat screen if in boss combat
  if (inBossCombat && bossEvent) {
    // Refresh party abilities to ensure current definitions and icons are loaded
    const refreshedParty = refreshPartyAbilities(party)
    
    return (
      <BossCombatScreen
        event={bossEvent}
        party={refreshedParty}
        onVictory={handleBossVictory}
        onDefeat={handleBossDefeat}
        onFlee={handleBossFlee}
      />
    )
  }

  return (
    <Flex 
      className="dungeon-screen flex-responsive" 
      h="100vh"
      gap={2}
      p={2}
      direction={{ base: "column", lg: "row" }}
    >
      <PartySidebar party={activeParty} heroEffects={heroEffects} />
      
      <Flex className="dungeon-screen-main" direction="column" flex={1} gap={2} minH={0}>
        {/* Compact Party Bar - Mobile/Portrait Only */}
        <CompactPartyBar party={activeParty} onClick={onPartyOpen} />
        
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

      {/* Party Modal - Mobile/Portrait Only */}
      <Modal isOpen={isPartyOpen} onClose={onPartyClose} size="md" scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" maxH="90vh" mx={2}>
          <ModalHeader color="orange.400">Party ({activeParty.length})</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} px={2}>
            <VStack className="party-sidebar-modal" spacing={2} align="stretch">
              {activeParty.map((hero) => (
                <PartyMemberCard 
                  key={hero.id} 
                  hero={hero} 
                  floatingEffects={heroEffects[hero.id] || []}
                  isDungeon={true}
                />
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Info Modal - Mobile/Portrait Only */}
      <Modal isOpen={isInfoOpen} onClose={onInfoClose} size="md" scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" maxH="90vh" mx={2}>
          <ModalHeader color="orange.400">Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <InfoSidebar party={activeParty} activeRun={activeRun} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Floating Action Buttons - Mobile/Portrait Only */}
      <Box className="mobile-fab-container" display={{ base: "flex", lg: "none" }} position="fixed" bottom={4} right={4} flexDirection="column" gap={2} zIndex={999}>
        <IconButton
          className="mobile-fab mobile-fab-party"
          aria-label="View Party"
          icon={<GiCardJackHearts size={24} />}
          colorScheme="orange"
          size="lg"
          isRound
          onClick={onPartyOpen}
          boxShadow="0 4px 12px rgba(251, 146, 60, 0.5)"
          _active={{ transform: "scale(0.9)" }}
        />
        <IconButton
          className="mobile-fab mobile-fab-info"
          aria-label="View Info"
          icon={<GiInfo size={24} />}
          colorScheme="purple"
          size="lg"
          isRound
          onClick={onInfoOpen}
          boxShadow="0 4px 12px rgba(139, 92, 246, 0.5)"
          _active={{ transform: "scale(0.9)" }}
        />
      </Box>
    </Flex>
  )
}

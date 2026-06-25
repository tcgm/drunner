import { Flex, Button, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, IconButton, Box, VStack, HStack, Badge, Text, Tooltip } from '@chakra-ui/react'
import { useRef, useState, useEffect, useCallback } from 'react'
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
import { CurrentQuestsModal } from '@/components/party/CurrentQuestsModal'
import { BossCombatScreen } from '@/components/combat'
import FloorMapScreen from '@components/dungeon/FloorMapScreen'
import LootDraftModal from '@components/dungeon/LootDraftModal'
import { refreshPartyAbilities } from '@/utils/abilityUtils'
import { initializeBossCombatState } from '@/systems/combat'
import { MusicContext } from '@/types/audio'
import { GiCardJackHearts, GiInfo, GiSwordsEmblem } from 'react-icons/gi'
import { useDungeonActions, useMultiplayerStore, usePartySync, useSessionStore, setVoteCompleteCallback, getSocket } from '@/multiplayer'
import { setNodeVoteCompleteCallback, setRetreatVoteCompleteCallback } from '@/multiplayer/voteManager'
// import CombatLogModal from '@components/dungeon/CombatLogModal' // Disabled - functionality merged into Journal
import type { EventChoice, Hero, DungeonEvent } from '@/types'

interface DungeonScreenProps {
  onExit: () => void
}

export default function DungeonScreen({ onExit }: DungeonScreenProps) {
  const {
    dungeon,
    party,
    isGameOver,
    lastOutcome,
    activeRun,
    applyBossVictoryRewards,
    endGame,
    changeMusicContext,
    quests,
  } = useGameStore()

  // Multiplayer-aware action wrappers (guests forward actions to host via socket)
  const {
    isGuest,
    advanceDungeon,
    selectChoice,
    selectMapNode,
    retreatFromDungeon,
    submitCombatAction,
  } = useDungeonActions()
  const mpPlayers = useMultiplayerStore((s) => s.players)
  const mpRole = useMultiplayerStore((s) => s.role)
  const inBossCombat = useMultiplayerStore((s) => s.inBossCombat)
  const bossEvent = useMultiplayerStore((s) => s.bossEvent)
  const { distributeRunEnd, pickDraftItem } = usePartySync()
  const voteState     = useSessionStore((s) => s.voteState)
  const nodeVoteState = useSessionStore((s) => s.nodeVoteState)
  const retreatVoteState = useSessionStore((s) => s.retreatVoteState)
  const draftState = useSessionStore((s) => s.draftState)
  const mySocketId = mpRole ? getSocket()?.id : undefined
  const iVotedToRetreat = !!(mySocketId && retreatVoteState?.votes.includes(mySocketId))
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isInventoryOpen, onOpen: onInventoryOpen, onClose: onInventoryClose } = useDisclosure()
  const { isOpen: isJournalOpen, onOpen: onJournalOpen, onClose: onJournalClose } = useDisclosure()
  const { isOpen: isPartyOpen, onOpen: onPartyOpen, onClose: onPartyClose } = useDisclosure()
  const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure()
  const { isOpen: isQuestsOpen, onOpen: onQuestsOpen, onClose: onQuestsClose } = useDisclosure()
  // const { isOpen: isCombatLogOpen, onOpen: onCombatLogOpen, onClose: onCombatLogClose } = useDisclosure() // Disabled
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [heroEffects, setHeroEffects] = useState<Record<string, Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>>({})
  
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


  // Host: distribute loot and return guest heroes whenever the run ends via the
  // engine (party wipe, victory via dungeon completion, etc.).
  const hasDistributedRef = useRef(false)
  useEffect(() => {
    if (mpRole !== 'host') return
    if (!isGameOver && activeRun?.result === 'active') {
      // Run is still ongoing – reset the guard
      hasDistributedRef.current = false
      return
    }
    if (isGameOver && !hasDistributedRef.current) {
      hasDistributedRef.current = true
      distributeRunEnd()
    }
  }, [mpRole, isGameOver, activeRun?.result, distributeRunEnd])

  /**
   * Initiates boss combat for the given event + choice on the host.
   * Guests must NOT call this — they wait for state sync.
   */
  const _startBossCombat = useCallback((currentEvent: DungeonEvent, choice: EventChoice) => {
    const choiceIndex = currentEvent.choices.findIndex(c => c === choice)
    const eventWithCombatState = {
      ...currentEvent,
      combatState: initializeBossCombatState(currentEvent, dungeon),
      selectedChoiceIndex: choiceIndex
    }
    // Broadcast to guests so they enter boss combat too.
    // Send only the event definition (no combatState) — guests re-initialize
    // their own combatState locally to avoid Map serialization issues.
    if (mpRole === 'host') {
      const socket = getSocket()
      const roomCode = useMultiplayerStore.getState().roomCode
      console.log('[DungeonScreen] _startBossCombat: emitting boss-combat-start', { roomCode, hasSocket: !!socket })
      if (socket && roomCode) {
        const { combatState: _cs, ...eventWithoutCombatState } = eventWithCombatState
        socket.emit('boss-combat-start', { code: roomCode, event: eventWithoutCombatState })
      }
    }
    // Write to store synchronously — socket handlers read via getState(), no timing windows
    useMultiplayerStore.getState().setBossCombat(eventWithCombatState)
  }, [dungeon, mpRole])

  /**
   * HOST callback fired by voteManager when majority is reached.
   * Executes the winning choice exactly as if the host had picked it.
   */
  const handleVoteComplete = useCallback((choiceIndex: number) => {
    const currentEvent = dungeon.currentEvent
    console.log('[DungeonScreen] handleVoteComplete', { choiceIndex, eventType: currentEvent?.type, eventId: currentEvent?.id })
    if (!currentEvent) return
    const choice = currentEvent.choices[choiceIndex]
    if (!choice) return

    const bossNeedsCombat = currentEvent.isZoneBoss || currentEvent.isFinalBoss || GAME_CONFIG.combat.turnBased.floorBossesHaveCombat
    const shouldInitiateCombat = currentEvent.type === 'boss' && !choice.skipsCombat && bossNeedsCombat

    if (shouldInitiateCombat) {
      _startBossCombat(currentEvent, choice)
    } else {
      // Use the raw store action (no voting — we already have the winner)
      useGameStore.getState().selectChoice(choice)
    }
  }, [dungeon.currentEvent, _startBossCombat])

  // Register vote-complete callback on the host
  useEffect(() => {
    if (mpRole !== 'host') return
    setVoteCompleteCallback(handleVoteComplete)
    return () => setVoteCompleteCallback(null)
  }, [mpRole, handleVoteComplete])

  // HOST callback fired by voteManager when map node majority is reached
  const handleNodeVoteComplete = useCallback((nodeId: string) => {
    useGameStore.getState().selectMapNode(nodeId)
  }, [])

  useEffect(() => {
    if (mpRole !== 'host') return
    setNodeVoteCompleteCallback(handleNodeVoteComplete)
    return () => setNodeVoteCompleteCallback(null)
  }, [mpRole, handleNodeVoteComplete])

  // HOST callback fired by voteManager once every player has agreed to retreat.
  // Distributes loot/returns guest heroes, then runs the real retreat. The resulting
  // activeRun change is broadcast to everyone and picked up by the exit effect below.
  const handleRetreatVoteComplete = useCallback(() => {
    distributeRunEnd()
    useGameStore.getState().retreatFromDungeon()
  }, [distributeRunEnd])

  useEffect(() => {
    if (mpRole !== 'host') return
    setRetreatVoteCompleteCallback(handleRetreatVoteComplete)
    return () => setRetreatVoteCompleteCallback(null)
  }, [mpRole, handleRetreatVoteComplete])

  // Once the run actually ends via retreat (activeRun clears without a game-over),
  // leave the dungeon screen. This fires for every player — host directly, guests via
  // the synced state-update — so retreating moves the whole party at once.
  const prevActiveRunRef = useRef(activeRun)
  useEffect(() => {
    const wasActive = !!prevActiveRunRef.current
    prevActiveRunRef.current = activeRun
    if (wasActive && !activeRun && !isGameOver) {
      onExit()
    }
  }, [activeRun, isGameOver, onExit])

  const handleSelectChoice = (choice: EventChoice) => {
    const currentEvent = dungeon.currentEvent

    // In multiplayer, selecting a choice means casting a vote (host and guests).
    // The actual execution happens in handleVoteComplete once majority is reached.
    if (mpRole !== null) {
      selectChoice(choice)  // voting-aware (see useDungeonActions)
      return
    }

    // Single-player path
    const bossNeedsCombat = !currentEvent
      ? false
      : (currentEvent.isZoneBoss || currentEvent.isFinalBoss || GAME_CONFIG.combat.turnBased.floorBossesHaveCombat)
    const shouldInitiateCombat = currentEvent && currentEvent.type === 'boss' && !choice.skipsCombat && bossNeedsCombat
    
    if (shouldInitiateCombat && currentEvent) {
      _startBossCombat(currentEvent, choice)
    } else {
      selectChoice(choice)
    }
  }
  
  const handleContinue = () => {
    advanceDungeon()
  }
  
  const handleRetreat = () => {
    // Single-player: retreats immediately. Multiplayer: casts a "yes" vote — the run
    // only actually ends once every player agrees (see handleRetreatVoteComplete).
    retreatFromDungeon()
    onClose()
  }

  const handleCancelRetreatVote = () => {
    retreatFromDungeon(false)
  }

  // Boss combat handlers
  const emitBossCombatEnd = useCallback(() => {
    if (mpRole === 'host') {
      const socket = getSocket()
      const roomCode = useMultiplayerStore.getState().roomCode
      if (socket && roomCode) socket.emit('boss-combat-end', { code: roomCode })
    }
  }, [mpRole])

  const handleBossVictory = () => {
    console.log('[DungeonScreen] handleBossVictory called')
    emitBossCombatEnd()
    // Capture bossEvent before clearing it
    const currentBossEvent = bossEvent
    
    // Apply rewards and advance dungeon FIRST 
    if (currentBossEvent) {
      console.log('[DungeonScreen] Applying boss victory rewards')
      applyBossVictoryRewards(currentBossEvent)
    }
    console.log('[DungeonScreen] Advancing dungeon')
    advanceDungeon()
    changeMusicContext(MusicContext.DUNGEON_NORMAL)
    
    // THEN unmount combat screen in next tick after store updates have propagated
    setTimeout(() => {
      console.log('[DungeonScreen] Unmounting combat screen')
      useMultiplayerStore.getState().clearBossCombat()
    }, 50) // Small delay to ensure store updates have rendered
  }

  const handleBossDefeat = () => {
    emitBossCombatEnd()
    useMultiplayerStore.getState().clearBossCombat()
    // Host distributes loot and returns guest heroes before triggering game over
    if (mpRole === 'host') distributeRunEnd()
    // Trigger game over
    endGame()
  }

  const handleBossFlee = () => {
    emitBossCombatEnd()
    useMultiplayerStore.getState().clearBossCombat()
    // Single-player: retreats immediately. Multiplayer: casts a "yes" vote — leaving
    // the screen happens reactively once everyone agrees (see the activeRun effect above).
    retreatFromDungeon()
  }

  // Boss combat is now initiated after choice selection in handleSelectChoice
  // This allows showing the boss event narrative and choices first
  // Combat only triggers if the choice doesn't have skipsCombat: true

  // Note: Store sync removed - CombatManager now handles all combat state
  // DevTools or other external updates should go through the manager's updateState method

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

    // Compute which heroSourceIds belong to the local player (guests only)
    let myHeroIds: string[] | undefined
    if (isGuest) {
      const mySocketId = getSocket()?.id
      if (mySocketId) {
        const assignments = useSessionStore.getState().slotAssignments
        myHeroIds = Object.values(assignments)
          .filter((a) => a?.playerId === mySocketId)
          .map((a) => a!.heroSourceId)
      }
    }

    return (
      <BossCombatScreen
        event={bossEvent}
        dungeon={dungeon}
        party={refreshedParty}
        onVictory={handleBossVictory}
        onDefeat={handleBossDefeat}
        onFlee={handleBossFlee}
        myHeroIds={myHeroIds}
        onGuestCombatAction={isGuest ? submitCombatAction : undefined}
      />
    )
  }

  return (
    <Flex 
      className="dungeon-screen flex-responsive" 
      h="100vh"
      gap={2}
      p={2}
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

        {/* Multiplayer player list */}
        {mpRole && mpPlayers.length > 1 && (
          <HStack spacing={2} px={1} flexWrap="wrap">
            {mpPlayers.map((p, i) => (
              <Tooltip key={p.id} label={i === 0 ? 'Host' : 'Guest'} placement="bottom">
                <Badge
                  colorScheme="purple"
                  variant={i === 0 ? 'solid' : 'outline'}
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <GiSwordsEmblem style={{ display: 'inline', marginRight: 2 }} />
                  <Text as="span">{p.name}</Text>
                </Badge>
              </Tooltip>
            ))}
            {isGuest && (
              <Badge colorScheme="blue" variant="outline" fontSize="xs" px={2} py={0.5} borderRadius="full">
                Spectating
              </Badge>
            )}
          </HStack>
        )}

        {/* Retreat vote status — visible to everyone while a retreat is pending */}
        {retreatVoteState && (
          <HStack
            spacing={3}
            px={3}
            py={1.5}
            bg="orange.900"
            borderWidth="1px"
            borderColor="orange.600"
            borderRadius="md"
          >
            <Text fontSize="xs" color="orange.200" fontWeight="bold">
              Retreat vote: {retreatVoteState.votes.length}/{retreatVoteState.totalPlayers} agreed
            </Text>
            {iVotedToRetreat ? (
              <Button size="xs" colorScheme="orange" variant="outline" onClick={handleCancelRetreatVote}>
                Cancel my vote
              </Button>
            ) : (
              <Button size="xs" colorScheme="orange" onClick={handleRetreat}>
                Agree to retreat
              </Button>
            )}
          </HStack>
        )}

        <EventArea
          currentEvent={dungeon.currentEvent}
          currentOutcome={lastOutcome}
          party={activeParty}
          depth={dungeon.depth}
          gold={dungeon.gold}
          bossType={dungeon.bossType}
          floorMap={dungeon.floorMap ?? null}
          floor={dungeon.floor}
          onSelectChoice={handleSelectChoice}
          onContinue={handleContinue}
          onAdvance={advanceDungeon}
          onSelectMapNode={selectMapNode}
          voteState={voteState}
          nodeVoteState={nodeVoteState}
          myPlayerId={mpRole ? getSocket()?.id : undefined}
        />
        
        <DungeonActionBar
          showContinue={!dungeon.currentEvent && !lastOutcome && !dungeon.floorMap}
          onContinue={advanceDungeon}
          onInventory={onInventoryOpen}
          onJournal={onJournalOpen}
          onRetreat={onOpen}
          onExit={onExit}
          onQuests={onQuestsOpen}
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
              {mpRole && mpPlayers.length > 1 && (
                <Text mt={2} color="orange.300" fontSize="sm">
                  This will cast your vote to retreat — everyone in the party must agree before the run actually ends.
                </Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Stay
              </Button>
              <Button colorScheme="orange" onClick={handleRetreat} ml={3}>
                {mpRole && mpPlayers.length > 1 ? 'Vote to Retreat' : 'Retreat'}
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

      {/* Quest Tracker Modal */}
      <CurrentQuestsModal
        isOpen={isQuestsOpen}
        onClose={onQuestsClose}
        quests={quests}
        activeRun={activeRun}
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
            <InfoSidebar party={activeParty} activeRun={activeRun} isInModal={true} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Floating Action Buttons - Mobile/Portrait Only */}
      <Box className="mobile-fab-container portrait-only">
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

      {/* Loot Draft Modal — shown at run end in multiplayer */}
      {draftState && (
        <LootDraftModal
          draftState={draftState}
          myPlayerId={getSocket()?.id ?? ''}
          players={mpPlayers}
          role={mpRole}
          onPick={(itemIndex) => pickDraftItem(itemIndex)}
        />
      )}
    </Flex>
  )
}

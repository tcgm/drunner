import './DungeonPrepScreen.css'
import { Box, Flex, useDisclosure, HStack, VStack, Text, Badge, Icon, Button, Tooltip, useToast } from '@chakra-ui/react'
import { GiCheckMark, GiHourglass } from 'react-icons/gi'
import { useGameStore } from '../../core/gameStore'
import { GAME_CONFIG } from '../../config/gameConfig'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { Hero, Consumable, Item } from '../../types'
import { PartySetupHeader } from '../party/PartySetupHeader'
import { HeroSelectionSidebar } from '../party/HeroSelectionSidebar'
import { PartySetupSlots } from '../party/PartySetupSlots'
import { EquipmentPanel } from '../party/EquipmentPanel'
import { BankInventoryModal } from '../party/BankInventoryModal'
import { OverflowInventoryModal } from '../party/OverflowInventoryModal'
import { ConfirmStartWithOverflowModal } from '../party/ConfirmStartWithOverflowModal'
import { CorruptedItemsModal } from '../party/CorruptedItemsModal'
import { PotionShopModal } from '../party/PotionShopModal'
import { MarketHallModal } from '../party/MarketHallModal'
import FloorSelectionModal from '../party/FloorSelectionModal'
import PartySummary from '../party/PartySummary'
import BuyBankSlotsModal from '../party/BuyBankSlotsModal'
import { CurrentQuestsModal } from '../party/CurrentQuestsModal'
import { useMusicContext } from '@/utils/useMusicContext'
import { MusicContext } from '@/types/audio'
import { useBankShopHandlers } from '@/hooks/useBankShopHandlers'
import { useMultiplayerStore, useSessionStore, usePartySync } from '@/multiplayer'
import { syncGuestSlotHero } from '@/multiplayer/multiplayerService'
import { getSlotsForPlayerIndex } from '@/config/multiplayerConfig'
import { getSocket } from '@/multiplayer/socket'

interface DungeonPrepScreenProps {
  onBack: () => void
  onStart: (startingFloor?: number) => void
  onGoToTown?: () => void
}

export function DungeonPrepScreen({ onBack, onStart, onGoToTown }: DungeonPrepScreenProps) {
  // Set party screen music
  useMusicContext(MusicContext.PARTY_SCREEN)

  const {
    party,
    addHero,
    removeHero,
    heroRoster,
    bankInventory,
    bankGold,
    alkahest,
    bankStorageSlots,
    equipItemFromBank,
    unequipItemFromHero,
    moveItemToBank,
    overflowInventory,
    keepOverflowItem,
    discardOverflowItem,
    clearOverflow,
    corruptedItems,
    rerollCorruptedItem,
    sellCorruptedForGold,
    sellCorruptedForAlkahest,
    deleteCorruptedItem,
    metaXp,
    healParty,
    spendBankGold,
    quests,
  } = useGameStore()

  // Heal all heroes when the dungeon prep screen is mounted
  useEffect(() => {
    healParty()
  }, [healParty])

  const [selectedHeroFromRoster, setSelectedHeroFromRoster] = useState<number | null>(null)
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number | null>(() => {
    // Auto-select first hero in party if available
    const firstHeroIndex = party.findIndex(h => h !== null)
    return firstHeroIndex >= 0 ? firstHeroIndex : null
  })
  const [pendingSlotIndex, setPendingSlotIndex] = useState<number | null>(null)
  const [pendingSlot, setPendingSlot] = useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerWidth <= 768 && window.matchMedia('(orientation: portrait)').matches)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  // Bank modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Overflow modal
  const { isOpen: isOverflowOpen, onOpen: onOverflowOpen, onClose: onOverflowClose } = useDisclosure()

  // Start confirmation modal
  const { isOpen: isConfirmStartOpen, onOpen: onConfirmStartOpen, onClose: onConfirmStartClose } = useDisclosure()

  // Floor selection modal
  const { isOpen: isFloorSelectionOpen, onOpen: onFloorSelectionOpen, onClose: onFloorSelectionClose } = useDisclosure()

  // Shop modal
  const { isOpen: isShopOpen, onOpen: onShopOpen, onClose: onShopClose } = useDisclosure()

  // Market Hall modal
  const { isOpen: isMarketOpen, onOpen: onMarketOpen, onClose: onMarketClose } = useDisclosure()

  // Corrupted items modal
  const { isOpen: isCorruptedOpen, onOpen: onCorruptedOpen, onClose: onCorruptedClose } = useDisclosure()

  // Current quests modal
  const { isOpen: isQuestsOpen, onOpen: onQuestsOpen, onClose: onQuestsClose } = useDisclosure()

  // Auto-open corrupted items modal if there are corrupted items (highest priority)
  useEffect(() => {
    if (corruptedItems.length > 0) {
      onCorruptedOpen()
    }
  }, [corruptedItems.length, onCorruptedOpen])

  // Auto-open overflow modal if there are overflow items
  useState(() => {
    if (overflowInventory.length > 0) {
      onOverflowOpen()
    }
  })

  const canStart = party.filter(h => h !== null).length > 0

  const handleRosterHeroClick = (index: number) => {
    setSelectedHeroFromRoster(index)
  }

  const handleAddHeroClick = (index: number) => {
    if (selectedHeroFromRoster !== null) {
      const hero = heroRoster[selectedHeroFromRoster]
      if (mpRole === 'guest') {
        // Guests can only fill their own slots
        if (!myMpSlots?.includes(index)) return
        claimSlot(index, hero)
      } else {
        addHero(hero, index)
      }
      setSelectedHeroFromRoster(null)
    }
  }

  const handleAddHeroFromRosterDirect = (rosterIndex: number, slotIndex: number) => {
    const hero = heroRoster[rosterIndex]
    if (!hero) return
    if (mpRole === 'guest') {
      if (!myMpSlots?.includes(slotIndex)) return
      claimSlot(slotIndex, hero)
    } else {
      addHero(hero, slotIndex)
    }
  }

  const handleRemoveHero = (index: number) => {
    const hero = party[index]
    if (hero) {
      if (mpRole === 'guest') {
        // Guests can only remove heroes from their own slots
        if (!myMpSlots?.includes(index)) return
        releaseSlot(index)
        // Host will clear the slot and broadcast the updated party state
      } else {
        removeHero(hero.id)
      }
      if (selectedHeroIndex === index) {
        setSelectedHeroIndex(null)
      }
    }
  }

  const handleOpenBankForSlot = (heroIndex: number, slotId: string) => {
    setPendingSlotIndex(heroIndex)
    setPendingSlot(slotId)
    onOpen()
  }

  const handleOpenBank = () => {
    setPendingSlotIndex(null)
    setPendingSlot(null)
    onOpen()
  }

  const handleEquipFromBank = (itemId: string) => {
    if (pendingSlotIndex !== null && pendingSlot !== null) {
      const hero = party[pendingSlotIndex]
      const item = bankInventory.find(i => i.id === itemId)
      if (hero && item) {
        equipItemFromBank(hero.id, item, pendingSlot)
        if (mpRole === 'guest') {
          const updated = useGameStore.getState().party[pendingSlotIndex]
          if (updated) syncGuestSlotHero(pendingSlotIndex, updated)
        }
      }
    }
    onClose()
    setPendingSlotIndex(null)
    setPendingSlot(null)
  }

  const handleUnequipItem = (heroIndex: number, slotId: string) => {
    const hero = party[heroIndex]
    if (hero) {
      const unequippedItem = unequipItemFromHero(hero.id, slotId)
      if (unequippedItem) {
        moveItemToBank(unequippedItem)
        if (mpRole === 'guest') {
          const updated = useGameStore.getState().party[heroIndex]
          if (updated) syncGuestSlotHero(heroIndex, updated)
        }
      }
    }
  }

  const handleEquipItemDirect = useCallback((heroIndex: number, item: Item, slotId: string) => {
    const hero = party[heroIndex]
    if (hero) {
      equipItemFromBank(hero.id, item, slotId)
      if (mpRole === 'guest') {
        const updated = useGameStore.getState().party[heroIndex]
        if (updated) syncGuestSlotHero(heroIndex, updated)
      }
      onClose()
    }
  }, [party, equipItemFromBank, mpRole, onClose])

  const handleKeepOverflow = (itemId: string) => {
    keepOverflowItem(itemId)
  }

  const handleDiscardOverflow = (itemId: string) => {
    discardOverflowItem(itemId)
  }

  const handleStart = () => {
    if (overflowInventory.length > 0) {
      onConfirmStartOpen()
    } else {
      onFloorSelectionOpen()
    }
  }

  const handleConfirmStart = () => {
    clearOverflow()
    onConfirmStartClose()
    onFloorSelectionOpen()
  }

  const handleFloorSelected = (floor: number) => {
    onFloorSelectionClose()
    onStart(floor)
  }

  const { handlePurchasePotion, handlePurchaseConsumable, handlePurchaseItem, handleExpandBank, isBuySlotsOpen, onBuySlotsClose } = useBankShopHandlers()

  // ── Multiplayer party slot system ────────────────────────────────────────
  const mpRole       = useMultiplayerStore((s) => s.role)
  const mpPlayers    = useMultiplayerStore((s) => s.players)
  const slotOwnership = useSessionStore((s) => s.slotOwnershipByIndex)
  const readyPlayers  = useSessionStore((s) => s.readyPlayers)
  const { claimSlot, releaseSlot } = usePartySync()
  const toast = useToast()

  const mySocketId = getSocket().id ?? ''

  // Slots owned by the local player (null = not in a session)
  const myMpSlots = useMemo(() => {
    if (!mpRole || mpPlayers.length === 0 || slotOwnership.length === 0) return null
    const myIdx    = mpPlayers.findIndex((p) => p.id === mySocketId)
    if (myIdx === -1) return null
    return getSlotsForPlayerIndex(myIdx, slotOwnership)
  }, [mpRole, mpPlayers, slotOwnership, mySocketId])

  const iAmReady = readyPlayers.includes(mySocketId)
  const allPlayersReady = mpRole && mpPlayers.length > 0
    ? mpPlayers.every(p => readyPlayers.includes(p.id))
    : true

  // Toast when everyone is ready
  const prevAllReadyRef = useRef(false)
  useEffect(() => {
    if (allPlayersReady && !prevAllReadyRef.current && mpRole && mpPlayers.length > 1) {
      toast({
        title: 'All players ready!',
        description: mpRole === 'host' ? 'You can now enter the dungeon.' : 'Waiting for host to start…',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      })
    }
    prevAllReadyRef.current = allPlayersReady
  }, [allPlayersReady, mpRole, mpPlayers.length, toast])

  const handleReadyUp = useCallback(() => {
    if (iAmReady) return
    if (mpRole === 'host') {
      const updated = [...readyPlayers, mySocketId]
      useSessionStore.getState().setReadyPlayers(updated)
      getSocket().emit('ready-update', { code: useMultiplayerStore.getState().roomCode, readyPlayers: updated })
    } else {
      getSocket().emit('player-ready', { code: useMultiplayerStore.getState().roomCode })
    }
  }, [iAmReady, mpRole, readyPlayers, mySocketId])

  // Effective canStart: also requires all ready in multiplayer
  const effectiveCanStart = canStart && allPlayersReady

  return (
    <Box className="dungeon-prep-screen" h="100vh" w="100vw" bg="gray.900" display="flex" flexDirection="column" overflow="hidden">
      {/* Header */}
      <PartySetupHeader
        bankGold={bankGold}
        metaXp={metaXp}
        alkahest={alkahest}
        bankInventory={bankInventory.length}
        bankStorageSlots={bankStorageSlots}
        activeQuestCount={quests.filter(q => q.status === 'active').length}
        completedQuestCount={quests.filter(q => q.status === 'completed').length}
        canStart={effectiveCanStart}
        onBack={onBack}
        onStart={handleStart}
        onOpenShop={onShopOpen}
        onOpenMarket={onMarketOpen}
        onOpenBank={handleOpenBank}
        onOpenQuests={onQuestsOpen}
      />

      <Flex className="dungeon-prep-screen-content" flex={1} minH={0} overflow="hidden">
        {/* Left Sidebar */}
        <HeroSelectionSidebar
          selectedHeroFromRoster={selectedHeroFromRoster}
          storedHeroes={heroRoster}
          onRosterHeroClick={handleRosterHeroClick}
        />

        {/* Center - Party Slots */}
        <Box className="dungeon-prep-screen-center" flex={1} minW={0} minH={0} display="flex" flexDirection="column">
          {/* ── Multiplayer ready-up bar ─────────────────────────────── */}
          {mpRole && mpPlayers.length > 0 && (
            <Box
              bg="gray.850"
              borderBottom="1px solid"
              borderColor="gray.700"
              px={4}
              py={2}
              flexShrink={0}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3} flexWrap="wrap">
                  <Text color="gray.400" fontSize="xs" fontWeight="bold" letterSpacing="wide">
                    READY STATUS
                  </Text>
                  {mpPlayers.map((p) => {
                    const isReady = readyPlayers.includes(p.id)
                    return (
                      <Tooltip key={p.id} label={isReady ? 'Ready!' : 'Not ready'} placement="top" hasArrow>
                        <HStack
                          spacing={1}
                          bg={isReady ? 'green.900' : 'gray.800'}
                          border="1px solid"
                          borderColor={isReady ? 'green.600' : 'gray.600'}
                          borderRadius="md"
                          px={2}
                          py={0.5}
                          transition="all 0.2s"
                        >
                          <Icon
                            as={isReady ? GiCheckMark : GiHourglass}
                            color={isReady ? 'green.400' : 'gray.500'}
                            boxSize={3}
                          />
                          <Text
                            fontSize="xs"
                            color={isReady ? 'green.300' : 'gray.400'}
                            maxW="80px"
                            noOfLines={1}
                          >
                            {p.name}
                          </Text>
                          {p.id === mySocketId && (
                            <Badge colorScheme="blue" fontSize="2xs">you</Badge>
                          )}
                        </HStack>
                      </Tooltip>
                    )
                  })}
                </HStack>
                {!iAmReady ? (
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={handleReadyUp}
                    leftIcon={<Icon as={GiCheckMark} />}
                  >
                    I'm Ready
                  </Button>
                ) : (
                  <HStack spacing={2}>
                    <Icon as={GiCheckMark} color="green.400" boxSize={4} />
                    <Text color="green.400" fontSize="sm" fontWeight="bold">
                      {allPlayersReady
                        ? mpRole === 'host' ? 'All ready — click Enter Dungeon!' : 'All ready — waiting for host…'
                        : 'Waiting for others…'}
                    </Text>
                  </HStack>
                )}
              </HStack>
            </Box>
          )}
          {isPortrait ? (
            // Portrait Layout - PartySummary outside scroll area
            <>
              <PartySetupSlots
                party={party}
                selectedHeroFromRoster={selectedHeroFromRoster}
                storedHeroes={heroRoster}
                bankInventory={bankInventory}
                onRosterHeroClick={handleRosterHeroClick}
                onAddHero={handleAddHeroClick}
                onAddHeroFromRoster={handleAddHeroFromRosterDirect}
                onRemoveHero={handleRemoveHero}
                onSelectHero={setSelectedHeroIndex}
                onSlotClick={handleOpenBankForSlot}
                onUnequipItem={handleUnequipItem}
                onEquipItem={handleEquipItemDirect}
                isBankModalOpen={isOpen}
                slotOwnership={mpRole && mpPlayers.length > 0 ? slotOwnership : undefined}
                mpPlayers={mpRole && mpPlayers.length > 0 ? mpPlayers : undefined}
                localPlayerId={mySocketId}
              />
              <PartySummary party={party.filter((h): h is Hero => h !== null)} />
            </>
          ) : (
            // Desktop Layout - PartySummary below slots
            <>
              <PartySetupSlots
                party={party}
                selectedHeroFromRoster={selectedHeroFromRoster}
                storedHeroes={heroRoster}
                bankInventory={bankInventory}
                onRosterHeroClick={handleRosterHeroClick}
                onAddHero={handleAddHeroClick}
                onAddHeroFromRoster={handleAddHeroFromRosterDirect}
                onRemoveHero={handleRemoveHero}
                onSelectHero={setSelectedHeroIndex}
                onSlotClick={handleOpenBankForSlot}
                onUnequipItem={handleUnequipItem}
                onEquipItem={handleEquipItemDirect}
                isBankModalOpen={isOpen}
                  slotOwnership={mpRole && mpPlayers.length > 0 ? slotOwnership : undefined}
                  mpPlayers={mpRole && mpPlayers.length > 0 ? mpPlayers : undefined}
                  localPlayerId={mySocketId}
              />
              <PartySummary party={party.filter((h): h is Hero => h !== null)} />
            </>
          )}
        </Box>

        {/* Right Sidebar - Equipment */}
        {isPortrait ? null : <EquipmentPanel
          selectedHeroIndex={selectedHeroIndex}
          party={party}
          bankInventory={bankInventory}
          onSelectHero={setSelectedHeroIndex}
          onSlotClick={handleOpenBankForSlot}
          onUnequipItem={handleUnequipItem}
          onEquipItem={handleEquipItemDirect}
          isBankModalOpen={isOpen}
        />
        }
      </Flex>

      {/* Bank Inventory Modal */}
      <BankInventoryModal
        isOpen={isOpen}
        onClose={onClose}
        bankInventory={bankInventory}
        pendingSlot={pendingSlot}
        onEquipItem={handleEquipFromBank}
        selectedHeroIndex={selectedHeroIndex}
        party={party}
      />

      {/* Overflow Inventory Modal */}
      <OverflowInventoryModal
        isOpen={isOverflowOpen}
        onClose={onOverflowClose}
        overflowInventory={overflowInventory}
        bankInventory={bankInventory}
        bankStorageSlots={bankStorageSlots}
        bankGold={bankGold}
        onExpandBank={handleExpandBank}
        onKeepItem={handleKeepOverflow}
        onDiscardItem={handleDiscardOverflow}
        onClearAll={clearOverflow}
      />
      
      {/* Corrupted Items Modal */}
      <CorruptedItemsModal
        isOpen={isCorruptedOpen}
        onClose={onCorruptedClose}
        corruptedItems={corruptedItems}
        onRerollItem={rerollCorruptedItem}
        onSellForGold={sellCorruptedForGold}
        onSellForAlkahest={sellCorruptedForAlkahest}
        onDeleteItem={deleteCorruptedItem}
      />

      {/* Confirm Start with Overflow */}
      <ConfirmStartWithOverflowModal
        isOpen={isConfirmStartOpen}
        onClose={onConfirmStartClose}
        overflowInventory={overflowInventory}
        onConfirm={handleConfirmStart}
      />

      {/* Floor Selection Modal */}
      <FloorSelectionModal
        isOpen={isFloorSelectionOpen}
        onClose={onFloorSelectionClose}
        onConfirm={handleFloorSelected}
        party={party}
        alkahest={useGameStore.getState().alkahest}
      />

      {/* Potion Shop Modal */}
      <PotionShopModal
        isOpen={isShopOpen}
        onClose={onShopClose}
        bankGold={bankGold}
        party={party}
        onPurchase={handlePurchasePotion}
        onPurchaseItem={handlePurchaseItem}
        onSpendGold={spendBankGold}
        bankInventory={bankInventory}
        bankStorageSlots={bankStorageSlots}
      />

      {/* Market Hall Modal */}
      <MarketHallModal
        isOpen={isMarketOpen}
        onClose={onMarketClose}
        bankGold={bankGold}
        party={party}
        onPurchase={handlePurchaseConsumable}
        onSpendGold={spendBankGold}
      />

      {/* Buy Bank Slots Modal */}
      <BuyBankSlotsModal
        isOpen={isBuySlotsOpen}
        onClose={onBuySlotsClose}
        onConfirm={handleExpandBank}
        bankGold={bankGold}
        currentSlots={bankStorageSlots}
      />

      {/* Current Quests Modal */}
      <CurrentQuestsModal
        isOpen={isQuestsOpen}
        onClose={onQuestsClose}
        quests={quests}
        onGoToTown={onGoToTown ?? onBack}
      />
    </Box>
  )
}

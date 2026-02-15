import './PartySetupScreen.css'
import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { useGameStore } from '../../core/gameStore'
import { CORE_CLASSES } from '../../data/classes'
import { GAME_CONFIG } from '../../config/gameConfig'
import { useState, useEffect, useCallback } from 'react'
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

interface PartySetupScreenProps {
  onBack: () => void
  onStart: (startingFloor?: number) => void
}

export function PartySetupScreen({ onBack, onStart }: PartySetupScreenProps) {
  const {
    party,
    addHero,
    removeHero,
    heroRoster,
    addHeroByClass,
    bankInventory,
    bankGold,
    alkahest,
    bankStorageSlots,
    expandBankStorage,
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
    purchasePotion,
    spendBankGold,
  } = useGameStore()

  // Heal all heroes when the party setup screen is mounted
  useEffect(() => {
    healParty()
  }, [healParty])

  const [selectedClass, setSelectedClass] = useState(CORE_CLASSES[0])
  const [selectedHeroFromRoster, setSelectedHeroFromRoster] = useState<number | null>(null)
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number | null>(() => {
    // Auto-select first hero in party if available
    const firstHeroIndex = party.findIndex(h => h !== null)
    return firstHeroIndex >= 0 ? firstHeroIndex : null
  })
  const [tabIndex, setTabIndex] = useState(0)
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

  // Buy bank slots modal
  const { isOpen: isBuySlotsOpen, onOpen: onBuySlotsOpen, onClose: onBuySlotsClose } = useDisclosure()

  // Corrupted items modal
  const { isOpen: isCorruptedOpen, onOpen: onCorruptedOpen, onClose: onCorruptedClose } = useDisclosure()

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

  const handleClassSelect = (classId: string) => {
    const cls = CORE_CLASSES.find(c => c.id === classId)
    if (cls) {
      setSelectedClass(cls)
      setSelectedHeroFromRoster(null)
    }
  }

  const handleRosterHeroClick = (index: number) => {
    setSelectedHeroFromRoster(index)
  }

  const handleAddHeroClick = (index: number) => {
    if (selectedHeroFromRoster !== null) {
      // Add hero from roster to the clicked slot
      const hero = heroRoster[selectedHeroFromRoster]
      addHero(hero, index)
      setSelectedHeroFromRoster(null)
    } else if (selectedClass) {
      // Create new hero from class in the clicked slot
      addHeroByClass(selectedClass, index)
    }
  }

  const handleRemoveHero = (index: number) => {
    const hero = party[index]
    if (hero) {
      removeHero(hero.id)
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
      }
    }
  }

  const handleEquipItemDirect = useCallback((heroIndex: number, item: Item, slotId: string) => {
    const hero = party[heroIndex]
    if (hero) {
      equipItemFromBank(hero.id, item, slotId)
      onClose() // Close bank modal after swap
    }
  }, [party, equipItemFromBank, onClose])

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

  const handlePurchasePotion = (potion: Consumable) => {
    purchasePotion(potion)
  }

  const handlePurchaseConsumable = (consumable: Consumable) => {
    // Check if bank is full
    if (bankInventory.length >= bankStorageSlots) {
      onBuySlotsOpen()
      return
    }
    purchasePotion(consumable)
  }

  const handlePurchaseItem = (item: Item) => {
    // Check if bank is full
    if (bankInventory.length >= bankStorageSlots) {
      onBuySlotsOpen()
      return
    }
    
    if (bankGold >= item.value) {
      moveItemToBank(item)
      spendBankGold(item.value)
    }
  }

  const handleExpandBank = (slots: number) => {
    const costPerSlot = GAME_CONFIG.bank.costPerSlot
    const totalCost = slots * costPerSlot
    
    if (bankGold >= totalCost) {
      expandBankStorage(slots)
    }
  }

  return (
    <Box className="party-setup-screen" h="100vh" w="100vw" bg="gray.900" display="flex" flexDirection="column" overflow="hidden">
      {/* Header */}
      <PartySetupHeader
        bankGold={bankGold}
        metaXp={metaXp}
        alkahest={alkahest}
        bankInventory={bankInventory.length}
        bankStorageSlots={bankStorageSlots}
        canStart={canStart}
        onBack={onBack}
        onStart={handleStart}
        onOpenShop={onShopOpen}
        onOpenMarket={onMarketOpen}
        onOpenBank={handleOpenBank}
      />

      <Flex className="party-setup-screen-content" flex={1} minH={0} overflow="hidden">
        {/* Left Sidebar */}
        <HeroSelectionSidebar
          tabIndex={tabIndex}
          onTabChange={setTabIndex}
          selectedClass={selectedClass}
          selectedHeroFromRoster={selectedHeroFromRoster}
          storedHeroes={heroRoster}
          onClassSelect={handleClassSelect}
          onRosterHeroClick={handleRosterHeroClick}
        />

        {/* Center - Party Slots */}
        <Box className="party-setup-screen-center" flex={1} minW={0} display="flex" flexDirection="column">
          {isPortrait ? (
            // Portrait Layout - PartySummary outside scroll area
            <>
              <PartySummary party={party.filter((h): h is Hero => h !== null)} />
              <PartySetupSlots
                party={party}
                selectedClass={selectedClass}
                selectedHeroFromRoster={selectedHeroFromRoster}
                storedHeroes={heroRoster}
                bankInventory={bankInventory}
                tabIndex={tabIndex}
                onTabChange={setTabIndex}
                onClassSelect={handleClassSelect}
                onRosterHeroClick={handleRosterHeroClick}
                onAddHero={handleAddHeroClick}
                onRemoveHero={handleRemoveHero}
                onSelectHero={setSelectedHeroIndex}
                onSlotClick={handleOpenBankForSlot}
                onUnequipItem={handleUnequipItem}
                onEquipItem={handleEquipItemDirect}
                isBankModalOpen={isOpen}
              />
            </>
          ) : (
            // Desktop Layout - PartySummary below slots
            <>
              <PartySetupSlots
                party={party}
                selectedClass={selectedClass}
                selectedHeroFromRoster={selectedHeroFromRoster}
                storedHeroes={heroRoster}
                bankInventory={bankInventory}
                tabIndex={tabIndex}
                onTabChange={setTabIndex}
                onClassSelect={handleClassSelect}
                onRosterHeroClick={handleRosterHeroClick}
                onAddHero={handleAddHeroClick}
                onRemoveHero={handleRemoveHero}
                onSelectHero={setSelectedHeroIndex}
                onSlotClick={handleOpenBankForSlot}
                onUnequipItem={handleUnequipItem}
                onEquipItem={handleEquipItemDirect}
                isBankModalOpen={isOpen}
              />
              <PartySummary party={party.filter((h): h is Hero => h !== null)} />
            </>
          )}
        </Box>

        {/* Right Sidebar - Equipment */}
        <EquipmentPanel
          selectedHeroIndex={selectedHeroIndex}
          party={party}
          bankInventory={bankInventory}
          onSelectHero={setSelectedHeroIndex}
          onSlotClick={handleOpenBankForSlot}
          onUnequipItem={handleUnequipItem}
          onEquipItem={handleEquipItemDirect}
          isBankModalOpen={isOpen}
        />
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
    </Box>
  )
}

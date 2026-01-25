import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { useGameStore } from '../../store/gameStore'
import { CORE_CLASSES } from '../../data/classes'
import { useState } from 'react'
import type { ItemSlot, Hero } from '../../types'
import { PartySetupHeader } from '../party/PartySetupHeader'
import { HeroSelectionSidebar } from '../party/HeroSelectionSidebar'
import { PartySetupSlots } from '../party/PartySetupSlots'
import { EquipmentPanel } from '../party/EquipmentPanel'
import { BankInventoryModal } from '../party/BankInventoryModal'
import { OverflowInventoryModal } from '../party/OverflowInventoryModal'
import { ConfirmStartWithOverflowModal } from '../party/ConfirmStartWithOverflowModal'
import PartySummary from '../party/PartySummary'

interface PartySetupScreenProps {
  onBack: () => void
  onStart: () => void
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
    bankStorageSlots,
    expandBankStorage,
    equipItemFromBank,
    unequipItemFromHero,
    moveItemToBank,
    overflowInventory,
    keepOverflowItem,
    discardOverflowItem,
    clearOverflow,
  } = useGameStore()

  const [selectedClass, setSelectedClass] = useState(CORE_CLASSES[0])
  const [selectedHeroFromRoster, setSelectedHeroFromRoster] = useState<number | null>(null)
  const [selectedHeroIndex, setSelectedHeroIndex] = useState<number | null>(null)
  const [tabIndex, setTabIndex] = useState(0)
  const [pendingSlotIndex, setPendingSlotIndex] = useState<number | null>(null)
  const [pendingSlot, setPendingSlot] = useState<ItemSlot | null>(null)

  // Bank modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Overflow modal
  const { isOpen: isOverflowOpen, onOpen: onOverflowOpen, onClose: onOverflowClose } = useDisclosure()

  // Start confirmation modal
  const { isOpen: isConfirmStartOpen, onOpen: onConfirmStartOpen, onClose: onConfirmStartClose } = useDisclosure()

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
      // Add hero from roster
      const hero = heroRoster[selectedHeroFromRoster]
      addHero(hero)
      setSelectedHeroFromRoster(null)
    } else if (selectedClass) {
      // Create new hero from class
      addHeroByClass(selectedClass)
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

  const handleOpenBankForSlot = (heroIndex: number, slot: ItemSlot) => {
    setPendingSlotIndex(heroIndex)
    setPendingSlot(slot)
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

  const handleUnequipItem = (heroIndex: number, slot: ItemSlot) => {
    const hero = party[heroIndex]
    if (hero) {
      const unequippedItem = unequipItemFromHero(hero.id, slot)
      if (unequippedItem) {
        moveItemToBank(unequippedItem)
      }
    }
  }

  const handleExpandBank = (count: number) => {
    expandBankStorage(count)
  }

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
      onStart()
    }
  }

  const handleConfirmStart = () => {
    clearOverflow()
    onConfirmStartClose()
    onStart()
  }

  return (
    <Box h="100vh" w="100vw" bg="gray.900" display="flex" flexDirection="column" overflow="hidden">
      {/* Header */}
      <PartySetupHeader
        bankGold={bankGold}
        canStart={canStart}
        onBack={onBack}
        onStart={handleStart}
      />

      <Flex flex={1} minH={0} overflow="hidden">
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
        <Box flex={1} minW={0} display="flex" flexDirection="column">
          <PartySetupSlots
            party={party}
            onAddHero={handleAddHeroClick}
            onRemoveHero={handleRemoveHero}
            onSelectHero={setSelectedHeroIndex}
          />
          <PartySummary party={party.filter((h): h is Hero => h !== null)} />
        </Box>

        {/* Right Sidebar - Equipment */}
        <EquipmentPanel
          selectedHeroIndex={selectedHeroIndex}
          party={party}
          bankInventory={bankInventory}
          bankStorageSlots={bankStorageSlots}
          onSelectHero={setSelectedHeroIndex}
          onOpenBank={onOpen}
          onSlotClick={handleOpenBankForSlot}
          onUnequipItem={handleUnequipItem}
        />
      </Flex>

      {/* Bank Inventory Modal */}
      <BankInventoryModal
        isOpen={isOpen}
        onClose={onClose}
        bankInventory={bankInventory}
        pendingSlot={pendingSlot}
        onEquipItem={handleEquipFromBank}
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
      
      {/* Confirm Start with Overflow */}
      <ConfirmStartWithOverflowModal
        isOpen={isConfirmStartOpen}
        onClose={onConfirmStartClose}
        overflowInventory={overflowInventory}
        onConfirm={handleConfirmStart}
      />
    </Box>
  )
}

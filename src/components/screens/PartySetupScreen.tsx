import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { useGameStore } from '../../store/gameStore'
import { CORE_CLASSES } from '../../data/classes'
import { useState } from 'react'
import { EquipmentSlot } from '../../types'
import { PartySetupHeader } from '../party/PartySetupHeader'
import { HeroSelectionSidebar } from '../party/HeroSelectionSidebar'
import { PartySetupSlots } from '../party/PartySetupSlots'
import { EquipmentPanel } from '../party/EquipmentPanel'
import { BankInventoryModal } from '../party/BankInventoryModal'
import { OverflowInventoryModal } from '../party/OverflowInventoryModal'
import { ConfirmStartWithOverflowModal } from '../party/ConfirmStartWithOverflowModal'

interface PartySetupScreenProps {
  onBack: () => void
  onStart: () => void
}

export function PartySetupScreen({ onBack, onStart }: PartySetupScreenProps) {
  const {
    party,
    addHeroToParty,
    removeHeroFromParty,
    heroRoster,
    addHeroToRoster,
    bankInventory,
    bankGold,
    bankStorageSlots,
    expandBankStorage,
    equipItemFromBank,
    unequipItem,
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
  const [pendingSlot, setPendingSlot] = useState<EquipmentSlot | null>(null)

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
      addHeroToParty(index, hero)
      setSelectedHeroFromRoster(null)
    } else if (selectedClass) {
      // Create new hero from class
      const heroName = `${selectedClass.name} ${Math.floor(Math.random() * 1000)}`
      addHeroToRoster(selectedClass.id, heroName)
      const newHero = useGameStore.getState().heroRoster[useGameStore.getState().heroRoster.length - 1]
      addHeroToParty(index, newHero)
    }
  }

  const removeHero = (index: number) => {
    removeHeroFromParty(index)
    if (selectedHeroIndex === index) {
      setSelectedHeroIndex(null)
    }
  }

  const handleUnequipItem = (heroIndex: number, slot: EquipmentSlot) => {
    const hero = party[heroIndex]
    if (hero) {
      unequipItem(hero.id, slot)
    }
  }

  const handleOpenBankForSlot = (heroIndex: number, slot: EquipmentSlot) => {
    setPendingSlotIndex(heroIndex)
    setPendingSlot(slot)
    onOpen()
  }

  const handleEquipFromBank = (itemId: string) => {
    if (pendingSlotIndex !== null && pendingSlot !== null) {
      const hero = party[pendingSlotIndex]
      if (hero) {
        equipItemFromBank(hero.id, itemId, pendingSlot)
      }
    }
    onClose()
    setPendingSlotIndex(null)
    setPendingSlot(null)
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
    <Box h="100vh" display="flex" flexDirection="column" bg="gray.950">
      {/* Header */}
      <PartySetupHeader
        bankGold={bankGold}
        canStart={canStart}
        onBack={onBack}
        onStart={handleStart}
      />

      <Flex flex={1} overflow="hidden">
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
        <PartySetupSlots
          party={party}
          onAddHero={handleAddHeroClick}
          onRemoveHero={removeHero}
          onSelectHero={setSelectedHeroIndex}
        />

        {/* Right Sidebar - Equipment */}
        <EquipmentPanel
          selectedHeroIndex={selectedHeroIndex}
          party={party}
          bankInventory={bankInventory}
          bankStorageSlots={bankStorageSlots}
          onSelectHero={setSelectedHeroIndex}
          onOpenBank={onOpen}
          onSlotClick={handleOpenBankForSlot}
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

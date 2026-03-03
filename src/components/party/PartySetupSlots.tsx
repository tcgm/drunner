import './PartySetupSlots.css'
import { Box, VStack, Heading, Text, Badge, HStack, SimpleGrid } from '@chakra-ui/react'
import type { Hero, HeroClass, Item } from '../../types'
import { PartySlot } from './PartySlot'
import { PartySlotPopover } from './PartySlotPopover'
import { useState, useEffect } from 'react'

interface PartySlotsProps {
  party: (Hero | null)[]
  selectedClass: HeroClass | null
  selectedHeroFromRoster: number | null
  storedHeroes: Hero[]
  bankInventory: Item[]
  tabIndex: number
  onTabChange: (index: number) => void
  onClassSelect: (classId: string) => void
  onRosterHeroClick: (index: number) => void
  onAddHero: (index: number) => void
  onAddHeroByClass?: (classId: string, slotIndex: number) => void
  onAddHeroFromRoster?: (rosterIndex: number, slotIndex: number) => void
  onRemoveHero: (index: number) => void
  onSelectHero: (index: number) => void
  onSlotClick: (heroIndex: number, slotId: string) => void
  onUnequipItem: (heroIndex: number, slotId: string) => void
  onEquipItem: (heroIndex: number, item: Item, slotId: string) => void
  isBankModalOpen: boolean
}

export function PartySetupSlots({
  party,
  selectedClass,
  selectedHeroFromRoster,
  storedHeroes,
  bankInventory,
  tabIndex,
  onTabChange,
  onClassSelect,
  onRosterHeroClick,
  onAddHero,
  onAddHeroByClass,
  onAddHeroFromRoster,
  onRemoveHero,
  onSelectHero,
  onSlotClick,
  onUnequipItem,
  onEquipItem,
  isBankModalOpen,
}: PartySlotsProps) {
  const partyCount = party.filter(h => h !== null).length
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
  
  return (
    <Box className="party-setup-slots" flex={1} minW={0} display="flex" flexDirection="column" bg="gray.950" p={isPortrait ? 2 : 3} overflow="hidden">
      <VStack className="party-setup-slots-container" spacing={2} h="full" overflow="hidden">
        {isPortrait ? (
          // Portrait Layout - Header above slots, slots in vertical column
          <>
            <VStack className="party-setup-slots-portrait-header" spacing={0.5} w="full" flexShrink={0} pb={1}>
              {/* <Heading size="sm" color="orange.300">
                Your Party
              </Heading> */}
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Tap a slot to add or manage heroes
              </Text>
              <Badge colorScheme="orange" fontSize="sm" px={2}>
                {partyCount}/{party.length}
              </Badge>
            </VStack>
            
            <VStack className="party-setup-slots-portrait-list" spacing={2} w="full" flex={1} minH={0} py={1} overflowY="auto" overflowX="hidden">
              {party.map((hero, index) => (
                <PartySlotPopover
                  key={index}
                  hero={hero}
                  slotIndex={index}
                  party={party}
                  selectedClass={selectedClass}
                  selectedHeroFromRoster={selectedHeroFromRoster}
                  storedHeroes={storedHeroes}
                  bankInventory={bankInventory}
                  tabIndex={tabIndex}
                  onTabChange={onTabChange}
                  onClassSelect={onClassSelect}
                  onRosterHeroClick={onRosterHeroClick}
                  onAdd={() => onAddHero(index)}
                  onAddByClass={onAddHeroByClass ? (classId) => onAddHeroByClass(classId, index) : undefined}
                  onAddFromRoster={onAddHeroFromRoster ? (rosterIndex) => onAddHeroFromRoster(rosterIndex, index) : undefined}
                  onRemove={() => onRemoveHero(index)}
                  onSelect={() => onSelectHero(index)}
                  onSlotClick={onSlotClick}
                  onUnequipItem={onUnequipItem}
                  onEquipItem={onEquipItem}
                  isBankModalOpen={isBankModalOpen}
                />
              ))}
            </VStack>
          </>
        ) : (
          // Desktop Layout - Header in grid, slots horizontal
          <>
            <SimpleGrid className="party-setup-slots-desktop-header" columns={3} w="full" flexShrink={0} gap={4} alignItems="center">
              <Heading size="sm" color="orange.300">
                Your Party
              </Heading>
              <Text fontSize="xs" color="gray.400" textAlign="center">
                Select a class or hero from the left, then click a slot to add
              </Text>
              <Badge colorScheme="orange" fontSize="sm" px={2} justifySelf="end">
                {partyCount}/{party.length}
              </Badge>
            </SimpleGrid>
            
            <HStack className="party-setup-slots-desktop-list" spacing={4} w="full" flex={1} minH={0}>
              {party.map((hero, index) => (
                <PartySlot
                  key={index}
                  hero={hero}
                  slotIndex={index}
                  onAdd={() => onAddHero(index)}
                  onRemove={() => onRemoveHero(index)}
                  onSelect={() => onSelectHero(index)}
                />
              ))}
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  )
}

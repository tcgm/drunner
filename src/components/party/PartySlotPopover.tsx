/**
 * PartySlotPopover - Popover-based slot interaction for portrait mode
 * 
 * Displays a popover when clicking a party slot in portrait mode that contains:
 * - For empty slots: Class selection and Roster tabs to add a hero
 * - For filled slots: Equipment panel and option to change/remove hero
 */

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  Button,
  Icon,
  Text,
  HStack,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
import { GiCancel } from 'react-icons/gi'
import type { Hero, HeroClass, Item } from '../../types'
import { PartySlot } from './PartySlot'
import { ClassSelectionTab } from './ClassSelectionTab'
import { RosterTab } from './RosterTab'
import { EquipmentSlot } from '@/components/ui/EquipmentSlot'
import { getEquipmentSlotIds } from '@/config/slotConfig'
import { restoreItemIcon } from '@/utils/itemUtils'

interface PartySlotPopoverProps {
  hero: Hero | null
  slotIndex: number
  party: (Hero | null)[]
  selectedClass: HeroClass | null
  selectedHeroFromRoster: number | null
  storedHeroes: Hero[]
  bankInventory: Item[]
  tabIndex: number
  onTabChange: (index: number) => void
  onClassSelect: (classId: string) => void
  onRosterHeroClick: (index: number) => void
  onAdd: () => void
  onRemove: () => void
  onSelect: () => void
  onSlotClick: (heroIndex: number, slotId: string) => void
  onUnequipItem: (heroIndex: number, slotId: string) => void
  onEquipItem: (heroIndex: number, item: Item, slotId: string) => void
  isBankModalOpen: boolean
}

export function PartySlotPopover({
  hero,
  slotIndex,
  party,
  selectedClass,
  selectedHeroFromRoster,
  storedHeroes,
  bankInventory,
  tabIndex,
  onTabChange,
  onClassSelect,
  onRosterHeroClick,
  onAdd,
  onRemove,
  onSelect,
  onSlotClick,
  onUnequipItem,
  onEquipItem,
  isBankModalOpen,
}: PartySlotPopoverProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isEmpty = !hero

  const handleSlotClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isEmpty) {
      onOpen()
    } else {
      onOpen()
      onSelect()
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="auto"
      closeOnBlur={true}
      strategy="fixed"
      isLazy
    >
      <PopoverTrigger>
        <Box onClick={handleSlotClick} flex={1} h="full" cursor="pointer">
          <PartySlot
            hero={hero}
            slotIndex={slotIndex}
            onAdd={() => {}} // Disable default behavior - handled by popover
            onRemove={(e?: React.MouseEvent) => {
              if (e) {
                e.stopPropagation()
              }
              onRemove()
              onClose()
            }}
            onSelect={() => {}} // Disable default behavior - handled by popover
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent
        bg="gray.900"
        borderColor="orange.500"
        borderWidth="2px"
        w="95vw"
        maxW="500px"
        maxH="85vh"
      >
        <PopoverArrow bg="gray.900" />
        <PopoverCloseButton />
        <PopoverHeader color="orange.400" fontWeight="bold">
          {isEmpty ? `Party Slot ${slotIndex + 1}` : `${hero.name} - Slot ${slotIndex + 1}`}
        </PopoverHeader>
        <PopoverBody pb={4} px={2} overflowY="auto" maxH="75vh">
          {isEmpty ? (
            // Empty Slot - Show Class Selection and Roster
            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Add a hero to this slot
              </Text>
              <Tabs
                size="sm"
                colorScheme="orange"
                isLazy
                index={tabIndex}
                onChange={onTabChange}
              >
                <TabList mb={3}>
                  <Tab>Classes</Tab>
                  <Tab>Roster</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={0}>
                    <ClassSelectionTab
                      selectedClass={selectedClass}
                      onClassSelect={(classId) => {
                        onClassSelect(classId)
                        // Auto-add when class is selected
                        setTimeout(() => {
                          onAdd()
                          onClose()
                        }, 100)
                      }}
                    />
                  </TabPanel>

                  <TabPanel p={0}>
                    <RosterTab
                      storedHeroes={storedHeroes}
                      selectedHeroFromRoster={selectedHeroFromRoster}
                      onRosterHeroClick={(index) => {
                        onRosterHeroClick(index)
                        // Auto-add when roster hero is selected
                        setTimeout(() => {
                          onAdd()
                          onClose()
                        }, 100)
                      }}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          ) : (
            // Filled Slot - Show Equipment and Actions
            <VStack align="stretch" spacing={4}>
              {/* Equipment Section */}
              <Box>
                <Text fontSize="sm" color="gray.400" mb={2} fontWeight="bold">
                  Equipment
                </Text>
                <SimpleGrid columns={2} spacing={2}>
                  {getEquipmentSlotIds().map((slotId) => {
                    const item = hero.slots[slotId]
                    
                    if (slotId.startsWith('consumable')) {
                      return null // Skip consumables in this compact view
                    }
                    
                    return (
                      <Box 
                        key={slotId} 
                        position="relative"
                        cursor="pointer"
                        onClick={() => onSlotClick(slotIndex, slotId)}
                      >
                        <EquipmentSlot
                          slot={slotId}
                          item={item ? restoreItemIcon(item) : null}
                          availableItems={bankInventory}
                          currentEquipment={hero.slots}
                          showSwapButton={false}
                          size="sm"
                        />
                        {item && (
                          <Button
                            position="absolute"
                            top="-6px"
                            right="-6px"
                            size="xs"
                            colorScheme="orange"
                            variant="solid"
                            onClick={(e) => {
                              e.stopPropagation()
                              onUnequipItem(slotIndex, slotId)
                            }}
                            fontSize="2xs"
                            borderRadius="full"
                            minW="auto"
                            w="20px"
                            h="20px"
                            p={0}
                            zIndex={3}
                          >
                            ×
                          </Button>
                        )}
                      </Box>
                    )
                  })}
                </SimpleGrid>
                
                {/* Consumables Row */}
                <Box mt={3}>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Consumables
                  </Text>
                  <HStack spacing={2}>
                    {getEquipmentSlotIds()
                      .filter(slotId => slotId.startsWith('consumable'))
                      .map((slotId) => {
                        const item = hero.slots[slotId]
                        return (
                          <Box 
                            key={slotId} 
                            position="relative" 
                            flex={1}
                            cursor="pointer"
                            onClick={() => onSlotClick(slotIndex, slotId)}
                          >
                            <EquipmentSlot
                              slot={slotId}
                              item={item ? restoreItemIcon(item) : null}
                              availableItems={bankInventory}
                              currentEquipment={hero.slots}
                              showSwapButton={false}
                              size="sm"
                            />
                            {item && (
                              <Button
                                position="absolute"
                                top="-6px"
                                right="-6px"
                                size="xs"
                                colorScheme="orange"
                                variant="solid"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onUnequipItem(slotIndex, slotId)
                                }}
                                fontSize="2xs"
                                borderRadius="full"
                                minW="auto"
                                w="20px"
                                h="20px"
                                p={0}
                                zIndex={3}
                              >
                                ×
                              </Button>
                            )}
                          </Box>
                        )
                      })}
                  </HStack>
                </Box>
              </Box>

              {/* Actions */}
              <Box>
                <Button
                  colorScheme="red"
                  variant="solid"
                  w="full"
                  leftIcon={<Icon as={GiCancel} />}
                  onClick={() => {
                    onRemove()
                    onClose()
                  }}
                  size="sm"
                >
                  Remove from Party
                </Button>
              </Box>
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

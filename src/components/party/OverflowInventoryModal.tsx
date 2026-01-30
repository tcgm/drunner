import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  VStack, 
  HStack, 
  Box, 
  Text, 
  Button, 
  Badge, 
  Flex,
  Divider,
  Icon,
  Spacer,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedBones, GiCheckMark, GiCrossedSwords, GiCheckedShield } from 'react-icons/gi'
import type { Item } from '../../types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { InventoryControls, type SortOption } from '@/components/inventory/InventoryControls'
import { InventoryTabs } from '@/components/inventory/InventoryTabs'
import { useInventoryFilters } from '@/components/inventory/useInventoryFilters'
import { useItemsByType } from '@/components/inventory/useItemsByType'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'

interface OverflowInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  overflowInventory: Item[]
  bankInventory: Item[]
  bankStorageSlots: number
  bankGold: number
  onExpandBank: (slots: number) => void
  onKeepItem: (itemId: string) => void
  onDiscardItem: (itemId: string) => void
  onClearAll: () => void
}

export function OverflowInventoryModal({
  isOpen,
  onClose,
  overflowInventory,
  bankInventory,
  bankStorageSlots,
  bankGold,
  onExpandBank,
  onKeepItem,
  onDiscardItem,
  onClearAll
}: OverflowInventoryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const toast = useToast()

  // Use shared hooks
  const visibleCount = useLazyLoading({
    isOpen,
    totalItems: overflowInventory.length,
    initialCount: 20,
    batchSize: 100,
    batchDelay: 32
  })

  const bankInventoryCount = bankInventory.length
  const availableSlots = bankStorageSlots - bankInventoryCount
  const slotsNeeded = Math.max(0, overflowInventory.length - availableSlots)
  const costForAllSlots = slotsNeeded * GAME_CONFIG.bank.costPerSlot

  const filteredAndSortedItems = useInventoryFilters({
    items: overflowInventory,
    searchQuery,
    sortBy
  })

  const itemsByType = useItemsByType(filteredAndSortedItems)

  const handleItemClick = useCallback((item: Item) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id)
      } else {
        newSelection.add(item.id)
      }
      return newSelection
    })
  }, [])

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)))
    }
  }

  const handleKeepSelected = () => {
    const itemsToKeep = Array.from(selectedItems)
    const canKeep = Math.min(itemsToKeep.length, availableSlots)
    
    if (canKeep === 0) {
      toast({
        title: "No Space Available",
        description: "Buy more bank slots to keep items",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Keep items up to available slots
    for (let i = 0; i < canKeep; i++) {
      onKeepItem(itemsToKeep[i])
    }
    
    setSelectedItems(new Set())
    
    toast({
      title: "Items Kept",
      description: `Moved ${canKeep} items to bank`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleDiscardSelected = () => {
    const itemsToDiscard = Array.from(selectedItems)
    
    itemsToDiscard.forEach(itemId => onDiscardItem(itemId))
    setSelectedItems(new Set())
    
    toast({
      title: "Items Discarded",
      description: `Discarded ${itemsToDiscard.length} items`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleKeepAll = () => {
    if (slotsNeeded > 0) {
      if (bankGold >= costForAllSlots) {
        // Buy the needed slots
        onExpandBank(slotsNeeded)
        toast({
          title: "Bank Expanded",
          description: `Purchased ${slotsNeeded} slots for ${costForAllSlots} gold`,
          status: "success",
          duration: 2000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Insufficient Gold",
          description: `Need ${costForAllSlots} gold to keep all items (have ${bankGold})`,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        return
      }
    }
    
    // Keep all items
    overflowInventory.forEach(item => onKeepItem(item.id))
    
    toast({
      title: "All Items Kept",
      description: `Moved ${overflowInventory.length} items to bank`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
    
    onClose()
  }

  const handleClose = () => {
    setSelectedItems(new Set())
    setSearchQuery('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside" isCentered={false}>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent className="overflow-inventory-modal" bg="gray.900" maxH="90vh" border="2px solid" borderColor="gray.700" mt={4}>
        <ModalHeader bg="gray.800" borderBottom="2px solid" borderColor="gray.700">
          <Flex align="center" gap={4}>
            <Icon as={GiSwapBag} boxSize={6} color="orange.400" />
            <VStack align="start" spacing={0} flex={1}>
              <Text color="orange.400" fontSize="lg">Items from Last Run</Text>
              <HStack spacing={3} fontSize="sm">
                <Text color="gray.400">
                  Bank: {bankInventoryCount}/{bankStorageSlots} slots
                </Text>
                <Text color={availableSlots > 0 ? 'green.400' : 'red.400'}>
                  {availableSlots} available
                </Text>
                {slotsNeeded > 0 && (
                  <Badge colorScheme="yellow" fontSize="xs">
                    Need {slotsNeeded} more slots
                  </Badge>
                )}
              </HStack>
            </VStack>
            <VStack align="end" spacing={1}>
              <HStack>
                <Icon as={GiTwoCoins} color="yellow.400" boxSize={4} />
                <Text color="yellow.400" fontWeight="bold">{bankGold.toLocaleString()}</Text>
              </HStack>
              {slotsNeeded > 0 && (
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => onExpandBank(5)}
                    isDisabled={bankGold < GAME_CONFIG.bank.costPerSlot * 5}
                    leftIcon={<Icon as={GiTwoCoins} />}
                  >
                    +5 Slots ({(5 * GAME_CONFIG.bank.costPerSlot).toLocaleString()}g)
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="green"
                    onClick={() => onExpandBank(10)}
                    isDisabled={bankGold < GAME_CONFIG.bank.costPerSlot * 10}
                    leftIcon={<Icon as={GiTwoCoins} />}
                  >
                    +10 Slots ({(10 * GAME_CONFIG.bank.costPerSlot).toLocaleString()}g)
                  </Button>
                </HStack>
              )}
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />
        
        <ModalBody p={0} bg="gray.900">
          <Tabs variant="enclosed" colorScheme="orange">
          {/* Control Bar */}
            <VStack className="inventory-controls-sticky" spacing={1} position="sticky" top={0} zIndex={100} bg="gray.900" pt={2} pb={2} px={2}>
            <InventoryControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              rightContent={(
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme={selectedItems.size === filteredAndSortedItems.length ? 'orange' : 'gray'}
                    variant={selectedItems.size === filteredAndSortedItems.length ? 'solid' : 'outline'}
                    onClick={handleSelectAll}
                  >
                    {selectedItems.size === filteredAndSortedItems.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  {selectedItems.size > 0 && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<Icon as={GiCheckMark} />}
                        onClick={handleKeepSelected}
                        isDisabled={availableSlots === 0}
                      >
                        Keep ({selectedItems.size})
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red"
                        leftIcon={<Icon as={GiCrossedBones} />}
                        onClick={handleDiscardSelected}
                      >
                        Discard ({selectedItems.size})
                      </Button>
                    </>
                  )}
                </HStack>
              )}
            />

            {/* Quick Actions */}
            <HStack className="overflow-quick-actions" w="full" spacing={2} pt={1}>
              <Button
                size="sm"
                colorScheme="green"
                leftIcon={<Icon as={GiCheckMark} />}
                onClick={handleKeepAll}
                flex={1}
              >
                Keep All {slotsNeeded > 0 && `(Buy ${slotsNeeded} slots for ${costForAllSlots}g)`}
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={GiCrossedBones} />}
                onClick={() => {
                  onClearAll()
                  onClose()
                }}
              >
                Discard All
              </Button>
            </HStack>
            <Divider borderColor="gray.700" w="full" mt={1} />
            
            {/* Tabs */}
            {overflowInventory.length > 0 && filteredAndSortedItems.length > 0 && (
              <TabList className="inventory-tab-list" borderColor="gray.700" mb={0}>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  All ({itemsByType.all?.length || 0})
                </Tab>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  <Icon as={GiCrossedSwords} mr={2} />
                  Weapons ({itemsByType.weapon?.length || 0})
                </Tab>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  <Icon as={GiCheckedShield} mr={2} />
                  Armor ({itemsByType.armor?.length || 0})
                </Tab>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  Helmets ({itemsByType.helmet?.length || 0})
                </Tab>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  Boots ({itemsByType.boots?.length || 0})
                </Tab>
                <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                  Accessories ({itemsByType.accessories?.length || 0})
                </Tab>
              </TabList>
            )}
          </VStack>

          {/* Item Display */}
          {overflowInventory.length === 0 ? (
            <Box textAlign="center" py={20} px={2}>
              <Icon as={GiSwapBag} boxSize={16} color="gray.600" mb={4} />
              <Text color="gray.500" fontSize="lg">
                No overflow items
              </Text>
            </Box>
          ) : filteredAndSortedItems.length === 0 ? (
            <Box textAlign="center" py={10} px={2}>
              <Text color="gray.500">No items match your search</Text>
            </Box>
          ) : (
            <TabPanels mt={1} px={2} pb={2}>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.all || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.weapon || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.armor || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.helmet || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.boots || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                <ItemGrid items={itemsByType.accessories || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemSelect={handleItemClick} isClickable={true} showCheckbox={true} />
              </TabPanel>
            </TabPanels>
          )}
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

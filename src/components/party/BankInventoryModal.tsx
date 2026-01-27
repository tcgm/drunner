import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Text, 
  Button, 
  HStack, 
  VStack,
  Box,
  Tabs,
  TabPanels,
  TabPanel,
  Input,
  Select,
  Divider,
  Flex,
  Badge,
  useToast,
  Icon,
  Spacer,
} from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedBones } from 'react-icons/gi'
import type { Item, ItemSlot as ItemSlotType } from '../../types'
import { useGameStore } from '@/store/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { InventoryControls, type SortOption, type FilterOption } from '@/components/inventory/InventoryControls'
import { InventoryTabs } from '@/components/inventory/InventoryTabs'
import { useInventoryFilters } from '@/components/inventory/useInventoryFilters'
import { useItemsByType } from '@/components/inventory/useItemsByType'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  pendingSlot: ItemSlotType | null
  onEquipItem: (itemId: string) => void
}

export function BankInventoryModal({ isOpen, onClose, bankInventory, pendingSlot, onEquipItem }: BankInventoryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const { alkahest, discardItems, bankStorageSlots, bankGold, expandBankStorage } = useGameStore()
  const toast = useToast()

  // Use shared hooks
  const visibleCount = useLazyLoading({
    isOpen,
    totalItems: bankInventory.length,
    initialCount: 20,
    batchSize: 100,
    batchDelay: 32
  })

  const filteredAndSortedItems = useInventoryFilters({
    items: bankInventory,
    searchQuery,
    sortBy,
    filterBy,
    pendingSlot
  })

  const itemsByType = useItemsByType(filteredAndSortedItems)

  const handleItemClick = useCallback((item: Item) => {
    if (isSelectionMode && !pendingSlot) {
      setSelectedItems(prev => {
        const newSelection = new Set(prev)
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id)
        } else {
          newSelection.add(item.id)
        }
        return newSelection
      })
    } else if (pendingSlot) {
      onEquipItem(item.id)
    }
  }, [isSelectionMode, pendingSlot, onEquipItem])

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)))
    }
  }

  const handleDiscardSelected = () => {
    const itemsToDiscard = bankInventory.filter(item => selectedItems.has(item.id))
    const totalValue = itemsToDiscard.reduce((sum, item) => sum + item.value, 0)
    const alkahestGained = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate)
    
    discardItems(Array.from(selectedItems))
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    
    toast({
      title: "Items Discarded",
      description: `Gained ${alkahestGained} alkahest from ${itemsToDiscard.length} items`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const handleClose = () => {
    setSelectedItems(new Set())
    setIsSelectionMode(false)
    setSearchQuery('')
    setFilterBy('all')
    onClose()
  }

  const handleExpandBank = (slots: number) => {
    const costPerSlot = GAME_CONFIG.bank.costPerSlot
    const totalCost = slots * costPerSlot
    
    if (bankGold >= totalCost) {
      expandBankStorage(slots)
      toast({
        title: "Bank Expanded",
        description: `Added ${slots} slots for ${totalCost} gold`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Insufficient Gold",
        description: `Need ${totalCost} gold (${bankGold} available)`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside" isCentered={false}>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent className="bank-inventory-modal" bg="gray.900" maxH="90vh" border="2px solid" borderColor="gray.700" mt={4}>
        <ModalHeader bg="gray.800" borderBottom="2px solid" borderColor="gray.700">
          <Flex align="center" gap={4}>
            <Icon as={GiSwapBag} boxSize={8} color="orange.400" />
            <VStack align="start" spacing={0}>
              <Text color="orange.400" fontSize="xl">
                {pendingSlot ? `Select ${pendingSlot}` : 'Bank Inventory'}
              </Text>
              <HStack spacing={4} fontSize="sm">
                <Text color="gray.400">
                  {bankInventory.length} / {bankStorageSlots} slots
                </Text>
                <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                  {bankGold} Gold
                </Badge>
                <Badge colorScheme="yellow" display="flex" alignItems="center" gap={1}>
                  <Icon as={GiTwoCoins} />
                  {alkahest} Alkahest
                </Badge>
                {isSelectionMode && selectedItems.size > 0 && (
                  <Badge colorScheme="blue">
                    {selectedItems.size} Selected
                  </Badge>
                )}
              </HStack>
            </VStack>
            <Spacer />
            {!pendingSlot && (
              <VStack align="end" spacing={1} mr={8}>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    onClick={() => handleExpandBank(5)}
                    isDisabled={bankGold < 5 * GAME_CONFIG.bank.costPerSlot}
                    leftIcon={<Icon as={GiTwoCoins} />}
                  >
                    +5 Slots ({(5 * GAME_CONFIG.bank.costPerSlot).toLocaleString()}g)
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    onClick={() => handleExpandBank(10)}
                    isDisabled={bankGold < 10 * GAME_CONFIG.bank.costPerSlot}
                    leftIcon={<Icon as={GiTwoCoins} />}
                  >
                    +10 Slots ({(10 * GAME_CONFIG.bank.costPerSlot).toLocaleString()}g)
                  </Button>
                </HStack>
              </VStack>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />
        
        <ModalBody p={0} bg="gray.900">
          {/* Control Bar */}
          <VStack className="inventory-controls-sticky" spacing={1} position="sticky" top={0} zIndex={10} bg="gray.900" pt={2} pb={2} px={2}>
            <InventoryControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              showFilter={!pendingSlot}
              rightContent={!pendingSlot && (
                <HStack>
                  <Button 
                    size="sm"
                    colorScheme={isSelectionMode ? "red" : "blue"}
                    onClick={() => {
                      setIsSelectionMode(!isSelectionMode)
                      setSelectedItems(new Set())
                    }}
                  >
                    {isSelectionMode ? "Cancel Selection" : "Select Items"}
                  </Button>
                  {isSelectionMode && (
                    <>
                      <Button size="sm" variant="outline" onClick={handleSelectAll}>
                        {selectedItems.size === filteredAndSortedItems.length ? "Deselect All" : "Select All"}
                      </Button>
                      {selectedItems.size > 0 && (
                        <Button 
                          size="sm" 
                          colorScheme="red"
                          leftIcon={<Icon as={GiCrossedBones} />}
                          onClick={handleDiscardSelected}
                        >
                          Discard ({selectedItems.size})
                        </Button>
                      )}
                    </>
                  )}
                </HStack>
              )}
            />
            <Divider borderColor="gray.700" w="full" mt={1} />
            
            {/* Tabs - only show when not filtering and has items */}
            {!pendingSlot && filterBy === 'all' && bankInventory.length > 0 && filteredAndSortedItems.length > 0 && (
              <Box w="full">
                <InventoryTabs
                  itemsByType={itemsByType}
                  renderContent={() => null}
                />
              </Box>
            )}
          </VStack>

          {/* Item Display */}
          <Box className="inventory-display-area" px={2} pb={2}>
          {bankInventory.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Icon as={GiSwapBag} boxSize={16} color="gray.600" mb={4} />
              <Text color="gray.500" fontSize="lg">
                Your bank is empty
              </Text>
              <Text color="gray.600" fontSize="sm" mt={2}>
                Items from dungeon runs will appear here
              </Text>
            </Box>
          ) : filteredAndSortedItems.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Text color="gray.500" fontSize="lg">
                No items match your filters
              </Text>
            </Box>
          ) : (
            <Tabs variant="enclosed" colorScheme="orange" index={pendingSlot || filterBy !== 'all' ? undefined : 0}>
              {pendingSlot || filterBy !== 'all' ? (
                // Single view when filtering
                <ItemGrid
                  items={filteredAndSortedItems}
                  visibleCount={visibleCount}
                  selectedItems={selectedItems}
                  onItemClick={handleItemClick}
                  isClickable={true}
                />
              ) : (
                // Tabbed view - tabs are in sticky header, just show panels here
                <TabPanels mt={1}>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.all || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.weapon || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.armor || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.helmet || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.boots || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                  <TabPanel px={0} py={1}>
                    <ItemGrid items={itemsByType.accessories || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={handleItemClick} isClickable={true} />
                  </TabPanel>
                </TabPanels>
              )}
            </Tabs>
          )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

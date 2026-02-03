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
  TabList,
  Tab,
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
  useDisclosure,
} from '@chakra-ui/react'
import { useState, useCallback, useMemo } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedBones, GiCrossedSwords, GiCheckedShield } from 'react-icons/gi'
import type { Item } from '../../types'
import { useGameStore } from '@/store/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { InventoryControls, type SortOption, type FilterOption } from '@/components/inventory/InventoryControls'
import { InventoryTabs } from '@/components/inventory/InventoryTabs'
import { useInventoryFilters } from '@/components/inventory/useInventoryFilters'
import { useItemsByType } from '@/components/inventory/useItemsByType'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'
import BuyBankSlotsModal from './BuyBankSlotsModal'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  pendingSlot: string | null
  onEquipItem: (itemId: string) => void
  selectedHeroIndex: number | null
  party: any[]
}

export function BankInventoryModal({ isOpen, onClose, bankInventory, pendingSlot, onEquipItem, selectedHeroIndex, party }: BankInventoryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const { alkahest, discardItems, bankStorageSlots, bankGold, expandBankStorage } = useGameStore()
  const toast = useToast()
  const { isOpen: isBuySlotsOpen, onOpen: onBuySlotsOpen, onClose: onBuySlotsClose } = useDisclosure()

  // Use shared hooks
  const visibleCount = useLazyLoading({
    isOpen,
    totalItems: bankInventory.length,
    initialCount: 30,
    batchSize: 200,
    batchDelay: 50
  })

  const filteredAndSortedItems = useInventoryFilters({
    items: bankInventory,
    searchQuery,
    sortBy,
    filterBy,
    pendingSlot
  })

  const itemsByType = useItemsByType(filteredAndSortedItems)

  // Get currently equipped item for comparison
  const equippedItem = useMemo(() => {
    if (!pendingSlot || selectedHeroIndex === null || !party[selectedHeroIndex]) {
      return null
    }
    const hero = party[selectedHeroIndex]
    const slotItem = hero.slots[pendingSlot]
    return slotItem || null
  }, [pendingSlot, selectedHeroIndex, party])

  // Memoize selected count to prevent re-renders
  const selectedCount = useMemo(() => selectedItems.size, [selectedItems])
  const isAllSelected = useMemo(() => selectedCount === filteredAndSortedItems.length, [selectedCount, filteredAndSortedItems.length])
  const hasSelection = useMemo(() => selectedCount > 0, [selectedCount])

  // Optimized item selection handler that doesn't cause re-renders
  const handleItemSelect = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(itemId)) {
        newSelection.delete(itemId)
      } else {
        newSelection.add(itemId)
      }
      return newSelection
    })
  }, [])

  const handleItemClick = useCallback((item: Item) => {
    if (isSelectionMode && !pendingSlot) {
      handleItemSelect(item.id)
    } else if (pendingSlot) {
      onEquipItem(item.id)
    }
  }, [isSelectionMode, pendingSlot, onEquipItem, handleItemSelect])

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
                {isSelectionMode && hasSelection && (
                  <Badge colorScheme="blue">
                    {selectedCount} Selected
                  </Badge>
                )}
              </HStack>
            </VStack>
            <Spacer />
            {!pendingSlot && (
              <VStack align="end" spacing={1} mr={8}>
                <Button
                  size="sm"
                  colorScheme="purple"
                  onClick={onBuySlotsOpen}
                  leftIcon={<Icon as={GiSwapBag} />}
                >
                  Buy Bank Slots
                </Button>
              </VStack>
            )}
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
                      {hasSelection && (
                        <Button 
                          size="sm" 
                          colorScheme="red"
                          leftIcon={<Icon as={GiCrossedBones} />}
                          onClick={handleDiscardSelected}
                        >
                          Discard ({selectedCount})
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={handleSelectAll}>
                        {isAllSelected ? "Deselect All" : "Select All"}
                      </Button>

                    </>
                  )}
                </HStack>
              )}
            />
            <Divider borderColor="gray.700" w="full" mt={1} />
            
            {/* Tabs - only show when not filtering and has items */}
            {!pendingSlot && filterBy === 'all' && bankInventory.length > 0 && filteredAndSortedItems.length > 0 && (
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
          {bankInventory.length === 0 ? (
            <Box textAlign="center" py={20} px={2}>
              <Icon as={GiSwapBag} boxSize={16} color="gray.600" mb={4} />
              <Text color="gray.500" fontSize="lg">
                Your bank is empty
              </Text>
              <Text color="gray.600" fontSize="sm" mt={2}>
                Items from dungeon runs will appear here
              </Text>
            </Box>
          ) : filteredAndSortedItems.length === 0 ? (
            <Box textAlign="center" py={20} px={2}>
              <Text color="gray.500" fontSize="lg">
                No items match your filters
              </Text>
            </Box>
          ) : pendingSlot || filterBy !== 'all' ? (
            // Single view when filtering
            <Box px={2} pb={2}>
              <ItemGrid
                items={filteredAndSortedItems}
                visibleCount={visibleCount}
                selectedItems={selectedItems}
                onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined}
                      onItemSelect={isSelectionMode ? handleItemSelect : undefined}
                isClickable={true}
                      showCheckbox={isSelectionMode}
                comparisonItem={equippedItem}
              />
            </Box>
          ) : (
            // Tabbed view - tabs are in sticky header
            <TabPanels mt={1} px={2} pb={2}>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.all || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.weapon || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.armor || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.helmet || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.boots || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
              <TabPanel px={0} py={1}>
                        <ItemGrid items={itemsByType.accessories || []} visibleCount={visibleCount} selectedItems={selectedItems} onItemClick={(isSelectionMode || pendingSlot) ? handleItemClick : undefined} onItemSelect={isSelectionMode ? handleItemSelect : undefined} isClickable={true} showCheckbox={isSelectionMode} comparisonItem={equippedItem} />
              </TabPanel>
            </TabPanels>
          )}
          </Tabs>
        </ModalBody>
      </ModalContent>

      {/* Buy Bank Slots Modal */}
      <BuyBankSlotsModal
        isOpen={isBuySlotsOpen}
        onClose={onBuySlotsClose}
        onConfirm={handleExpandBank}
        bankGold={bankGold}
        currentSlots={bankStorageSlots}
      />
    </Modal>
  )
}

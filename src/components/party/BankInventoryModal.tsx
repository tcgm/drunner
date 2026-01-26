import { 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  SimpleGrid, 
  Text, 
  Button, 
  HStack, 
  VStack,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
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
import { useState, useMemo } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedSwords, GiCheckedShield, GiCrossedBones } from 'react-icons/gi'
import type { Item, ItemSlot as ItemSlotType, ItemRarity } from '../../types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { useGameStore } from '@/store/gameStore'
import { GAME_CONFIG } from '@/config/game'

interface BankInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  bankInventory: Item[]
  pendingSlot: ItemSlotType | null
  onEquipItem: (itemId: string) => void
}

type SortOption = 'name' | 'rarity' | 'type' | 'value'
type FilterOption = 'all' | 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory1' | 'accessory2'

export function BankInventoryModal({ isOpen, onClose, bankInventory, pendingSlot, onEquipItem }: BankInventoryModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const { alkahest, discardItems } = useGameStore()
  const toast = useToast()

  // Rarity order for sorting
  const rarityOrder: Record<ItemRarity, number> = {
    junk: 0,
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    mythic: 6,
    artifact: 7,
    cursed: 8,
    set: 9,
  }

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let items = [...bankInventory]

    // Apply pending slot filter first (overrides other filters)
    if (pendingSlot) {
      items = items.filter(item => item.type === pendingSlot)
    } else if (filterBy !== 'all') {
      items = items.filter(item => item.type === filterBy)
    }

    // Apply search
    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sort
    items.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rarity':
          return rarityOrder[b.rarity] - rarityOrder[a.rarity] // Descending
        case 'type':
          return a.type.localeCompare(b.type)
        case 'value':
          return b.value - a.value // Descending
        default:
          return 0
      }
    })

    return items
  }, [bankInventory, pendingSlot, filterBy, searchQuery, sortBy])

  // Group items by type for tab view
  const itemsByType = useMemo(() => {
    const grouped: Record<string, Item[]> = {
      all: filteredAndSortedItems,
      weapon: [],
      armor: [],
      helmet: [],
      boots: [],
      accessories: [],
    }

    filteredAndSortedItems.forEach(item => {
      if (item.type === 'weapon') grouped.weapon.push(item)
      else if (item.type === 'armor') grouped.armor.push(item)
      else if (item.type === 'helmet') grouped.helmet.push(item)
      else if (item.type === 'boots') grouped.boots.push(item)
      else if (item.type === 'accessory1' || item.type === 'accessory2') grouped.accessories.push(item)
    })

    return grouped
  }, [filteredAndSortedItems])

  const handleItemClick = (item: Item) => {
    if (isSelectionMode && !pendingSlot) {
      const newSelection = new Set(selectedItems)
      if (newSelection.has(item.id)) {
        newSelection.delete(item.id)
      } else {
        newSelection.add(item.id)
      }
      setSelectedItems(newSelection)
    } else if (pendingSlot) {
      onEquipItem(item.id)
    }
  }

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

  const renderItemGrid = (items: Item[]) => (
    <SimpleGrid columns={8} spacing={1} minH="400px">
      {items.map((item) => (
        <Box
          key={item.id}
          position="relative"
          borderWidth={selectedItems.has(item.id) ? '2px' : '0'}
          borderColor={selectedItems.has(item.id) ? 'blue.400' : 'transparent'}
          borderRadius="sm"
          transition="all 0.2s"
          cursor="pointer"
          _hover={{
            transform: 'scale(1.05)',
            borderColor: 'blue.300',
            borderWidth: '2px',
          }}
        >
          <ItemSlot
            item={item}
            size="md"
            onClick={() => handleItemClick(item)}
            isClickable={true}
          />
        </Box>
      ))}
    </SimpleGrid>
  )

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside" isCentered={false}>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="gray.900" maxH="90vh" border="2px solid" borderColor="gray.700" mt={4}>
        <ModalHeader bg="gray.800" borderBottom="2px solid" borderColor="gray.700">
          <Flex align="center" gap={4}>
            <Icon as={GiSwapBag} boxSize={8} color="orange.400" />
            <VStack align="start" spacing={0}>
              <Text color="orange.400" fontSize="xl">
                {pendingSlot ? `Select ${pendingSlot}` : 'Bank Inventory'}
              </Text>
              <HStack spacing={4} fontSize="sm">
                <Text color="gray.400">
                  {filteredAndSortedItems.length} / {bankInventory.length} items
                </Text>
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
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />
        
        <ModalBody p={2} bg="gray.900">
          {/* Control Bar */}
          <VStack spacing={1} mb={2}>
            <HStack w="full" spacing={2}>
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                bg="gray.800"
                borderColor="gray.700"
                _hover={{ borderColor: 'gray.600' }}
                maxW="300px"
              />
              
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                size="sm"
                bg="gray.800"
                borderColor="gray.700"
                maxW="150px"
              >
                <option value="rarity">Sort: Rarity</option>
                <option value="name">Sort: Name</option>
                <option value="type">Sort: Type</option>
                <option value="value">Sort: Value</option>
              </Select>

              {!pendingSlot && (
                <Select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  size="sm"
                  bg="gray.800"
                  borderColor="gray.700"
                  maxW="150px"
                >
                  <option value="all">All Items</option>
                  <option value="weapon">Weapons</option>
                  <option value="armor">Armor</option>
                  <option value="helmet">Helmets</option>
                  <option value="boots">Boots</option>
                  <option value="accessory1">Accessories</option>
                </Select>
              )}

              <Spacer />

              {!pendingSlot && (
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
            </HStack>
          </VStack>

          <Divider borderColor="gray.700" mb={2} />

          {/* Item Display */}
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
            <Box>
              {pendingSlot || filterBy !== 'all' ? (
                // Single view when filtering
                renderItemGrid(filteredAndSortedItems)
              ) : (
                // Tabbed view for all items
                <Tabs variant="enclosed" colorScheme="orange">
                  <TabList borderColor="gray.700" mb={1}>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      All ({itemsByType.all.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      <Icon as={GiCrossedSwords} mr={2} />
                      Weapons ({itemsByType.weapon.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      <Icon as={GiCheckedShield} mr={2} />
                      Armor ({itemsByType.armor.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      Helmets ({itemsByType.helmet.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      Boots ({itemsByType.boots.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      Accessories ({itemsByType.accessories.length})
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.all)}
                    </TabPanel>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.weapon)}
                    </TabPanel>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.armor)}
                    </TabPanel>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.helmet)}
                    </TabPanel>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.boots)}
                    </TabPanel>
                    <TabPanel px={0} py={1}>
                      {renderItemGrid(itemsByType.accessories)}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

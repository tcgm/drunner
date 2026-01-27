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
  Input,
  Select,
  Divider,
  Icon,
  Spacer,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { GiTwoCoins, GiSwapBag, GiCrossedBones, GiCheckMark } from 'react-icons/gi'
import type { Item, ItemRarity } from '../../types'
import { ItemSlot } from '@/components/ui/ItemSlot'
import { GAME_CONFIG } from '@/config/gameConfig'
import { restoreItemIcon } from '@/utils/itemUtils'

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

type SortOption = 'name' | 'rarity' | 'type' | 'value'

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

  const bankInventoryCount = bankInventory.length
  const availableSlots = bankStorageSlots - bankInventoryCount
  const slotsNeeded = Math.max(0, overflowInventory.length - availableSlots)
  const costForAllSlots = slotsNeeded * GAME_CONFIG.bank.costPerSlot

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
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
    
    let items = [...overflowInventory]

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
          return rarityOrder[b.rarity] - rarityOrder[a.rarity]
        case 'type':
          return a.type.localeCompare(b.type)
        case 'value':
          return b.value - a.value
        default:
          return 0
      }
    })

    return items
  }, [overflowInventory, searchQuery, sortBy])

  // Group items by type
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
    const newSelection = new Set(selectedItems)
    if (newSelection.has(item.id)) {
      newSelection.delete(item.id)
    } else {
      newSelection.add(item.id)
    }
    setSelectedItems(newSelection)
  }

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

  const renderItemGrid = (items: Item[]) => (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 80px)"
      gap={2.5}
      minH="300px"
      justifyContent="start"
    >
      {items.map((item) => (
        <Box
          key={item.id}
          position="relative"
          borderWidth={selectedItems.has(item.id) ? '2px' : '0'}
          borderColor={selectedItems.has(item.id) ? 'green.400' : 'transparent'}
          borderRadius="sm"
          transition="all 0.2s"
          cursor="pointer"
          w="80px"
          h="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{
            '& > *': {
              transform: 'scale(1.05)',
            },
            borderColor: 'green.300',
            borderWidth: '2px',
          }}
        >
          <ItemSlot
            item={restoreItemIcon(item)}
            size="md"
            onClick={() => handleItemClick(item)}
            isClickable={true}
          />
        </Box>
      ))}
    </Box>
  )

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
                <option value="rarity">Sort by Rarity</option>
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="value">Sort by Value</option>
              </Select>

              <Spacer />

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
            </HStack>

            {/* Quick Actions */}
            <HStack w="full" spacing={2} pt={1}>
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
          </VStack>

          <Divider borderColor="gray.700" mb={2} />

          {/* Item Display */}
          {overflowInventory.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Icon as={GiSwapBag} boxSize={16} color="gray.600" mb={4} />
              <Text color="gray.500" fontSize="lg">
                No overflow items
              </Text>
            </Box>
          ) : (
            <Box>
              {filteredAndSortedItems.length === 0 ? (
                <Box textAlign="center" py={10}>
                  <Text color="gray.500">No items match your search</Text>
                </Box>
              ) : (
                <Tabs variant="soft-rounded" colorScheme="orange" size="sm">
                  <TabList mb={2} flexWrap="wrap">
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      All ({itemsByType.all.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
                      Weapons ({itemsByType.weapon.length})
                    </Tab>
                    <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2}>
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

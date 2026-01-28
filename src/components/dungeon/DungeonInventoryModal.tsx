import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  HStack,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { useState } from 'react'
import type { Item, ItemSlot as ItemSlotType } from '@/types'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { InventoryControls, type SortOption, type FilterOption } from '@/components/inventory/InventoryControls'
import { InventoryTabs } from '@/components/inventory/InventoryTabs'
import { useInventoryFilters } from '@/components/inventory/useInventoryFilters'
import { useItemsByType } from '@/components/inventory/useItemsByType'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'

interface DungeonInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: Item[]
  gold: number
  pendingSlot?: ItemSlotType | null
}

export default function DungeonInventoryModal({ isOpen, onClose, inventory, gold, pendingSlot = null }: DungeonInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  const visibleCount = useLazyLoading({
    isOpen,
    totalItems: inventory.length,
    initialCount: 30,
    batchSize: 200,
    batchDelay: 50
  })

  const filteredAndSortedItems = useInventoryFilters({
    items: inventory,
    searchQuery,
    sortBy,
    filterBy,
    pendingSlot
  })

  const itemsByType = useItemsByType(filteredAndSortedItems)

  const handleClose = () => {
    setSearchQuery('')
    setFilterBy('all')
    onClose()
  }

  const renderItemGrid = (items: Item[]) => (
    <ItemGrid
      items={items}
      visibleCount={visibleCount}
      isClickable={true}
    />
  )

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent className="dungeon-inventory-modal" bg="gray.800" color="white" maxH="90vh" my="2vh">
        <ModalHeader color="orange.400">
          <HStack justify="space-between">
            <Text>Dungeon Inventory</Text>
            <Text color="yellow.400" fontSize="md">{gold} Gold</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} overflowY="auto">
          {inventory.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={8}>
              No items found yet. Explore treasure events to find loot!
            </Text>
          ) : (
            <Box>
              <InventoryControls
                searchQuery={searchQuery}
                sortBy={sortBy}
                filterBy={filterBy}
                onSearchChange={setSearchQuery}
                onSortChange={setSortBy}
                onFilterChange={setFilterBy}
                itemCount={filteredAndSortedItems.length}
                totalCount={inventory.length}
              />

              <Tabs variant="soft-rounded" colorScheme="orange" mt={4}>
                <TabList>
                  <Tab>All Items ({filteredAndSortedItems.length})</Tab>
                  <Tab>By Type</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    {renderItemGrid(filteredAndSortedItems)}
                  </TabPanel>

                  <TabPanel>
                    <InventoryTabs
                      itemsByType={itemsByType}
                      renderContent={renderItemGrid}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
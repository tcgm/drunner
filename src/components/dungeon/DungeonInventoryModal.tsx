import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  HStack,
  VStack,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Icon,
  Divider,
  Tooltip,
} from '@chakra-ui/react'
import { useState } from 'react'
import { GiTwoCoins, GiSwordsPower, GiStack, GiCrossedSwords, GiCheckedShield, GiHealthPotion, GiVisoredHelm, GiBoots, GiNecklace } from 'react-icons/gi'
import type { Item } from '@/types'
import { ItemGrid } from '@/components/inventory/ItemGrid'
import { InventoryControls, type SortOption, type FilterOption } from '@/components/inventory/InventoryControls'
import { useInventoryFilters } from '@/components/inventory/useInventoryFilters'
import { useItemsByType } from '@/components/inventory/useItemsByType'
import { useLazyLoading } from '@/components/inventory/useLazyLoading'
import { GAME_CONFIG } from '@/config/gameConfig'

interface DungeonInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: Item[]
  gold: number
  pendingSlot?: string | null
  hero?: any
}

export default function DungeonInventoryModal({ isOpen, onClose, inventory, gold, pendingSlot = null, hero }: DungeonInventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rarity')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Get currently equipped item for comparison
  const equippedItem = pendingSlot && hero?.slots?.[pendingSlot] ? hero.slots[pendingSlot] : null

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

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={handleClose} size="6xl" isCentered={false}>
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent className="dungeon-inventory-modal" bg="gray.900" maxH="90vh" border="2px solid" borderColor="gray.700" mt={4} maxW={{ base: '95vw', md: '6xl' }} overflow="hidden">
        <ModalHeader bg="gray.800" borderBottom="2px solid" borderColor="gray.700" px={{ base: 2, md: 6 }} py={{ base: 2, md: 4 }}>
          <HStack justify="space-between" align="center">
            <HStack spacing={2}>
              <Icon as={GiSwordsPower} boxSize={{ base: 6, md: 8 }} color="orange.400" />
              <Text color="orange.400" fontSize={{ base: 'sm', md: 'xl' }}>
                {pendingSlot ? `Select ${pendingSlot}` : 'Dungeon Inventory'}
              </Text>
            </HStack>
            <Tooltip label="Gold" placement="bottom" hasArrow>
              <HStack spacing={1} bg="gray.700" px={2} py={0.5} borderRadius="md" cursor="help" mr={8}>
                <Icon as={GiTwoCoins} color={GAME_CONFIG.colors.gold.light} boxSize={3} />
                <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="bold" color={GAME_CONFIG.colors.gold.light}>{gold}</Text>
              </HStack>
            </Tooltip>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" />

        <ModalBody p={0} bg="gray.900">
          <Tabs variant="enclosed" colorScheme="orange">
            {/* Sticky Control Bar */}
            <VStack className="inventory-controls-sticky" spacing={1} position="sticky" top={0} zIndex={100} bg="gray.900" pt={2} pb={2} px={2}>
              <InventoryControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterBy={filterBy}
                onFilterChange={setFilterBy}
                showFilter={!pendingSlot}
              />
              <Divider borderColor="gray.700" w="full" mt={1} />

              {/* Type tabs – only visible in full browse mode */}
              {!pendingSlot && filterBy === 'all' && inventory.length > 0 && filteredAndSortedItems.length > 0 && (
                <TabList className="inventory-tab-list" borderColor="gray.700" mb={0}>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="All">
                    <Icon as={GiStack} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">All ({itemsByType.all?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Weapons">
                    <Icon as={GiCrossedSwords} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Weapons ({itemsByType.weapon?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Armor">
                    <Icon as={GiCheckedShield} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Armor ({itemsByType.armor?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Helmets">
                    <Icon as={GiVisoredHelm} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Helmets ({itemsByType.helmet?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Boots">
                    <Icon as={GiBoots} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Boots ({itemsByType.boots?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Accessories">
                    <Icon as={GiNecklace} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Accessories ({itemsByType.accessories?.length || 0})</span>
                  </Tab>
                  <Tab _selected={{ bg: 'gray.800', color: 'orange.400' }} fontSize="sm" py={2} title="Consumables">
                    <Icon as={GiHealthPotion} mr={{ base: 0, md: 2 }} />
                    <span className="bank-tab-label">Consumables ({itemsByType.consumables?.length || 0})</span>
                  </Tab>
                </TabList>
              )}
            </VStack>

            {/* Item Display */}
            {inventory.length === 0 ? (
              <Box textAlign="center" py={20} px={2}>
                <Icon as={GiSwordsPower} boxSize={16} color="gray.600" mb={4} />
                <Text color="gray.500" fontSize="lg">No items yet</Text>
                <Text color="gray.600" fontSize="sm" mt={2}>Explore treasure events to find loot!</Text>
              </Box>
            ) : filteredAndSortedItems.length === 0 ? (
              <Box textAlign="center" py={20} px={2}>
                <Text color="gray.500" fontSize="lg">No items match your filters</Text>
              </Box>
            ) : pendingSlot || filterBy !== 'all' ? (
              <Box px={2} pb={2}>
                <ItemGrid
                  items={filteredAndSortedItems}
                  visibleCount={visibleCount}
                  isClickable={true}
                  comparisonItem={equippedItem}
                />
              </Box>
            ) : (
              <TabPanels mt={1} px={2} pb={2}>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.all || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.weapon || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.armor || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.helmet || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.boots || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.accessories || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
                <TabPanel px={0} py={1}>
                  <ItemGrid items={itemsByType.consumables || []} visibleCount={visibleCount} isClickable={true} comparisonItem={equippedItem} />
                </TabPanel>
              </TabPanels>
            )}
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
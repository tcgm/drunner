import { VStack, Box, Text, SimpleGrid, HStack, Button, Icon } from '@chakra-ui/react'
import { useState, useEffect, useCallback } from 'react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, Item } from '../../types'
import { ItemSlot as ItemSlotComponent } from '@/components/ui/ItemSlot'
import { EquipmentSlot } from '@/components/ui/EquipmentSlot'
import { restoreItemIcon } from '@/utils/itemUtils'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getEquipmentSlotIds } from '@/config/slotConfig'
import { isItemCompatibleWithSlot } from '@/utils/equipmentUtils'
// import { useGameStore } from '@/store/gameStore'
// import { calculateStatsWithEquipment } from '@/systems/loot/inventoryManager'

const SLOT_ICONS: Record<ItemSlot, IconType> = {
  weapon: GameIcons.GiSwordman,
  armor: GameIcons.GiChestArmor,
  helmet: GameIcons.GiHelmet,
  boots: GameIcons.GiBootStomp,
  accessory1: GameIcons.GiRing,
  accessory2: GameIcons.GiGemNecklace,
}

const SLOT_NAMES: Record<ItemSlot, string> = {
  weapon: 'Weapon',
  armor: 'Armor',
  helmet: 'Helmet',
  boots: 'Boots',
  accessory1: 'Accessory',
  accessory2: 'Accessory',
}

// const RARITY_COLORS: Record<string, string> = {
//   junk: 'gray',
//   common: 'gray',
//   uncommon: 'green',
//   rare: 'blue',
//   epic: 'purple',
//   legendary: 'orange',
//   mythic: 'pink',
// }

interface EquipmentPanelProps {
  party: (Hero | null)[]
  selectedHeroIndex: number | null
  bankInventory: Item[]
  onSelectHero: (index: number) => void
  onSlotClick: (heroIndex: number, slotId: string) => void
  onUnequipItem: (heroIndex: number, slotId: string) => void
  onEquipItem?: (heroIndex: number, item: Item, slotId: string) => void
  isBankModalOpen: boolean
}

export function EquipmentPanel({
  party,
  selectedHeroIndex,
  bankInventory,
  onSelectHero,
  onSlotClick,
  onUnequipItem,
  onEquipItem,
  isBankModalOpen
}: EquipmentPanelProps) {
  const selectedHero = selectedHeroIndex !== null ? party[selectedHeroIndex] : null
  const activeParty = party.filter((h): h is Hero => h !== null)
  const [swapMode, setSwapMode] = useState<string | null>(null)

  const handleSwap = (slotId: string) => {
    if (swapMode === null) {
      setSwapMode(slotId)
      // Open bank modal for swap mode
      if (selectedHeroIndex !== null) {
        onSlotClick(selectedHeroIndex, slotId)
      }
    } else {
      setSwapMode(null)
    }
  }

  // Handle item click from ItemSlot when in swap mode
  const handleInventoryItemClick = useCallback((item: Item) => {
    if (swapMode !== null && selectedHeroIndex !== null && onEquipItem) {
      // Check if item is compatible
      const isCompatible = isItemCompatibleWithSlot(item, swapMode)
      if (isCompatible) {
        onEquipItem(selectedHeroIndex, item, swapMode)
        setSwapMode(null)
      }
    }
  }, [swapMode, selectedHeroIndex, onEquipItem])

  // Sync swap mode with modal state - when modal closes, clear swap mode
  useEffect(() => {
    if (!isBankModalOpen && swapMode !== null) {
      setSwapMode(null)
    }
  }, [isBankModalOpen, swapMode])

  // Expose swap handler globally so inventory items can call it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__heroModalSwapHandler = swapMode !== null ? handleInventoryItemClick : null
    }
    return () => {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__heroModalSwapHandler = null
      }
    }
  }, [swapMode, handleInventoryItemClick])

  const renderEquipmentSlot = (slotId: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (!selectedHero) return null
    
    const item = selectedHero.slots[slotId]
    const isEmpty = !item

    if (isEmpty) {
      // Empty slot - clickable to equip with upgrade indicator and swap button
      return (
        <Box
          key={slotId}
          onClick={() => selectedHeroIndex !== null && onSlotClick(selectedHeroIndex, slotId)}
          cursor="pointer"
        >
          <EquipmentSlot
            slot={slotId}
            item={null}
            availableItems={bankInventory}
            currentEquipment={selectedHero.slots}
            isSwapActive={swapMode === slotId}
            showSwapButton={true}
            onSwapClick={() => handleSwap(slotId)}
            size={size}
          />
        </Box>
      )
    }

    // Equipped item - show both swap button and unequip button
    return (
      <Box key={slotId} position="relative">
        <EquipmentSlot
          slot={slotId}
          item={restoreItemIcon(item)}
          availableItems={bankInventory}
          currentEquipment={selectedHero.slots}
          isSwapActive={swapMode === slotId}
          showSwapButton={true}
          onSwapClick={() => handleSwap(slotId)}
          size={size}
        />
        <Button
          position="absolute"
          top="-8px"
          right="-8px"
          size="xs"
          colorScheme="orange"
          variant="solid"
          onClick={(e) => {
            e.stopPropagation()
            if (selectedHeroIndex !== null) {
              onUnequipItem(selectedHeroIndex, slotId)
            }
          }}
          fontSize="2xs"
          borderRadius="full"
          minW="auto"
          w="24px"
          h="24px"
          p={0}
          zIndex={3}
        >
          ×
        </Button>
      </Box>
    )
  }

  return (
    <Box className="equipment-panel" w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={3} overflowY="auto">
      <VStack spacing={2} h="full">
        <Text fontSize="sm" fontWeight="bold" color="orange.300">
          Equipment
        </Text>
        
        {activeParty.length > 0 ? (
          <>
            {/* Hero selector tabs */}
            {activeParty.length > 1 && (
              <HStack className="equipment-panel-hero-tabs" spacing={1} w="full" flexWrap="wrap">
                {activeParty.map((hero, index) => (
                  <Button
                    key={hero.id}
                    size="xs"
                    variant={selectedHeroIndex === index ? 'solid' : 'outline'}
                    colorScheme="orange"
                    onClick={() => onSelectHero(index)}
                    flex={1}
                    minW="60px"
                  >
                    {hero.name.split(' ')[0]}
                  </Button>
                ))}
              </HStack>
            )}

            {/* Inventory panel for selected hero */}
            {selectedHero && (
              <VStack className="equipment-panel-hero-equipment" spacing={1.5} w="full" flex={1}>
                <Text fontSize="xs" fontWeight="bold" color="orange.300">
                  {selectedHero.name}'s Equipment
                </Text>

                <SimpleGrid columns={3} spacing={1.5} w="full">
                  {renderEquipmentSlot('weapon')}
                  {renderEquipmentSlot('armor')}
                  {renderEquipmentSlot('helmet')}
                </SimpleGrid>

                <SimpleGrid columns={3} spacing={1.5} w="full">
                  {renderEquipmentSlot('boots')}
                  {renderEquipmentSlot('accessory1')}
                  {renderEquipmentSlot('accessory2')}
                </SimpleGrid>

                {/* Consumable slots */}
                <HStack spacing={1.5} w="full" justify="center">
                  {renderEquipmentSlot('consumable1', 'sm')}
                  {renderEquipmentSlot('consumable2', 'sm')}
                  {renderEquipmentSlot('consumable3', 'sm')}
                </HStack>

                {/* Equipment bonuses summary */}
                <Box
                  className="equipment-panel-bonuses"
                  bg="gray.800"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.600"
                  p={1.5}
                  w="full"
                >
                  <Text fontSize="2xs" color="gray.400" mb={0.5}>Equipment Bonuses:</Text>
                  {(() => {
                    // Calculate equipment bonuses by summing up item stats
                    const equipmentBonuses = {
                      attack: 0,
                      defense: 0,
                      speed: 0,
                      luck: 0,
                      maxHp: 0,
                      magicPower: 0,
                      wisdom: 0,
                      charisma: 0,
                    }
                    
                    // Sum stats from all equipped items
                    Object.values(selectedHero.slots).forEach(item => {
                      if (item && 'stats' in item && item.stats) {
                        if (item.stats.attack) equipmentBonuses.attack += item.stats.attack
                        if (item.stats.defense) equipmentBonuses.defense += item.stats.defense
                        if (item.stats.speed) equipmentBonuses.speed += item.stats.speed
                        if (item.stats.luck) equipmentBonuses.luck += item.stats.luck
                        if (item.stats.maxHp) equipmentBonuses.maxHp += item.stats.maxHp
                        if (item.stats.magicPower) equipmentBonuses.magicPower += item.stats.magicPower
                        if (item.stats.wisdom) equipmentBonuses.wisdom += item.stats.wisdom
                        if (item.stats.charisma) equipmentBonuses.charisma += item.stats.charisma
                      }
                    })

                    const hasAnyBonuses = Object.values(equipmentBonuses).some(bonus => bonus > 0)
                    
                    if (!hasAnyBonuses) {
                      return (
                        <Text fontSize="2xs" color="gray.500" textAlign="center">
                          No equipment bonuses
                        </Text>
                      )
                    }

                    return (
                      <SimpleGrid columns={2} spacing={0.5} fontSize="2xs">
                        {equipmentBonuses.attack > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.attack}>
                            ATK: +{equipmentBonuses.attack}
                          </Text>
                        )}
                        {equipmentBonuses.defense > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.defense}>
                            DEF: +{equipmentBonuses.defense}
                          </Text>
                        )}
                        {equipmentBonuses.speed > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.speed}>
                            SPD: +{equipmentBonuses.speed}
                          </Text>
                        )}
                        {equipmentBonuses.luck > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.luck}>
                            LUCK: +{equipmentBonuses.luck}
                          </Text>
                        )}
                        {equipmentBonuses.maxHp > 0 && (
                          <Text color={GAME_CONFIG.colors.hp.light}>
                            HP: +{equipmentBonuses.maxHp}
                          </Text>
                        )}
                        {equipmentBonuses.magicPower > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.magicPower}>
                            MP: +{equipmentBonuses.magicPower}
                          </Text>
                        )}
                        {equipmentBonuses.wisdom > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.wisdom}>
                            WIS: +{equipmentBonuses.wisdom}
                          </Text>
                        )}
                        {equipmentBonuses.charisma > 0 && (
                          <Text color={GAME_CONFIG.colors.stats.charisma}>
                            CHA: +{equipmentBonuses.charisma}
                          </Text>
                        )}
                      </SimpleGrid>
                    )
                  })()}
                </Box>
              </VStack>
            )}
          </>
        ) : (
          <Box flex={1} display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={2}>
              <Text color="gray.600" fontSize="sm" textAlign="center">
                No Heroes
              </Text>
              <Text color="gray.700" fontSize="xs" textAlign="center">
                Add heroes to manage their equipment
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

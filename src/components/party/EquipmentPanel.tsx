import { VStack, Box, Text, SimpleGrid, HStack, Button } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, ItemSlot, Item } from '../../types'
import { ItemSlot as ItemSlotComponent } from '@/components/ui/ItemSlot'
import { restoreItemIcon } from '@/utils/itemUtils'
import { GAME_CONFIG } from '@/config/gameConfig'
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
  bankStorageSlots: number
  onSelectHero: (index: number) => void
  onOpenBank: () => void
  onSlotClick: (heroIndex: number, slot: ItemSlot) => void
  onUnequipItem: (heroIndex: number, slot: ItemSlot) => void
}

export function EquipmentPanel({
  party,
  selectedHeroIndex,
  bankInventory,
  bankStorageSlots,
  onSelectHero,
  onOpenBank,
  onSlotClick,
  onUnequipItem
}: EquipmentPanelProps) {
  const selectedHero = selectedHeroIndex !== null ? party[selectedHeroIndex] : null
  const activeParty = party.filter((h): h is Hero => h !== null)

  const renderEquipmentSlot = (slot: ItemSlot) => {
    if (!selectedHero) return null
    
    const item = selectedHero.equipment[slot]
    const SlotIcon = SLOT_ICONS[slot]
    const isEmpty = !item

    if (isEmpty) {
      // Empty slot - clickable to equip
      return (
        <Box
          className={`equipment-slot equipment-slot--empty equipment-slot--${slot}`}
          key={slot}
          position="relative"
          bg="gray.800"
          borderRadius="lg"
          borderWidth="2px"
          borderColor="gray.600"
          p={3}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ borderColor: 'orange.500', transform: 'translateY(-2px)' }}
          onClick={() => selectedHeroIndex !== null && onSlotClick(selectedHeroIndex, slot)}
          height="80px"
          width="80px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <SlotIcon size={32} color="#4A5568" />
          <Text fontSize="2xs" color="gray.600" textAlign="center" mt={1}>
            {SLOT_NAMES[slot]}
          </Text>
        </Box>
      )
    }

    // Equipped item - use ItemSlot component
    return (
      <Box className={`equipment-slot equipment-slot--filled equipment-slot--${slot}`} key={slot} position="relative">
        <ItemSlotComponent
          item={restoreItemIcon(item)}
          size="md"
          isClickable={true}
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
              onUnequipItem(selectedHeroIndex, slot)
            }
          }}
          fontSize="2xs"
          borderRadius="full"
          minW="auto"
          w="24px"
          h="24px"
          p={0}
        >
          ×
        </Button>
      </Box>
    )
  }

  return (
    <Box className="equipment-panel" w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={4} overflowY="auto">
      <VStack spacing={3} h="full">
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" fontWeight="bold" color="orange.300">
            Equipment
          </Text>
          <Button size="xs" colorScheme="blue" variant="outline" onClick={onOpenBank}>
            Bank ({bankInventory.length}/{bankStorageSlots})
          </Button>
        </HStack>
        
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
              <VStack className="equipment-panel-hero-equipment" spacing={3} w="full" flex={1}>
                <Text fontSize="sm" fontWeight="bold" color="orange.300">
                  {selectedHero.name}'s Equipment
                </Text>

                <SimpleGrid columns={3} spacing={2} w="full">
                  {renderEquipmentSlot('weapon')}
                  {renderEquipmentSlot('armor')}
                  {renderEquipmentSlot('helmet')}
                </SimpleGrid>

                <SimpleGrid columns={3} spacing={2} w="full">
                  {renderEquipmentSlot('boots')}
                  {renderEquipmentSlot('accessory1')}
                  {renderEquipmentSlot('accessory2')}
                </SimpleGrid>

                {/* Equipment bonuses summary */}
                <Box
                  className="equipment-panel-bonuses"
                  bg="gray.800"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.600"
                  p={2}
                  w="full"
                >
                  <Text fontSize="xs" color="gray.400" mb={1}>Equipment Bonuses:</Text>
                  {(() => {
                    // Calculate equipment bonuses by summing up item stats
                    const equipmentBonuses = {
                      attack: 0,
                      defense: 0,
                      speed: 0,
                      luck: 0,
                      maxHp: 0,
                      magicPower: 0,
                    }
                    
                    // Sum stats from all equipped items
                    Object.values(selectedHero.equipment).forEach(item => {
                      if (item && item.stats) {
                        if (item.stats.attack) equipmentBonuses.attack += item.stats.attack
                        if (item.stats.defense) equipmentBonuses.defense += item.stats.defense
                        if (item.stats.speed) equipmentBonuses.speed += item.stats.speed
                        if (item.stats.luck) equipmentBonuses.luck += item.stats.luck
                        if (item.stats.maxHp) equipmentBonuses.maxHp += item.stats.maxHp
                        if (item.stats.magicPower) equipmentBonuses.magicPower += item.stats.magicPower
                      }
                    })

                    const hasAnyBonuses = Object.values(equipmentBonuses).some(bonus => bonus > 0)
                    
                    if (!hasAnyBonuses) {
                      return (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          No equipment bonuses
                        </Text>
                      )
                    }

                    return (
                      <SimpleGrid columns={2} spacing={1} fontSize="xs">
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

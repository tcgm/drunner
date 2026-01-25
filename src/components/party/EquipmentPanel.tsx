import { VStack, Box, Text, SimpleGrid, Badge, Tooltip, Flex, Button, Icon, HStack } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, ItemSlot, Item } from '../../types'

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

const RARITY_COLORS: Record<string, string> = {
  junk: 'gray',
  common: 'gray',
  uncommon: 'green',
  rare: 'blue',
  epic: 'purple',
  legendary: 'orange',
  mythic: 'pink',
}

interface EquipmentPanelProps {
  party: (Hero | null)[]
  selectedHeroIndex: number | null
  bankInventory: Item[]
  bankStorageSlots: number
  onSelectHero: (index: number) => void
  onOpenBank: () => void
  onSlotClick: (heroIndex: number, slot: ItemSlot) => void
}

export function EquipmentPanel({
  party,
  selectedHeroIndex,
  bankInventory,
  bankStorageSlots,
  onSelectHero,
  onOpenBank,
  onSlotClick
}: EquipmentPanelProps) {
  const selectedHero = selectedHeroIndex !== null ? party[selectedHeroIndex] : null
  const activeParty = party.filter((h): h is Hero => h !== null)

  const renderEquipmentSlot = (slot: ItemSlot) => {
    if (!selectedHero) return null
    
    const item = selectedHero.equipment[slot]
    const SlotIcon = SLOT_ICONS[slot]
    const isEmpty = !item

    return (
      <Tooltip
        key={slot}
        label={
          item ? (
            <VStack align="start" spacing={1} p={1}>
              <Text fontWeight="bold" fontSize="sm" color={`${RARITY_COLORS[item.rarity]}.300`}>
                {item.name}
              </Text>
              <Text fontSize="xs" color="gray.300">{item.description}</Text>
              {item.stats && Object.keys(item.stats).length > 0 && (
                <Box pt={1}>
                  {Object.entries(item.stats).map(([stat, value]) => (
                    <Text key={stat} fontSize="xs" color="green.300">
                      +{String(value)} {stat.toUpperCase()}
                    </Text>
                  ))}
                </Box>
              )}
              <Text fontSize="xs" color="yellow.300" pt={1}>
                Value: {item.value} gold
              </Text>
            </VStack>
          ) : (
            <Text fontSize="xs">{SLOT_NAMES[slot]} slot empty</Text>
          )
        }
        placement="top"
        hasArrow
        bg="gray.800"
      >
        <Box
          position="relative"
          bg={isEmpty ? 'gray.800' : 'gray.700'}
          borderRadius="md"
          borderWidth="2px"
          borderColor={isEmpty ? 'gray.600' : `${RARITY_COLORS[item?.rarity || 'common']}.500`}
          p={3}
          cursor={isEmpty ? 'pointer' : 'default'}
          transition="all 0.2s"
          _hover={isEmpty ? { borderColor: 'orange.500', transform: 'translateY(-2px)' } : { borderColor: `${RARITY_COLORS[item?.rarity || 'common']}.400`, transform: 'translateY(-2px)' }}
          onClick={() => isEmpty && selectedHeroIndex !== null && onSlotClick(selectedHeroIndex, slot)}
        >
          {/* Slot Icon */}
          <Flex direction="column" align="center" gap={1}>
            <Icon
              as={SlotIcon}
              boxSize={8}
              color={isEmpty ? 'gray.600' : `${RARITY_COLORS[item?.rarity || 'common']}.300`}
            />
            <Text fontSize="xs" color="gray.500" textAlign="center">
              {SLOT_NAMES[slot]}
            </Text>
          </Flex>

          {/* Item indicator */}
          {!isEmpty && (
            <>
              <Badge
                position="absolute"
                top={1}
                right={1}
                fontSize="xx-small"
                colorScheme={RARITY_COLORS[item.rarity]}
              >
                {item.rarity}
              </Badge>
              <Button
                position="absolute"
                bottom={1}
                right={1}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  // unequip handler
                }}
                fontSize="xs"
              >
                Sell
              </Button>
            </>
          )}
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box w="300px" minW="300px" bg="gray.900" borderLeft="2px solid" borderColor="gray.800" p={4} overflowY="auto">
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
              <HStack spacing={1} w="full" flexWrap="wrap">
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
              <VStack spacing={3} w="full" flex={1}>
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

                {/* Stats summary */}
                <Box
                  bg="gray.800"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.600"
                  p={2}
                  w="full"
                >
                  <Text fontSize="xs" color="gray.400" mb={1}>Equipment Bonuses:</Text>
                  <SimpleGrid columns={3} spacing={1} fontSize="xs">
                    <Text color="red.300">
                      ATK: {selectedHero.stats.attack - (selectedHero.class.baseStats.attack + (selectedHero.level - 1) * 5)}
                    </Text>
                    <Text color="blue.300">
                      DEF: {selectedHero.stats.defense - (selectedHero.class.baseStats.defense + (selectedHero.level - 1) * 5)}
                    </Text>
                    <Text color="green.300">
                      SPD: {selectedHero.stats.speed - (selectedHero.class.baseStats.speed + (selectedHero.level - 1) * 5)}
                    </Text>
                  </SimpleGrid>
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

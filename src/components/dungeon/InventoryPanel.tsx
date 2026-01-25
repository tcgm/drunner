import { VStack, Box, Text, SimpleGrid, Badge, Tooltip, Flex, Button, Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, ItemSlot } from '@/types'
import { useGameStore } from '@store/gameStore'

interface InventoryPanelProps {
  hero: Hero
  onSlotClick?: (heroId: string, slot: ItemSlot) => void
  showBankOption?: boolean
}

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

export default function InventoryPanel({ hero, onSlotClick, showBankOption }: InventoryPanelProps) {
  const { unequipItemFromHero, sellItemForGold } = useGameStore()

  const handleUnequip = (slot: ItemSlot) => {
    const item = unequipItemFromHero(hero.id, slot)
    if (item) {
      // For now, auto-sell unequipped items
      sellItemForGold(item)
    }
  }
  
  const handleSlotClick = (slot: ItemSlot) => {
    if (showBankOption && onSlotClick) {
      onSlotClick(hero.id, slot)
    }
  }

  const renderEquipmentSlot = (slot: ItemSlot) => {
    const item = hero.equipment[slot]
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
                      +{value} {stat.toUpperCase()}
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
          cursor={showBankOption || !isEmpty ? 'pointer' : 'default'}
          transition="all 0.2s"
          _hover={showBankOption || !isEmpty ? { borderColor: isEmpty ? 'blue.500' : `${RARITY_COLORS[item?.rarity || 'common']}.400`, transform: 'translateY(-2px)' } : {}}
          onClick={() => isEmpty && showBankOption ? handleSlotClick(slot) : undefined}
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
                  handleUnequip(slot)
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
    <VStack spacing={3} w="full">
      <Text fontSize="sm" fontWeight="bold" color="orange.300">
        {hero.name}'s Equipment
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
            ATK: {hero.stats.attack - (hero.class.baseStats.attack + (hero.level - 1) * 5)}
          </Text>
          <Text color="blue.300">
            DEF: {hero.stats.defense - (hero.class.baseStats.defense + (hero.level - 1) * 5)}
          </Text>
          <Text color="green.300">
            SPD: {hero.stats.speed - (hero.class.baseStats.speed + (hero.level - 1) * 5)}
          </Text>
        </SimpleGrid>
      </Box>
    </VStack>
  )
}

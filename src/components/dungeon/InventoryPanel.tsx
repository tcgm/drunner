import { VStack, Box, Text, SimpleGrid, Badge, Tooltip, Flex, Button, Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { Hero, Consumable, Item } from '@/types'
import { useGameStore } from '@/core/gameStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getEquipmentSlotIds, getSlotById } from '@/config/slotConfig'
import { restoreItemIcon } from '@/utils/itemUtils'
import { useConsumable as applyConsumable } from '@/systems/consumables/consumableManager'

interface InventoryPanelProps {
  hero: Hero
  onSlotClick?: (heroId: string, slotId: string) => void
  showBankOption?: boolean
}

const SLOT_ICONS: Record<string, IconType> = {
  weapon: GameIcons.GiSwordman,
  armor: GameIcons.GiChestArmor,
  helmet: GameIcons.GiHelmet,
  boots: GameIcons.GiBootStomp,
  accessory1: GameIcons.GiRing,
  accessory2: GameIcons.GiGemNecklace,
  consumable1: GameIcons.GiPotion,
  consumable2: GameIcons.GiPotion,
  consumable3: GameIcons.GiPotion,
}

const RARITY_COLORS: Record<string, string> = {
  junk: 'gray',
  abundant: 'teal',
  common: 'lime',
  uncommon: 'blue',
  rare: 'purple',
  veryRare: 'fuchsia',
  magical: 'cyan',
  elite: 'rose',
  epic: 'pink',
  legendary: 'orange',
  mythic: 'yellow',
  mythicc: 'red',
  artifact: 'amber',
  divine: 'emerald',
  celestial: 'sky',
  realityAnchor: 'indigo',
  structural: 'violet',
  singularity: 'purple',
  void: 'lime',
  elder: 'slate',
  layer: 'rose',
  plane: 'teal',
  author: 'gray',
}

export default function InventoryPanel({ hero, onSlotClick, showBankOption }: InventoryPanelProps) {
  const { unequipItemFromHero, addItemToDungeonInventory, updateHero, party, dungeon } = useGameStore()

  const handleUnequip = (slotId: string) => {
    const item = unequipItemFromHero(hero.id, slotId)
    if (item) {
      // Add unequipped item back to dungeon inventory
      addItemToDungeonInventory(item)
    }
  }
  
  const handleUseConsumable = (slotId: string) => {
    const item = hero.slots[slotId]
    if (item && 'consumableType' in item) {
      const result = applyConsumable(hero, slotId, dungeon.floor, party)
      if (result.hero) {
        updateHero(result.hero.id, result.hero)
        // TODO: Show message to user
        console.log(result.message)
      }
    }
  }
  
  const handleSlotClick = (slotId: string) => {
    if (showBankOption && onSlotClick) {
      onSlotClick(hero.id, slotId)
    }
  }

  const renderEquipmentSlot = (slotId: string) => {
    const item = hero.slots[slotId] ? restoreItemIcon(hero.slots[slotId]) : null
    const SlotIcon = SLOT_ICONS[slotId] || GameIcons.GiSquare
    const slotDef = getSlotById(slotId)
    const slotName = slotDef?.name || slotId
    const isEmpty = !item
    const isConsumable = item && 'consumableType' in item

    return (
      <Tooltip
        key={slotId}
        label={
          item ? (
            <VStack className="inventory-panel-tooltip" align="start" spacing={1} p={1}>
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
              {isConsumable && (
                <Text fontSize="xs" color="cyan.300" pt={1}>
                  Click "Use" to consume
                </Text>
              )}
              <Text fontSize="xs" color="yellow.300" pt={1}>
                Value: {item.value} gold
              </Text>
            </VStack>
          ) : (
            <Text fontSize="xs">{slotName} slot empty</Text>
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
          onClick={() => isEmpty && showBankOption ? handleSlotClick(slotId) : undefined}
        >
          {/* Slot Icon */}
          <Flex direction="column" align="center" gap={1}>
            <Icon
              as={SlotIcon}
              boxSize={8}
              color={isEmpty ? 'gray.600' : `${RARITY_COLORS[item?.rarity || 'common']}.300`}
            />
            <Text fontSize="xs" color="gray.500" textAlign="center">
              {slotName}
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
              {isConsumable ? (
                <Button
                  position="absolute"
                  bottom={1}
                  right={1}
                  size="xs"
                  colorScheme="green"
                  variant="solid"
                  isDisabled={(() => {
                    const consumable = item as Consumable
                    const isRevive = consumable.effect?.type === 'revive'
                    return isRevive ? hero.isAlive : false
                  })()}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUseConsumable(slotId)
                  }}
                  fontSize="xs"
                >
                  Use
                </Button>
              ) : (
                <Button
                  position="absolute"
                  bottom={1}
                  right={1}
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUnequip(slotId)
                  }}
                  fontSize="xs"
                >
                  Unequip
                </Button>
              )}
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

      {/* Consumables Section */}
      <Text fontSize="sm" fontWeight="bold" color="cyan.300" pt={2}>
        Consumables
      </Text>
      
      <SimpleGrid columns={3} spacing={2} w="full">
        {renderEquipmentSlot('consumable1')}
        {renderEquipmentSlot('consumable2')}
        {renderEquipmentSlot('consumable3')}
      </SimpleGrid>

      {/* Equipment bonuses summary */}
      <Box
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
            wisdom: 0,
            charisma: 0,
          }
          
          // Sum stats from all equipped items
          Object.values(hero.slots).forEach(item => {
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
  )
}

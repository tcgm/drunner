import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Icon,
  Divider,
  Grid,
  GridItem,
  Badge,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import type { Hero, Item } from '@/types'
import * as GameIcons from 'react-icons/gi'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'
import { GAME_CONFIG } from '@/config/gameConfig'
import { formatDefenseReduction } from '@/utils/defenseUtils'
import { calculateTotalStats } from '@/utils/statCalculator'
import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/core/gameStore'
import DungeonInventoryModal from '@components/dungeon/DungeonInventoryModal'
import { EquipmentSlot } from '@/components/ui/EquipmentSlot'
import { isItemCompatibleWithSlot } from '@/utils/equipmentUtils'
import { getSlotById } from '@/config/slotConfig'
import { restoreItemIcon } from '@/utils/itemUtils'

interface HeroModalProps {
  hero: Hero
  isOpen: boolean
  onClose: () => void
  isDungeon?: boolean // Flag to indicate if this is being used in dungeon context
}

export default function HeroModal({ hero, isOpen, onClose, isDungeon = false }: HeroModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  const { equipItemToHero, unequipItemFromHero, dungeon, autofillConsumables, autofillDungeonConsumables, addItemToDungeonInventory, moveItemToBank } = useGameStore()
  const [swapMode, setSwapMode] = useState<string | null>(null)
  const { isOpen: isInventoryOpen, onOpen: onInventoryOpen, onClose: onInventoryClose } = useDisclosure()

  // Use appropriate autofill function based on context
  const handleAutofill = () => {
    if (isDungeon) {
      autofillDungeonConsumables(hero.id)
    } else {
      autofillConsumables(hero.id)
    }
  }

  // Listen for clicks on inventory items when in swap mode
  const handleInventoryItemClick = useCallback((item: Item) => {
    if (swapMode !== null) {
      // Check if item is compatible with the slot
      const isCompatible = isItemCompatibleWithSlot(item, swapMode)
      
      if (isCompatible) {
        equipItemToHero(hero.id, item, swapMode)
        setSwapMode(null)
      }
    }
  }, [swapMode, equipItemToHero, hero.id])

  // Open inventory when entering swap mode
  useEffect(() => {
    if (swapMode !== null) {
      onInventoryOpen()
    } else {
      onInventoryClose()
    }
  }, [swapMode, onInventoryOpen, onInventoryClose])

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

  const handleSwap = (slotId: string) => {
    if (swapMode === null) {
      // Enter swap mode - selecting which slot to swap
      setSwapMode(slotId)
    } else {
      // Exit swap mode
      setSwapMode(null)
    }
  }

  const renderEquipmentSlot = (slotId: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const item = hero.slots[slotId]
    return (
      <Box position="relative">
        <EquipmentSlot
          slot={slotId}
          item={item ? restoreItemIcon(item) : null}
          availableItems={dungeon.inventory}
          currentEquipment={hero.slots}
          isSwapActive={swapMode === slotId}
          showSwapButton={true}
          onSwapClick={() => handleSwap(slotId)}
          size={size}
        />
        {item && (
          <Button
            position="absolute"
            top="-8px"
            right="-8px"
            size="xs"
            colorScheme="orange"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation()
              const unequippedItem = unequipItemFromHero(hero.id, slotId)
              if (unequippedItem) {
                if (isDungeon) {
                  addItemToDungeonInventory(unequippedItem)
                } else {
                  moveItemToBank(unequippedItem)
                }
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
        )}
      </Box>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        className="hero-modal" 
        bg="gray.900" 
        borderWidth="3px" 
        borderColor="orange.500" 
        w="min(90vw, 1000px)"
        h="85vh"
        maxH="85vh"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 0 20px rgba(251, 146, 60, 0.4)"
      >
        <ModalCloseButton zIndex={2} />

        <ModalBody p={0} h="100%" display="flex">
          <Grid templateColumns="1fr 1fr" gap={0} flex={1}>
            {/* LEFT PANEL - Character & Equipment */}
            <GridItem 
              bg="gray.850" 
              borderRight="2px solid" 
              borderColor="gray.700"
              p="2%"
              display="flex"
              flexDir="column"
              h="100%"
            >
              {/* Top & Middle Section - Name, Icon, Equipment */}
              <HStack spacing="8%" align="stretch" flex="1 1 0" minH={0}>
                {/* Left equipment column */}
                <VStack spacing="8%" justify="space-evenly" flex="0 0 auto" pl="5%">
                  {renderEquipmentSlot('weapon')}
                  {renderEquipmentSlot('helmet')}
                  {renderEquipmentSlot('accessory1')}
                </VStack>

                {/* Center: Name & Icon */}
                <VStack spacing="3%" flex="1 1 0" justify="center" align="center">
                  {/* Character Name & Level */}
                  <VStack spacing={0} flex="0 0 auto">
                    <Text fontSize="lg" fontWeight="bold" color="orange.400" textAlign="center" noOfLines={1}>
                      {hero.name}
                    </Text>
                    <HStack spacing={2}>
                      <Badge colorScheme="orange" fontSize="xs" px={2} py={0.5}>
                        Lv {hero.level}
                      </Badge>
                      <Text fontSize="xs" color="gray.400">
                        {hero.class.name}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Character Icon */}
                  <Box position="relative" flex="0 0 auto">
                    <Icon 
                      as={IconComponent} 
                      boxSize="min(30vh, 200px)" 
                      color="orange.400"
                      filter="drop-shadow(0 0 12px rgba(251, 146, 60, 0.6))"
                    />
                    <Box 
                      position="absolute" 
                      bottom="-8%" 
                      left="50%" 
                      transform="translateX(-50%)" 
                      w="110%"
                    >
                      <StatBar 
                        label=""
                        current={hero.stats.hp}
                        max={calculateTotalStats(hero).maxHp}
                        colorScheme="green"
                        size="md"
                        valueSize="sm"
                      />
                    </Box>
                  </Box>

                  {/* Consumable Slots */}
                  <VStack spacing={1} flex="0 0 auto" mt={2}>
                    <HStack spacing={1}>
                      {renderEquipmentSlot('consumable1', 'sm')}
                      {renderEquipmentSlot('consumable2', 'sm')}
                      {renderEquipmentSlot('consumable3', 'sm')}
                    </HStack>
                    <Button
                      size="xs"
                      colorScheme="cyan"
                      variant="ghost"
                      onClick={handleAutofill}
                      fontSize="2xs"
                    >
                      Auto-fill Consumables
                    </Button>
                  </VStack>
                </VStack>

                {/* Right equipment column */}
                <VStack spacing="8%" justify="space-evenly" flex="0 0 auto" pr="5%">
                  {renderEquipmentSlot('armor')}
                  {renderEquipmentSlot('boots')}
                  {renderEquipmentSlot('accessory2')}
                </VStack>
              </HStack>

              {/* Class Description - Bottom */}
              <Box pt="2%" borderTop="1px solid" borderColor="gray.700" flex="0 0 auto" mt="2%">
                {swapMode ? (
                  <Text fontSize="xs" color="orange.400" fontWeight="bold" textAlign="center" animation="pulse 2s infinite">
                    Open Inventory and select a {getSlotById(swapMode)?.name || 'item'} to equip →
                  </Text>
                ) : (
                  <Text fontSize="xs" color="gray.400" fontStyle="italic" textAlign="center" lineHeight="1.3" noOfLines={2}>
                    {hero.class.description}
                  </Text>
                )}
              </Box>
            </GridItem>

            {/* RIGHT PANEL - Stats & Info */}
            <GridItem bg="gray.900" p="2%" display="flex" h="100%">
              <VStack spacing="2%" align="stretch" flex={1} h="100%">
                {/* Experience Bar */}
                <Box flex="0 0 auto">
                  <Text fontSize="2xs" fontWeight="bold" mb={0.5} color="cyan.400">
                    Experience
                  </Text>
                  <StatBar 
                    label=""
                    current={hero.xp}
                    max={calculateXpForLevel(hero.level)}
                    colorScheme="cyan"
                    size="sm"
                    valueSize="xs"
                  />
                </Box>

                <Divider borderColor="gray.700" flex="0 0 auto" />

                {/* Core Stats */}
                <Box flex="0 0 auto">
                  <Text fontSize="xs" fontWeight="bold" mb={1} color="orange.400">
                    Statistics
                  </Text>
                  <Grid templateColumns="1fr 1fr" gap="2%">
                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiSwordman} color="red.400" boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Attack</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>
                            {calculateTotalStats(hero).attack}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiShield} color="blue.400" boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Defense</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>
                            {calculateTotalStats(hero).defense} <Text as="span" fontSize="2xs" color="gray.500">{formatDefenseReduction(calculateTotalStats(hero).defense)}</Text>
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiRun} color="yellow.400" boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Speed</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>
                            {calculateTotalStats(hero).speed}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiPerspectiveDiceSixFacesRandom} color="green.400" boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Luck</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>
                            {calculateTotalStats(hero).luck}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiSpellBook} color={GAME_CONFIG.colors.stats.wisdom} boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Wisdom</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.wisdom}>
                            {calculateTotalStats(hero).wisdom ?? 0}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={1.5}>
                        <Icon as={GameIcons.GiTiedScroll} color={GAME_CONFIG.colors.stats.charisma} boxSize={4} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="2xs" color="gray.500">Charisma</Text>
                          <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.charisma}>
                            {calculateTotalStats(hero).charisma ?? 0}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    {calculateTotalStats(hero).magicPower !== undefined && (
                      <GridItem colSpan={2}>
                        <HStack spacing={1.5}>
                          <Icon as={GameIcons.GiMagicSwirl} color="purple.400" boxSize={4} />
                          <VStack spacing={0} align="start" flex={1}>
                            <Text fontSize="2xs" color="gray.500">Magic Power</Text>
                            <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.magicPower}>
                              {calculateTotalStats(hero).magicPower}
                            </Text>
                          </VStack>
                        </HStack>
                      </GridItem>
                    )}
                  </Grid>
                </Box>

                <Divider borderColor="gray.700" flex="0 0 auto" />

                {/* Abilities */}
                <Box flex="1 1 0" display="flex" flexDir="column" minH={0}>
                  <Text fontSize="xs" fontWeight="bold" mb={1} color="orange.400" flex="0 0 auto">
                    Abilities
                  </Text>
                  <VStack spacing="2%" align="stretch" flex={1} overflowY="auto" minH={0}>
                    {hero.abilities.length === 0 ? (
                      <Text fontSize="2xs" color="gray.500" textAlign="center" py={1}>
                        No abilities unlocked yet
                      </Text>
                    ) : (
                      hero.abilities.map((ability, index) => (
                        <Box
                          key={index}
                          bg="gray.850"
                          p={1.5}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.700"
                          _hover={{ borderColor: 'orange.500', bg: 'gray.800' }}
                          transition="all 0.2s"
                        >
                          <HStack justify="space-between" mb={0.5}>
                            <Text fontSize="2xs" fontWeight="bold" color="orange.300" noOfLines={1}>
                              {ability.name}
                            </Text>
                            <Badge colorScheme="purple" fontSize="2xs" px={1}>
                              {ability.cooldown}
                            </Badge>
                          </HStack>
                          <Text fontSize="2xs" color="gray.400" lineHeight="1.2" noOfLines={2}>
                            {ability.description}
                          </Text>
                        </Box>
                      ))
                    )}
                  </VStack>
                </Box>
              </VStack>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>

      {/* Inventory Modal for Swapping */}
      <DungeonInventoryModal
        isOpen={isInventoryOpen}
        onClose={() => {
          onInventoryClose()
          setSwapMode(null)
        }}
        inventory={dungeon.inventory}
        gold={dungeon.gold}
        pendingSlot={swapMode}
        hero={hero}
      />
    </Modal>
  )
}

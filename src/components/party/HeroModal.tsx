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
  Tooltip,
} from '@chakra-ui/react'
import type { Hero, ItemSlot } from '@/types'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import StatBar from '@components/ui/StatBar'
import { ItemSlot as ItemSlotComponent } from '@/components/ui/ItemSlot'
import { calculateXpForLevel } from '@utils/heroUtils'
import { GAME_CONFIG } from '@/config/gameConfig'

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

interface HeroModalProps {
  hero: Hero
  isOpen: boolean
  onClose: () => void
}

export default function HeroModal({ hero, isOpen, onClose }: HeroModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

  const renderEquipmentSlot = (slot: ItemSlot) => {
    const item = hero.equipment[slot]
    const SlotIcon = SLOT_ICONS[slot]
    const isEmpty = !item

    if (isEmpty) {
      // Empty slot
      return (
        <Tooltip label={SLOT_NAMES[slot]} placement="top" hasArrow>
          <Box
            w="60px"
            h="60px"
            bg="gray.900"
            borderWidth="2px"
            borderColor="gray.700"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="default"
            _hover={{ borderColor: 'gray.600' }}
          >
            <Icon as={SlotIcon} boxSize={6} color="gray.600" />
          </Box>
        </Tooltip>
      )
    }

    // Equipped item
    return (
      <Tooltip label={SLOT_NAMES[slot]} placement="top" hasArrow>
        <Box w="60px" h="60px">
          <ItemSlotComponent item={item} isClickable={true} size="md" />
        </Box>
      </Tooltip>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent 
        className="hero-modal" 
        bg="gray.900" 
        borderWidth="3px" 
        borderColor="orange.500" 
        maxW="1200px"
        maxH="90vh"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="0 0 20px rgba(251, 146, 60, 0.4)"
      >
        <ModalCloseButton zIndex={2} />

        <ModalBody p={0}>
          <Grid templateColumns="1fr 1fr" gap={0} minH="600px">
            {/* LEFT PANEL - Character & Equipment */}
            <GridItem 
              bg="gray.850" 
              borderRight="2px solid" 
              borderColor="gray.700"
              p={6}
              display="flex"
              flexDirection="column"
              alignItems="center"
              position="relative"
            >
              {/* Character Name & Level */}
              <VStack spacing={2} mb={6} w="full">
                <Text fontSize="3xl" fontWeight="bold" color="orange.400" textAlign="center">
                  {hero.name}
                </Text>
                <HStack spacing={3}>
                  <Badge colorScheme="orange" fontSize="md" px={3} py={1}>
                    Level {hero.level}
                  </Badge>
                  <Text fontSize="md" color="gray.400">
                    {hero.class.name}
                  </Text>
                </HStack>
              </VStack>

              {/* Equipment Layout - Paper Doll Style */}
              <Box flex={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" w="full">
                {/* Helmet */}
                <Box mb={4}>
                  {renderEquipmentSlot('helmet')}
                </Box>

                {/* Main Row: Weapon - Character - Armor */}
                <HStack spacing={6} mb={4} align="center">
                  {/* Weapon (left) */}
                  {renderEquipmentSlot('weapon')}

                  {/* Character Icon (center, larger) */}
                  <Box position="relative">
                    <Icon 
                      as={IconComponent} 
                      boxSize="120px" 
                      color="orange.400"
                      filter="drop-shadow(0 0 10px rgba(251, 146, 60, 0.5))"
                    />
                    {/* HP Bar overlay */}
                    <Box 
                      position="absolute" 
                      bottom="-25px" 
                      left="50%" 
                      transform="translateX(-50%)" 
                      w="140px"
                    >
                      <StatBar 
                        label=""
                        current={hero.stats.hp}
                        max={hero.stats.maxHp}
                        colorScheme="green"
                        size="sm"
                        valueSize="xs"
                      />
                    </Box>
                  </Box>

                  {/* Armor (right) */}
                  {renderEquipmentSlot('armor')}
                </HStack>

                {/* Boots */}
                <Box mb={6} mt={4}>
                  {renderEquipmentSlot('boots')}
                </Box>

                {/* Accessories Row */}
                <HStack spacing={4}>
                  {renderEquipmentSlot('accessory1')}
                  {renderEquipmentSlot('accessory2')}
                </HStack>
              </Box>

              {/* Class Description at bottom */}
              <Box mt={6} pt={4} borderTop="1px solid" borderColor="gray.700" w="full">
                <Text fontSize="sm" color="gray.400" fontStyle="italic" textAlign="center">
                  {hero.class.description}
                </Text>
              </Box>
            </GridItem>

            {/* RIGHT PANEL - Stats & Info */}
            <GridItem bg="gray.900" p={6}>
              <VStack spacing={5} align="stretch" h="full">
                {/* Experience Bar */}
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={2} color="cyan.400">
                    Experience
                  </Text>
                  <StatBar 
                    label=""
                    current={hero.xp}
                    max={calculateXpForLevel(hero.level)}
                    colorScheme="cyan"
                    size="md"
                    valueSize="sm"
                  />
                </Box>

                <Divider borderColor="gray.700" />

                {/* Core Stats */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="orange.400">
                    Statistics
                  </Text>
                  <Grid templateColumns="1fr 1fr" gap={3}>
                    <GridItem>
                      <HStack spacing={2}>
                        <Icon as={GameIcons.GiSwordman} color="red.400" boxSize={6} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="xs" color="gray.500">
                            Attack
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color={GAME_CONFIG.colors.stats.attack}>
                            {hero.stats.attack}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={2}>
                        <Icon as={GameIcons.GiShield} color="blue.400" boxSize={6} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="xs" color="gray.500">
                            Defense
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color={GAME_CONFIG.colors.stats.defense}>
                            {hero.stats.defense}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={2}>
                        <Icon as={GameIcons.GiRun} color="yellow.400" boxSize={6} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="xs" color="gray.500">
                            Speed
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color={GAME_CONFIG.colors.stats.speed}>
                            {hero.stats.speed}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    <GridItem>
                      <HStack spacing={2}>
                        <Icon as={GameIcons.GiPerspectiveDiceSixFacesRandom} color="green.400" boxSize={6} />
                        <VStack spacing={0} align="start" flex={1}>
                          <Text fontSize="xs" color="gray.500">
                            Luck
                          </Text>
                          <Text fontSize="xl" fontWeight="bold" color={GAME_CONFIG.colors.stats.luck}>
                            {hero.stats.luck}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    {hero.stats.magicPower !== undefined && (
                      <GridItem colSpan={2}>
                        <HStack spacing={2}>
                          <Icon as={GameIcons.GiMagicSwirl} color="purple.400" boxSize={6} />
                          <VStack spacing={0} align="start" flex={1}>
                            <Text fontSize="xs" color="gray.500">
                              Magic Power
                            </Text>
                            <Text fontSize="xl" fontWeight="bold" color={GAME_CONFIG.colors.stats.magicPower}>
                              {hero.stats.magicPower}
                            </Text>
                          </VStack>
                        </HStack>
                      </GridItem>
                    )}
                  </Grid>
                </Box>

                <Divider borderColor="gray.700" />

                {/* Abilities */}
                <Box flex={1} overflowY="auto">
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="orange.400">
                    Abilities
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {hero.abilities.length === 0 ? (
                      <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                        No abilities unlocked yet
                      </Text>
                    ) : (
                      hero.abilities.map((ability, index) => (
                        <Box
                          key={index}
                          bg="gray.850"
                          p={3}
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.700"
                          _hover={{ borderColor: 'orange.500', bg: 'gray.800' }}
                          transition="all 0.2s"
                        >
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm" fontWeight="bold" color="orange.300">
                              {ability.name}
                            </Text>
                            <Badge colorScheme="purple" fontSize="xs">
                              CD: {ability.cooldown}
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color="gray.400">
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
    </Modal>
  )
}

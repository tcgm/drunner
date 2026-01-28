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
      return (
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
          title={SLOT_NAMES[slot]}
        >
          <Icon as={SlotIcon} boxSize={6} color="gray.600" />
        </Box>
      )
    }

    return (
      <Box w="60px" h="60px" title={SLOT_NAMES[slot]}>
        <ItemSlotComponent item={item} isClickable={true} size="md" />
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
                        max={hero.stats.maxHp}
                        colorScheme="green"
                        size="md"
                        valueSize="sm"
                      />
                    </Box>
                  </Box>
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
                <Text fontSize="xs" color="gray.400" fontStyle="italic" textAlign="center" lineHeight="1.3" noOfLines={2}>
                  {hero.class.description}
                </Text>
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
                            {hero.stats.attack}
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
                            {hero.stats.defense}
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
                            {hero.stats.speed}
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
                            {hero.stats.luck}
                          </Text>
                        </VStack>
                      </HStack>
                    </GridItem>

                    {hero.stats.magicPower !== undefined && (
                      <GridItem colSpan={2}>
                        <HStack spacing={1.5}>
                          <Icon as={GameIcons.GiMagicSwirl} color="purple.400" boxSize={4} />
                          <VStack spacing={0} align="start" flex={1}>
                            <Text fontSize="2xs" color="gray.500">Magic Power</Text>
                            <Text fontSize="md" fontWeight="bold" color={GAME_CONFIG.colors.stats.magicPower}>
                              {hero.stats.magicPower}
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
    </Modal>
  )
}

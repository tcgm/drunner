import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'

interface HeroModalProps {
  hero: Hero
  isOpen: boolean
  onClose: () => void
}

export default function HeroModal({ hero, isOpen, onClose }: HeroModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
      <ModalContent bg="gray.800" borderWidth="2px" borderColor="orange.500" maxW="600px">
        <ModalHeader pb={2}>
          <HStack spacing={4}>
            <Icon as={IconComponent} boxSize={12} color="orange.400" />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="2xl" fontWeight="bold" color="orange.400">
                {hero.name}
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="orange" fontSize="sm">
                  Level {hero.level}
                </Badge>
                <Text fontSize="sm" color="gray.400">
                  {hero.class.name}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Class Description */}
            <Box>
              <Text fontSize="sm" color="gray.400" fontStyle="italic">
                {hero.class.description}
              </Text>
            </Box>

            <Divider borderColor="gray.600" />

            {/* HP and XP Bars */}
            <VStack spacing={3} align="stretch">
              <StatBar 
                label="Health"
                current={hero.stats.hp}
                max={hero.stats.maxHp}
                size="md"
                valueSize="sm"
              />

              <StatBar 
                label="Experience"
                current={hero.xp}
                max={calculateXpForLevel(hero.level)}
                colorScheme="blue"
                size="md"
                valueSize="sm"
              />
            </VStack>

            <Divider borderColor="gray.600" />

            {/* Stats Grid */}
            <Box>
              <Text fontSize="md" fontWeight="bold" mb={3} color="orange.400">
                Statistics
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                <GridItem>
                  <HStack spacing={2}>
                    <Icon as={GameIcons.GiSwordman} color="red.400" boxSize={5} />
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="xs" color="gray.500">
                        Attack
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="red.300">
                        {hero.stats.attack}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>

                <GridItem>
                  <HStack spacing={2}>
                    <Icon as={GameIcons.GiShield} color="blue.400" boxSize={5} />
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="xs" color="gray.500">
                        Defense
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="blue.300">
                        {hero.stats.defense}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>

                <GridItem>
                  <HStack spacing={2}>
                    <Icon as={GameIcons.GiRun} color="green.400" boxSize={5} />
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="xs" color="gray.500">
                        Speed
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="green.300">
                        {hero.stats.speed}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>

                <GridItem>
                  <HStack spacing={2}>
                    <Icon as={GameIcons.GiClover} color="yellow.400" boxSize={5} />
                    <VStack spacing={0} align="start" flex={1}>
                      <Text fontSize="xs" color="gray.500">
                        Luck
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="yellow.300">
                        {hero.stats.luck}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>

                {hero.stats.magicPower !== undefined && (
                  <GridItem colSpan={2}>
                    <HStack spacing={2}>
                      <Icon as={GameIcons.GiMagicSwirl} color="purple.400" boxSize={5} />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontSize="xs" color="gray.500">
                          Magic Power
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="purple.300">
                          {hero.stats.magicPower}
                        </Text>
                      </VStack>
                    </HStack>
                  </GridItem>
                )}
              </Grid>
            </Box>

            <Divider borderColor="gray.600" />

            {/* Abilities */}
            <Box>
              <Text fontSize="md" fontWeight="bold" mb={3} color="orange.400">
                Abilities
              </Text>
              <VStack spacing={2} align="stretch">
                {hero.abilities.length === 0 ? (
                  <Text fontSize="sm" color="gray.500" textAlign="center" py={2}>
                    No abilities unlocked yet
                  </Text>
                ) : (
                  hero.abilities.map((ability, index) => (
                    <Box
                      key={index}
                      bg="gray.900"
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.700"
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

            <Divider borderColor="gray.600" />

            {/* Equipment (Placeholder) */}
            <Box>
              <Text fontSize="md" fontWeight="bold" mb={3} color="orange.400">
                Equipment
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                {(['weapon', 'armor', 'helmet', 'boots', 'accessory1', 'accessory2'] as const).map((slot) => (
                  <GridItem key={slot}>
                    <Box
                      bg="gray.900"
                      p={3}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.700"
                      textAlign="center"
                    >
                      <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                        {slot.replace(/\d/, ' $&')}
                      </Text>
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {hero.equipment[slot]?.name || 'Empty'}
                      </Text>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

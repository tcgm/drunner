/**
 * HeroShrineModal – view and customize all heroes in the roster.
 * Each hero card opens the full HeroModal (rename, portrait upload, equipment).
 */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Tooltip,
} from '@chakra-ui/react'
import { GiFireShrine } from 'react-icons/gi'
import { useGameStore } from '@/core/gameStore'
import { useHeroModal } from '@/contexts/HeroModalContext'
import { HeroPortrait } from '@/components/party/HeroPortrait'
import { calculateTotalStats } from '@/utils/statCalculator'
import { GAME_CONFIG } from '@/config/gameConfig'
import { HeroName } from '@/components/ui/HeroName'

interface HeroShrineModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HeroShrineModal({ isOpen, onClose }: HeroShrineModalProps) {
  const heroRoster = useGameStore(state => state.heroRoster)
  const party = useGameStore(state => state.party)
  const { openHeroModal } = useHeroModal()

  const partyIds = new Set(party.filter(Boolean).map(h => h!.id))

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent
        bg="gray.900"
        border="1px solid"
        borderColor="purple.800"
        boxShadow="0 0 40px rgba(168, 85, 247, 0.2)"
        maxH="85vh"
        mx={3}
      >
        <ModalHeader borderBottom="1px solid" borderColor="gray.700" pb={3}>
          <HStack spacing={3}>
            <Icon as={GiFireShrine} color="purple.300" boxSize={7} />
            <VStack spacing={0} align="flex-start">
              <Text color="purple.200" fontWeight="bold" fontSize="lg" lineHeight={1.2}>
                Hero Shrine
              </Text>
              <Text color="gray.400" fontSize="xs" fontWeight="normal">
                Honor your heroes — rename them, change their portrait, inspect their gear
              </Text>
            </VStack>
            <Box flex={1} />
            <HStack spacing={1} bg="blackAlpha.600" px={3} py={1} borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" color="purple.300">{heroRoster.length}</Text>
              <Text fontSize="xs" color="gray.500">heroes</Text>
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="gray.400" top={3} right={3} />

        <ModalBody py={4} px={4} overflowY="auto">
          {heroRoster.length === 0 ? (
            <VStack py={12} spacing={3} color="gray.500">
              <Icon as={GiFireShrine} boxSize={12} opacity={0.3} />
              <Text fontSize="sm">No heroes yet — recruit some from the party screen.</Text>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={3}>
              {heroRoster.map(hero => {
                const stats = calculateTotalStats(hero)
                const inParty = partyIds.has(hero.id)
                return (
                  <Tooltip
                    key={hero.id}
                    label="Click to open hero details, rename, or change portrait"
                    placement="top"
                    hasArrow
                    openDelay={500}
                  >
                    <Box
                      bg="gray.800"
                      borderRadius="xl"
                      borderWidth="2px"
                      borderColor={inParty ? 'orange.600' : 'gray.700'}
                      p={3}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: 'purple.400',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 16px rgba(168, 85, 247, 0.3)',
                      }}
                      onClick={() => openHeroModal(hero)}
                    >
                      <VStack spacing={2} align="center">
                        {/* Portrait */}
                        <Box position="relative">
                          <HeroPortrait
                            hero={hero}
                            boxSize={14}
                            color="purple.300"
                            borderRadius="lg"
                          />
                          {inParty && (
                            <Badge
                              position="absolute"
                              bottom="-6px"
                              left="50%"
                              transform="translateX(-50%)"
                              colorScheme="orange"
                              fontSize="2xs"
                              px={1.5}
                              whiteSpace="nowrap"
                            >
                              In Party
                            </Badge>
                          )}
                        </Box>

                        <VStack spacing={0.5} align="center" mt={inParty ? 2 : 0}>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            color="orange.200"
                            textAlign="center"
                            noOfLines={1}
                            w="full"
                          >
                            <HeroName hero={hero} />
                          </Text>
                          <HStack spacing={1.5} justify="center">
                            <Badge colorScheme="purple" fontSize="2xs">
                              Lv {hero.level}
                            </Badge>
                            <Text fontSize="2xs" color="gray.500" noOfLines={1}>
                              {hero.class.name}
                            </Text>
                          </HStack>
                        </VStack>

                        {/* Mini stats */}
                        <SimpleGrid columns={2} spacing={1} w="full" fontSize="2xs">
                          <HStack spacing={0.5} bg="gray.900" borderRadius="sm" px={1.5} py={1} justify="center">
                            <Text color="gray.500">HP</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.hp.base}>{stats.maxHp}</Text>
                          </HStack>
                          <HStack spacing={0.5} bg="gray.900" borderRadius="sm" px={1.5} py={1} justify="center">
                            <Text color="gray.500">ATK</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.attack.text}>{stats.attack}</Text>
                          </HStack>
                          <HStack spacing={0.5} bg="gray.900" borderRadius="sm" px={1.5} py={1} justify="center">
                            <Text color="gray.500">DEF</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.defense.text}>{stats.defense}</Text>
                          </HStack>
                          <HStack spacing={0.5} bg="gray.900" borderRadius="sm" px={1.5} py={1} justify="center">
                            <Text color="gray.500">SPD</Text>
                            <Text fontWeight="bold" color={GAME_CONFIG.colors.stats.speed.text}>{stats.speed}</Text>
                          </HStack>
                        </SimpleGrid>
                      </VStack>
                    </Box>
                  </Tooltip>
                )
              })}
            </SimpleGrid>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

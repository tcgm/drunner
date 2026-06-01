/**
 * OnlinePlayersPanel
 *
 * Shown in TownHubScreen when a multiplayer session is active.
 * Lists connected players with their hero roster previews so you can
 * see your party-mates at a glance.
 */

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  SimpleGrid,
  Divider,
  Tooltip,
  IconButton,
  Collapse,
} from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import { GiSwordsEmblem, GiCastle, GiPerson } from 'react-icons/gi'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useMultiplayerStore, useSessionStore } from '@/multiplayer'
import { PLAYER_COLORS } from '@/config/multiplayerConfig'

const LOCATION_LABELS: Record<string, string> = {
  menu: 'Main Menu',
  town: 'Town',
  'party-setup': 'Party Setup',
  dungeon: 'Dungeon',
}

export function OnlinePlayersPanel() {
  const players = useMultiplayerStore((s) => s.players)
  const role = useMultiplayerStore((s) => s.role)
  const playerProfiles = useSessionStore((s) => s.playerProfiles)
  const [isExpanded, setIsExpanded] = useState(true)

  if (!role || players.length <= 1) return null

  return (
    <Box
      bg="gray.900"
      border="2px solid"
      borderColor="blue.800"
      borderRadius="xl"
      p={4}
      w="full"
    >
      {/* Header */}
      <HStack spacing={2} mb={isExpanded ? 3 : 0}>
        <Icon
          as={GiSwordsEmblem}
          color="blue.400"
          boxSize={5}
          cursor="pointer"
          onClick={() => setIsExpanded((v) => !v)}
          _hover={{ color: 'blue.200' }}
          transition="color 0.15s"
        />
        <Text
          color="blue.300"
          fontWeight="bold"
          fontSize="sm"
          letterSpacing="wide"
          cursor="pointer"
          onClick={() => setIsExpanded((v) => !v)}
          _hover={{ color: 'blue.200' }}
          transition="color 0.15s"
        >
          {isExpanded ? 'ONLINE PLAYERS' : ''} ({players.length})
        </Text>
        <IconButton
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          icon={isExpanded ? <Icon as={FiChevronDown} /> : <Icon as={FiChevronUp} />}
          size="xs"
          variant="ghost"
          color="blue.400"
          ml="auto"
          minW={0}
          h="auto"
          _hover={{ color: 'blue.200', bg: 'transparent' }}
          onClick={() => setIsExpanded((v) => !v)}
        />
      </HStack>

      <Collapse in={isExpanded} animateOpacity>
        <VStack spacing={3} align="stretch">
          {players.map((player, idx) => {
            const colors = PLAYER_COLORS[idx] ?? PLAYER_COLORS[0]
            const profile = playerProfiles[player.id]

            return (
              <Box key={player.id}>
                {idx > 0 && <Divider borderColor="gray.800" mb={3} />}

                {/* Player header */}
                <HStack spacing={2} mb={2}>
                  <Icon as={GiPerson} color={colors.text} boxSize={4} />
                  <Text color={colors.text} fontWeight="bold" fontSize="sm">
                    {player.name}
                  </Text>
                  <Badge colorScheme={colors.badge} fontSize="2xs" ml="auto">
                    {idx === 0 ? 'Host' : 'Guest'}
                  </Badge>
                  {profile && (
                    <HStack spacing={1}>
                      <Icon as={GiCastle} color="gray.500" boxSize={3} />
                      <Text color="gray.500" fontSize="2xs">
                        {LOCATION_LABELS[profile.currentLocation] ?? profile.currentLocation}
                      </Text>
                    </HStack>
                  )}
                </HStack>

                {/* Hero roster preview */}
                {profile && profile.heroRosterPreview.length > 0 ? (
                  <SimpleGrid columns={Math.min(profile.heroRosterPreview.length, 4)} spacing={1}>
                    {profile.heroRosterPreview.map((hero) => {
                      const HeroIcon = (
                        (GameIcons as Record<string, IconType>)[hero.classIcon] ??
                        GameIcons.GiSwordman
                      ) as IconType

                      return (
                        <Tooltip
                          key={hero.id}
                          label={`${hero.name} — ${hero.className} Lv.${hero.level}`}
                          placement="top"
                          hasArrow
                        >
                          <VStack
                            spacing={0.5}
                            bg="gray.800"
                            borderRadius="md"
                            p={1.5}
                            border="1px solid"
                            borderColor="gray.700"
                            cursor="default"
                            _hover={{ borderColor: colors.border }}
                            transition="border-color 0.15s"
                          >
                            <Icon as={HeroIcon} color={colors.text} boxSize={5} />
                            <Text fontSize="2xs" color="gray.300" noOfLines={1}>
                              {hero.name}
                            </Text>
                            <Text fontSize="2xs" color="gray.500">
                              Lv.{hero.level}
                            </Text>
                          </VStack>
                        </Tooltip>
                      )
                    })}
                  </SimpleGrid>
                ) : (
                  <Text color="gray.600" fontSize="xs" fontStyle="italic">
                    {profile ? 'No heroes yet' : 'Loading profile…'}
                  </Text>
                )}

                {/* Gold summary */}
                {profile && (
                  <HStack spacing={1} mt={1.5}>
                    <Icon as={GameIcons.GiCoins} color="yellow.400" boxSize={3} />
                    <Text color="yellow.400" fontSize="2xs">
                      {profile.bankGold.toLocaleString()} gold
                    </Text>
                  </HStack>
                )}
              </Box>
            )
          })}
        </VStack>
      </Collapse>
    </Box>
  )
}

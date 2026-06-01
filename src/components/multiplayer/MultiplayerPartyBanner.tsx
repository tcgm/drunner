/**
 * MultiplayerPartyBanner
 *
 * Shown above the party slots in DungeonPrepScreen when a multiplayer session
 * is active. Displays slot ownership strips so each player can see at a glance
 * which slots are theirs to fill.
 */

import { Box, HStack, VStack, Text, Badge, Icon, Tooltip } from '@chakra-ui/react'
import { GiPerson } from 'react-icons/gi'
import { useMultiplayerStore, useSessionStore } from '@/multiplayer'
import { PLAYER_COLORS, calculateSlotOwnership, MULTIPLAYER_CONFIG } from '@/config/multiplayerConfig'

interface MultiplayerPartyBannerProps {
  /** The local socket id – used to highlight "your" slots. */
  localPlayerId: string
}

export function MultiplayerPartyBanner({ localPlayerId }: MultiplayerPartyBannerProps) {
  const players        = useMultiplayerStore((s) => s.players)
  const slotAssignments = useSessionStore((s) => s.slotAssignments)
  const ownership       = calculateSlotOwnership(players.length, MULTIPLAYER_CONFIG.maxPartySize)

  return (
    <Box
      w="full"
      bg="gray.900"
      border="1px solid"
      borderColor="blue.800"
      borderRadius="lg"
      p={3}
      mb={2}
      flexShrink={0}
    >
      {/* Header */}
      <HStack spacing={2} mb={2}>
        <Box as="span" color="blue.400" fontSize="1rem" lineHeight={1} display="flex" alignItems="center">
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <path d="M6.5 2L2 6.5l2.5 2.5-4 4L2 15l4-4 2.5 2.5L13 9zm11 0l4.5 4.5-2.5 2.5 4 4L22 15l-4-4-2.5 2.5L11 9z" />
          </svg>
        </Box>
        <Text color="blue.300" fontSize="xs" fontWeight="bold" letterSpacing="wide">
          MULTIPLAYER PARTY — {players.length} PLAYER{players.length !== 1 ? 'S' : ''}
        </Text>
      </HStack>

      {/* Slot ownership strips */}
      <HStack spacing={2} w="full">
        {ownership.map((playerIdx, slotIdx) => {
          const player     = players[playerIdx]
          const colors     = PLAYER_COLORS[playerIdx] ?? PLAYER_COLORS[0]
          const isMe       = player?.id === localPlayerId
          const assignment = slotAssignments[slotIdx]

          return (
            <Tooltip
              key={slotIdx}
              label={
                assignment
                  ? `${assignment.playerName}: ${assignment.heroSnapshot.name}`
                  : `${player?.name ?? `Player ${playerIdx + 1}`}: Empty`
              }
              placement="top"
              hasArrow
            >
              <VStack
                flex={1}
                spacing={0.1}
                bg={isMe ? colors.bg : 'gray.800'}
                border="2px solid"
                borderColor={isMe ? colors.border : 'gray.700'}
                borderRadius="md"
                p={2}
                cursor="default"
                opacity={player ? 1 : 0.4}
              >
                <HStack spacing={1} w="full" justify="center">
                  <Icon
                    as={GiPerson}
                    color={isMe ? colors.text : 'gray.500'}
                    boxSize={3}
                  />
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color={isMe ? colors.text : 'gray.500'}
                    noOfLines={1}
                    textAlign="center"
                  >
                    {player?.name ?? '—'}
                  </Text>
                </HStack>

                <Badge colorScheme={isMe ? colors.badge : 'gray'} fontSize="2xs">
                  Slot {slotIdx + 1}
                </Badge>

                {assignment ? (
                  <Text fontSize="2xs" color="gray.300" noOfLines={1} textAlign="center">
                    {assignment.heroSnapshot.name}
                  </Text>
                ) : (
                  <Text fontSize="2xs" color="gray.600" textAlign="center">
                    {isMe ? 'Pick hero ↓' : 'Waiting…'}
                  </Text>
                )}
              </VStack>
            </Tooltip>
          )
        })}
      </HStack>
    </Box>
  )
}

/**
 * LootDraftModal
 *
 * Shown at the end of a multiplayer run. Each player picks items from the pool
 * in turn-order. Gold is already split automatically by the host.
 *
 * Props:
 *  - draftState  : current DraftState from sessionStore
 *  - myPlayerId  : local socket id
 *  - players     : ordered player list from multiplayerStore (for name lookup)
 *  - role        : 'host' | 'guest' | null
 *  - onPick      : called with itemIndex when the local player picks an item
 */
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  SimpleGrid, Box, Text, VStack, HStack, Badge, Button,
} from '@chakra-ui/react'
import type { DraftState } from '@/multiplayer/types'
import type { MultiplayerPlayer } from '@/multiplayer/types'
import { RARITY_COLORS } from '@/systems/rarity/raritySystem'
import type { Item } from '@/types'

interface LootDraftModalProps {
  draftState: DraftState
  myPlayerId: string
  players: MultiplayerPlayer[]
  role: 'host' | 'guest' | null
  onPick: (itemIndex: number) => void
}

function getPlayerName(playerId: string, players: MultiplayerPlayer[]): string {
  const p = players.find((pl) => pl.id === playerId)
  return p?.name ?? playerId.slice(0, 6)
}

function ItemCard({ item, index, isMyTurn, onPick }: { item: Item; index: number; isMyTurn: boolean; onPick: (i: number) => void }) {
  const colors = RARITY_COLORS[item.rarity] ?? RARITY_COLORS['common']
  return (
    <Box
      borderWidth="1px"
      borderColor={colors.border}
      borderRadius="md"
      p={2}
      bg={colors.bg}
      boxShadow={isMyTurn ? `0 0 8px ${colors.glow}` : undefined}
      transition="box-shadow 0.2s"
    >
      <VStack spacing={1} align="start">
        <Text fontWeight="bold" fontSize="xs" color={colors.text} noOfLines={1}>
          {item.name}
        </Text>
        <Badge fontSize="2xs" colorScheme="gray" textTransform="capitalize">
          {item.rarity}
        </Badge>
        <Text fontSize="2xs" color="gray.400" noOfLines={2}>{item.description}</Text>
        {isMyTurn && (
          <Button
            size="xs"
            colorScheme="orange"
            w="full"
            mt={1}
            onClick={() => onPick(index)}
          >
            Pick
          </Button>
        )}
      </VStack>
    </Box>
  )
}

export default function LootDraftModal({ draftState, myPlayerId, players, onPick }: LootDraftModalProps) {
  const { pool, order, currentPickerIndex } = draftState
  const currentPickerId = order[currentPickerIndex % order.length]
  const isMyTurn = currentPickerId === myPlayerId

  return (
    <Modal isOpen={true} onClose={() => {}} closeOnOverlayClick={false} size="2xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent bg="gray.800">
        <ModalHeader color="orange.400">
          <VStack align="start" spacing={0}>
            <Text>Loot Draft</Text>
            <HStack spacing={1}>
              <Text fontSize="sm" fontWeight="normal" color="gray.300">
                {isMyTurn ? "Your turn to pick!" : `${getPlayerName(currentPickerId, players)}'s turn`}
              </Text>
              {isMyTurn && (
                <Badge colorScheme="green" fontSize="xs">Your pick</Badge>
              )}
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalBody pb={6}>
          {pool.length === 0 ? (
            <Text color="gray.400" textAlign="center" py={8}>
              No items to draft. Waiting for draft to complete…
            </Text>
          ) : (
            <>
              {/* Turn order display */}
              <HStack spacing={2} mb={4} flexWrap="wrap">
                {order.map((pid, i) => {
                  const isPast = i < currentPickerIndex % order.length ||
                    (currentPickerIndex >= order.length && i < currentPickerIndex % order.length)
                  const isCurrent = pid === currentPickerId
                  return (
                    <Badge
                      key={pid}
                      colorScheme={isCurrent ? 'orange' : 'gray'}
                      variant={isCurrent ? 'solid' : 'outline'}
                      opacity={isPast ? 0.4 : 1}
                      fontSize="xs"
                    >
                      {i + 1}. {getPlayerName(pid, players)}
                    </Badge>
                  )
                })}
              </HStack>

              {/* Item grid */}
              <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={2}>
                {pool.map((item, i) => (
                  <ItemCard
                    key={`${item.id}-${i}`}
                    item={item}
                    index={i}
                    isMyTurn={isMyTurn}
                    onPick={onPick}
                  />
                ))}
              </SimpleGrid>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

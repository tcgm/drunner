/**
 * MultiplayerModal
 *
 * Self-contained multiplayer lobby modal. Can be opened from any screen
 * via the global MultiplayerButton or from MainMenuScreen directly.
 *
 * On every open it re-broadcasts the local player profile so the panel
 * on other clients is always fresh.
 */

import { useState, useEffect } from 'react'
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  VStack, HStack, Box, Text, Badge, Button, IconButton, Icon,
  Input, FormControl, FormLabel, Alert, AlertIcon, Spinner,
} from '@chakra-ui/react'
import { GiSwordsEmblem } from 'react-icons/gi'
import { FaCopy, FaCheck } from 'react-icons/fa'
import { useMultiplayerStore } from '@/multiplayer/multiplayerStore'
import { useSessionStore } from '@/multiplayer/sessionStore'
import { getSocket } from '@/multiplayer/socket'
import type { PlayerProfile } from '@/multiplayer/types'
import { useGameStore } from '@/core/gameStore'

interface MultiplayerModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after a guest successfully joins a room */
  onJoined?: () => void
}

export function MultiplayerModal({ isOpen, onClose, onJoined }: MultiplayerModalProps) {
  const mp = useMultiplayerStore()
  const party    = useGameStore((s) => s.party)
  const bankGold = useGameStore((s) => s.bankGold)

  const [mpTab, setMpTab]         = useState<'host' | 'join'>('host')
  const [joinCode, setJoinCode]   = useState('')
  const [mpLoading, setMpLoading] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [hostMode, setHostMode]   = useState<'relay' | 'direct'>('relay')
  const [directCode, setDirectCode] = useState<string | null>(null)

  // Re-broadcast profile every time the modal opens so other players see fresh data
  useEffect(() => {
    if (!isOpen) return
    if (!mp.role || !mp.roomCode) return
    const socket = getSocket()
    if (!socket.connected || !socket.id) return

    const profile: PlayerProfile = {
      playerId:          socket.id,
      playerName:        mp.localPlayerName,
      heroRosterPreview: party
        .filter((h): h is import('@/types').Hero => h !== null)
        .map((h) => ({
        id:        h.id,
        name:      h.name,
        className: h.class.name,
        classIcon: h.class.icon,
        level:     h.level,
      })),
      bankGold,
      currentLocation: useSessionStore.getState().playerProfiles[socket.id]?.currentLocation ?? 'town',
    }
    socket.emit('broadcast-profile', { code: mp.roomCode, profile })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleHostGame = async () => {
    setMpLoading(true)
    mp.clearError()
    try {
      if (hostMode === 'direct') {
        const code7 = await mp.createRoomDirect()
        setDirectCode(code7)
      } else {
        await mp.createRoom()
      }
    } catch {
      // error set in store
    } finally {
      setMpLoading(false)
    }
  }

  const handleJoinGame = async () => {
    if (!joinCode.trim()) return
    setMpLoading(true)
    mp.clearError()
    try {
      await mp.joinRoom(joinCode)
      // Ask existing players to re-send their profiles so we see them immediately
      const socket = getSocket()
      if (socket.connected && mp.roomCode) {
        socket.emit('request-profiles', { code: mp.roomCode })
      }
      onClose()
      onJoined?.()
    } catch {
      // error set in store
    } finally {
      setMpLoading(false)
    }
  }

  const handleCopyCode = () => {
    const code = directCode ?? mp.roomCode
    if (!code) return
    navigator.clipboard.writeText(code)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleLeaveRoom = () => {
    mp.leaveRoom()
    setJoinCode('')
    setDirectCode(null)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
      <ModalContent bg="gray.800" borderWidth="1px" borderColor="purple.700">
        <ModalHeader color="purple.300">
          <HStack>
            <Icon as={GiSwordsEmblem} />
            <Text>Multiplayer</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {mp.error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {mp.error}
            </Alert>
          )}

          {/* ── Not in a room yet ── */}
          {!mp.role && (
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel color="gray.300" fontSize="sm">Your name</FormLabel>
                <Input
                  value={mp.localPlayerName}
                  onChange={(e) => mp.setLocalPlayerName(e.target.value)}
                  placeholder="Player"
                  bg="gray.700"
                  borderColor="gray.600"
                  maxLength={20}
                />
              </FormControl>

              <HStack spacing={2}>
                <Button flex={1} variant={mpTab === 'host' ? 'solid' : 'outline'} colorScheme="purple" onClick={() => setMpTab('host')} size="sm">
                  Host Game
                </Button>
                <Button flex={1} variant={mpTab === 'join' ? 'solid' : 'outline'} colorScheme="purple" onClick={() => setMpTab('join')} size="sm">
                  Join Game
                </Button>
              </HStack>

              {mpTab === 'host' ? (
                <VStack spacing={3} align="stretch">
                  <Text fontSize="sm" color="gray.400">
                    Create a room and share the code with your friends. Then start a run as normal — they'll see everything you do.
                  </Text>
                  <HStack spacing={2}>
                    <Button flex={1} size="xs" variant={hostMode === 'relay' ? 'solid' : 'outline'} colorScheme="gray" onClick={() => setHostMode('relay')}>
                      Relay server
                    </Button>
                    <Button flex={1} size="xs" variant={hostMode === 'direct' ? 'solid' : 'outline'} colorScheme="gray" onClick={() => setHostMode('direct')}>
                      Direct / LAN
                    </Button>
                  </HStack>
                  {hostMode === 'direct' && (
                    <Text fontSize="xs" color="yellow.400">
                      Run the server locally first. Guests on your LAN (or via port-forward) connect using a 7-character code.
                    </Text>
                  )}
                  <Button colorScheme="purple" isLoading={mpLoading} onClick={handleHostGame} leftIcon={<Icon as={GiSwordsEmblem} />}>
                    Create Room
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={3} align="stretch">
                  <Text fontSize="sm" color="gray.400">
                    Enter the code your host shared. 4 characters for relay, 7 for direct/LAN.
                  </Text>
                  <FormControl>
                    <FormLabel color="gray.300" fontSize="sm">Join code</FormLabel>
                    <HStack spacing={2}>
                      <Input
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="ABCD or 7-CHAR"
                        bg="gray.700"
                        borderColor="gray.600"
                        maxLength={7}
                        letterSpacing="widest"
                        fontFamily="mono"
                        fontSize="xl"
                        textAlign="center"
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinGame()}
                      />
                      <IconButton
                        aria-label="Paste code"
                        icon={<Icon as={FaCopy} />}
                        size="md"
                        variant="outline"
                        colorScheme="gray"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText()
                            setJoinCode(text.toUpperCase().trim().slice(0, 7))
                          } catch { /* clipboard denied */ }
                        }}
                      />
                    </HStack>
                  </FormControl>
                  <Button
                    colorScheme="purple"
                    isLoading={mpLoading}
                    isDisabled={joinCode.length !== 4 && joinCode.length !== 7}
                    onClick={handleJoinGame}
                  >
                    Join Room
                  </Button>
                </VStack>
              )}
            </VStack>
          )}

          {/* ── In a room ── */}
          {mp.role && (
            <VStack spacing={4} align="stretch">
              {mp.role === 'host' && (
                <Box bg="purple.900" p={4} borderRadius="md" textAlign="center">
                  <Text fontSize="sm" color="gray.400" mb={1}>Share this code with friends</Text>
                  <HStack justify="center" spacing={3}>
                    <Text fontSize="4xl" fontFamily="mono" fontWeight="bold" color="purple.200" letterSpacing="widest">
                      {directCode ?? mp.roomCode}
                    </Text>
                    <IconButton
                      aria-label="Copy code"
                      icon={codeCopied ? <Icon as={FaCheck} color="green.300" /> : <Icon as={FaCopy} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                      onClick={handleCopyCode}
                    />
                  </HStack>
                </Box>
              )}
              {mp.role === 'guest' && (
                <Box bg="purple.900" p={3} borderRadius="md" textAlign="center">
                  <Text fontSize="sm" color="gray.400" mb={1}>Connected to room</Text>
                  <HStack justify="center" spacing={2}>
                    <Text fontSize="2xl" fontFamily="mono" fontWeight="bold" color="purple.200" letterSpacing="widest">
                      {mp.roomCode}
                    </Text>
                    <IconButton
                      aria-label="Copy room code"
                      icon={codeCopied ? <Icon as={FaCheck} color="green.300" /> : <Icon as={FaCopy} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                      onClick={() => {
                        navigator.clipboard.writeText(mp.roomCode ?? '')
                        setCodeCopied(true)
                        setTimeout(() => setCodeCopied(false), 2000)
                      }}
                    />
                  </HStack>
                </Box>
              )}

              <Box>
                <Text fontSize="sm" fontWeight="bold" color="gray.300" mb={2}>
                  Players ({mp.players.length})
                </Text>
                <VStack spacing={1} align="stretch">
                  {mp.players.map((p) => (
                    <HStack key={p.id} bg="gray.700" p={2} borderRadius="md" justify="space-between">
                      <Text color="gray.200" fontSize="sm">{p.name}</Text>
                      {p.id === mp.players[0]?.id && (
                        <Badge colorScheme="purple" fontSize="xs">Host</Badge>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {mp.role === 'host' && (
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  Close this window and start a run — guests will sync automatically.
                </Text>
              )}
              {mp.role === 'guest' && (
                <Box bg="blue.900" p={3} borderRadius="md">
                  <HStack>
                    <Spinner size="sm" color="blue.300" />
                    <Text fontSize="sm" color="blue.200">Waiting for host to start a run…</Text>
                  </HStack>
                </Box>
              )}

              <Button colorScheme="red" variant="outline" size="sm" onClick={handleLeaveRoom}>
                Leave Room
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

/**
 * Zustand store for multiplayer lobby state.
 *
 * Completely independent of the main gameStore so that multiplayer state
 * (room code, role, player list) survives screen transitions without being
 * persisted to IndexedDB alongside the save data.
 */

import { create } from 'zustand'
import { connectSocket, disconnectSocket, getSocket } from './socket'
import { startMultiplayerService, stopMultiplayerService } from './multiplayerService'
import type { MultiplayerPlayer } from './types'
import type { DungeonEvent } from '@/types'
import { isDirectCode, decodeCodeToIp, encodeIpToCode, MULTIPLAYER_CONFIG } from '@/config/multiplayerConfig'
import { usePlayerProfileStore } from '@/core/playerProfileStore'

export type MultiplayerRole = 'host' | 'guest' | null

interface MultiplayerState {
  role: MultiplayerRole
  roomCode: string | null
  connectionMode: 'relay' | 'direct' | null
  players: MultiplayerPlayer[]
  isConnected: boolean
  error: string | null
  localPlayerName: string
  // Boss combat state — lives here so socket handlers read it via getState() with no stale closures
  inBossCombat: boolean
  bossEvent: DungeonEvent | null

  setLocalPlayerName: (name: string) => void
  createRoom: () => Promise<string>
  createRoomDirect: () => Promise<string>
  joinRoom: (code: string) => Promise<void>
  leaveRoom: () => void
  clearError: () => void
  setBossCombat: (event: DungeonEvent) => void
  clearBossCombat: () => void
}

export const useMultiplayerStore = create<MultiplayerState>((set, get) => ({
  role: null,
  roomCode: null,
  connectionMode: null,
  players: [],
  isConnected: false,
  error: null,
  localPlayerName: 'Player',
  inBossCombat: false,
  bossEvent: null,

  setLocalPlayerName: (name) => {
    set({ localPlayerName: name })
    // Persist to player profile so it survives page reloads
    usePlayerProfileStore.getState().setDisplayName(name)
  },

  // ── Host: create a room and return the 4-char code ──────────────────────
  createRoom: () =>
    new Promise((resolve, reject) => {
      connectSocket()
      const socket = getSocket()

      const doCreate = () => {
        set({ isConnected: true })
        socket.emit(
          'create-room',
          { playerName: get().localPlayerName },
          (res: { code?: string; error?: string }) => {
            if (res.error) return reject(new Error(res.error))

            const code = res.code!

            set({
              role: 'host',
              roomCode: code,
              connectionMode: 'relay',
              players: [{ id: socket.id!, name: get().localPlayerName }],
              error: null,
            })

            socket.on('player-joined', ({ player }: { player: MultiplayerPlayer }) => {
              set((s) => ({ players: [...s.players, player] }))
            })

            socket.on('player-left', ({ playerId }: { playerId: string }) => {
              set((s) => ({ players: s.players.filter((p) => p.id !== playerId) }))
            })

            startMultiplayerService('host', code)
            resolve(code)
          },
        )
      }

      if (socket.connected) {
        doCreate()
      } else {
        socket.once('connect', doCreate)
      }
    }),

  // ── Host: create a room on a local server (direct/LAN mode) ──────────────
  createRoomDirect: () =>
    new Promise<string>((resolve, reject) => {
      ;(async () => {
        const port = MULTIPLAYER_CONFIG.defaultPort
        const localUrl = `http://localhost:${port}`

        let ip: string
        try {
          const res = await fetch(`${localUrl}/info`)
          const data = (await res.json()) as { ip: string }
          ip = data.ip
        } catch {
          reject(new Error('Could not reach local server. Run "npm run server" first.'))
          return
        }

        const code7 = encodeIpToCode(ip)
        connectSocket(localUrl)
        const socket = getSocket()

        const doCreate = () => {
          set({ isConnected: true })
          socket.emit(
            'create-room',
            { playerName: get().localPlayerName },
            (res: { code?: string; error?: string }) => {
              if (res.error) return reject(new Error(res.error))
              set({
                role: 'host',
                roomCode: res.code!,
                connectionMode: 'direct',
                players: [{ id: socket.id!, name: get().localPlayerName }],
                error: null,
              })
              socket.on('player-joined', ({ player }: { player: MultiplayerPlayer }) => {
                set((s) => ({ players: [...s.players, player] }))
              })
              socket.on('player-left', ({ playerId }: { playerId: string }) => {
                set((s) => ({ players: s.players.filter((p) => p.id !== playerId) }))
              })
              startMultiplayerService('host', res.code!)
              resolve(code7)
            },
          )
        }

        if (socket.connected) {
          doCreate()
        } else {
          socket.once('connect', doCreate)
        }
      })().catch(reject)
    }),

  // ── Guest: join an existing room by code ─────────────────────────────────
  // Accepts either a 4-char relay code or a 7-char direct/LAN code.
  // The mode is detected silently — guests never need to know which they're using.
  joinRoom: (code: string) =>
    new Promise<void>((resolve, reject) => {
      ;(async () => {
        const trimmed = code.toUpperCase().trim()
        let roomCode = trimmed
        let serverUrl: string | undefined

        if (isDirectCode(trimmed)) {
          const ip = decodeCodeToIp(trimmed)
          serverUrl = `http://${ip}:${MULTIPLAYER_CONFIG.defaultPort}`
          try {
            const res = await fetch(`${serverUrl}/room`)
            const data = (await res.json()) as { code: string | null }
            if (!data.code) {
              reject(new Error('No active room on that server. Ask the host to create a room first.'))
              return
            }
            roomCode = data.code
          } catch {
            reject(new Error('Could not reach host. Check the code and ensure the server is running.'))
            return
          }
        }

        connectSocket(serverUrl)
        const socket = getSocket()

        const doJoin = () => {
          set({ isConnected: true })
          socket.emit(
            'join-room',
            { code: roomCode, playerName: get().localPlayerName },
            (res: {
              error?: string
              success?: boolean
              hostId?: string
              players?: MultiplayerPlayer[]
            }) => {
              if (res.error) return reject(new Error(res.error))

              set({
                role: 'guest',
                roomCode,
                connectionMode: serverUrl ? 'direct' : 'relay',
                players: res.players ?? [],
                error: null,
              })

              socket.on('player-joined', ({ player }: { player: MultiplayerPlayer }) => {
                set((s) => ({ players: [...s.players, player] }))
              })

              socket.on('player-left', ({ playerId }: { playerId: string }) => {
                set((s) => ({ players: s.players.filter((p) => p.id !== playerId) }))
              })

              socket.on('host-left', () => {
                get().leaveRoom()
                set({ error: 'The host disconnected.' })
              })

              startMultiplayerService('guest', roomCode)
              resolve()
            },
          )
        }

        if (socket.connected) {
          doJoin()
        } else {
          socket.once('connect', doJoin)
        }
      })().catch(reject)
    }),

  // ── Leave / clean up ─────────────────────────────────────────────────────
  leaveRoom: () => {
    stopMultiplayerService()
    disconnectSocket()
    set({
      role: null,
      roomCode: null,
      connectionMode: null,
      players: [],
      isConnected: false,
      error: null,
      inBossCombat: false,
      bossEvent: null,
    })
  },

  clearError: () => set({ error: null }),
  setBossCombat: (event) => set({ inBossCombat: true, bossEvent: event }),
  clearBossCombat: () => set({ inBossCombat: false, bossEvent: null }),
}))

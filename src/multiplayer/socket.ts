/**
 * Socket.io client singleton.
 *
 * Lazily created the first time getSocket() is called.
 * connectSocket(url?) opens the connection — pass a URL for direct/LAN mode,
 * omit to use the default relay URL (VITE_MULTIPLAYER_URL env var).
 * disconnectSocket() tears it down (e.g. on Leave Room).
 */

import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

let _socket: Socket | null = null
let _socketUrl: string | null = null

const DEFAULT_URL = () =>
  (import.meta.env.VITE_MULTIPLAYER_URL as string | undefined) ?? 'http://localhost:3001'

/**
 * Returns the shared socket instance, creating it if necessary.
 * The socket is NOT automatically connected – call connectSocket() first.
 */
export function getSocket(): Socket {
  if (!_socket) {
    const url = _socketUrl ?? DEFAULT_URL()
    _socket = io(url, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return _socket
}

/**
 * Ensure the socket is created and connected.
 * Pass a URL to connect to a specific server (direct/LAN mode);
 * omit to use the default relay URL from VITE_MULTIPLAYER_URL.
 */
export function connectSocket(url?: string): void {
  const resolvedUrl = url ?? DEFAULT_URL()

  // If the target URL changed, tear down the old socket
  if (_socket && _socketUrl !== resolvedUrl) {
    _socket.disconnect()
    _socket = null
  }

  _socketUrl = resolvedUrl

  if (!_socket) {
    _socket = io(resolvedUrl, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }

  if (!_socket.connected) _socket.connect()
}

export function disconnectSocket(): void {
  _socket?.disconnect()
  _socket = null
  _socketUrl = null
}

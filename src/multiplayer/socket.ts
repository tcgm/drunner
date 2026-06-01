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

const DEFAULT_URL = (): string => {
  const configured =
    (import.meta.env.VITE_MULTIPLAYER_URL as string | undefined) || 'http://localhost:3001'
  // When a guest opens the app from another machine (e.g. http://192.168.1.x:5173),
  // "localhost" in the baked-in URL resolves to *their* machine, not the server.
  // Substitute the actual page hostname so the relay is always reachable.
  try {
    const u = new URL(configured)
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
      u.hostname = window.location.hostname
      return u.toString()
    }
  } catch {
    // malformed env var — fall through and return as-is
  }
  return configured
}

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

/**
 * Multiplayer configuration
 * Adjust these values to change party size, player limits, and slot distribution.
 */

export const MULTIPLAYER_CONFIG = {
  /** Maximum players allowed per room */
  maxPlayers: 4,

  /** Total party slots shared across all players */
  maxPartySize: 4,

  /** Default relay server port */
  defaultPort: 3001,

  /** Room code length (characters) */
  roomCodeLength: 4,
} as const

/**
 * Calculate which player index (0 = host, 1 = first guest, …) owns each party slot.
 *
 * Distribution rules:
 *   heroesPerPlayer = floor(maxPartySize / playerCount)
 *   Remainder slots go to the host (player 0).
 *
 * Examples (maxPartySize = 4):
 *   1 player  → [0, 0, 0, 0]          (host: 4 slots)
 *   2 players → [0, 0, 1, 1]          (2 each)
 *   3 players → [0, 0, 1, 2]          (host: 2, guests: 1 each)
 *   4 players → [0, 1, 2, 3]          (1 each)
 */
export function calculateSlotOwnership(
  playerCount: number,
  maxPartySize: number = MULTIPLAYER_CONFIG.maxPartySize,
): number[] {
  if (playerCount <= 0) return []
  const perPlayer = Math.floor(maxPartySize / playerCount)
  const remainder = maxPartySize % playerCount // extra slots go to host
  const ownership: number[] = []
  for (let pi = 0; pi < playerCount; pi++) {
    const count = perPlayer + (pi === 0 ? remainder : 0)
    for (let s = 0; s < count; s++) {
      ownership.push(pi)
    }
  }
  return ownership
}

/** Return the slot indices owned by a specific player (0-indexed in the player order array). */
export function getSlotsForPlayerIndex(playerIdx: number, ownership: number[]): number[] {
  return ownership.reduce<number[]>((acc, owner, slot) => {
    if (owner === playerIdx) acc.push(slot)
    return acc
  }, [])
}

/**
 * Encode an IPv4 address into a 7-character base-36 join code for direct/LAN mode.
 * Guests paste this code and the client silently decodes the host IP.
 */
export function encodeIpToCode(ip: string): string {
  const parts = ip.split('.').map(Number)
  const num = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
  return num.toString(36).toUpperCase().padStart(7, '0')
}

/** Decode a 7-character base-36 join code back to an IPv4 address. */
export function decodeCodeToIp(code: string): string {
  const num = parseInt(code, 36)
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ].join('.')
}

/**
 * Returns true if code is a 7-char direct-IP code (base36 IPv4).
 * 4-char codes are relay room codes; 7-char codes encode the host IP.
 */
export function isDirectCode(code: string): boolean {
  return code.length === 7
}

/** Per-player UI colour tokens for slot ownership indicators. */
export const PLAYER_COLORS = [
  { border: 'orange.500', bg: 'orange.900', badge: 'orange' as const, text: 'orange.300', label: 'Host' },
  { border: 'blue.500',   bg: 'blue.900',   badge: 'blue'   as const, text: 'blue.300',   label: 'Player 2' },
  { border: 'green.500',  bg: 'green.900',  badge: 'green'  as const, text: 'green.300',  label: 'Player 3' },
  { border: 'purple.500', bg: 'purple.900', badge: 'purple' as const, text: 'purple.300', label: 'Player 4' },
] as const

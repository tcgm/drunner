/**
 * voteManager – module-level vote accumulator for the host.
 *
 * Only the HOST calls recordVote(). Guests emit 'cast-vote' socket events
 * which the host receives and routes here via useSyncGameState.
 *
 * When all players have voted the majority-winner choiceIndex is determined
 * and passed to the registered completion callback (set by DungeonScreen).
 * Ties are broken by preferring the lower choiceIndex.
 */

import { useSessionStore } from './sessionStore'
import { getSocket } from './socket'

// ── Module-level state (singleton per page) ──────────────────────────────────

let _votes: Record<string, number> = {}
let _totalPlayers = 0
let _roomCode: string | null = null
let _onComplete: ((choiceIndex: number) => void) | null = null

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Register a callback that fires with the winning choiceIndex once all votes
 * are in.  The host's DungeonScreen sets this so it can handle boss-combat
 * branching the same way a normal selectChoice does.
 */
export function setVoteCompleteCallback(cb: ((choiceIndex: number) => void) | null) {
  _onComplete = cb
}

/**
 * (Re)initialise for a new event or player count change.
 * Always call this when a new currentEvent arrives on the host.
 */
export function initVotes(totalPlayers: number, roomCode: string) {
  _votes = {}
  _totalPlayers = totalPlayers
  _roomCode = roomCode
  useSessionStore.getState().setVoteState(null)
}

/**
 * Record a vote from any player (host or guest).
 * Broadcasts the updated tally to guests and applies the result when everyone
 * has voted.
 */
export function recordVote(playerId: string, choiceIndex: number) {
  _votes = { ..._votes, [playerId]: choiceIndex }

  const voteState = { votes: _votes, totalPlayers: _totalPlayers }

  // Update host-local session store (drives tally UI on the host)
  useSessionStore.getState().setVoteState(voteState)

  // Broadcast tally to guests
  const socket = getSocket()
  if (_roomCode) {
    socket.emit('vote-update', { code: _roomCode, votes: _votes, totalPlayers: _totalPlayers })
  }

  // Apply when all players have voted
  if (_totalPlayers > 0 && Object.keys(_votes).length >= _totalPlayers) {
    _applyMajority()
  }
}

/** Reset accumulated votes without firing the callback (e.g. event cleared). */
export function clearVotes() {
  _votes = {}
  useSessionStore.getState().setVoteState(null)
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function _getMajority(votes: Record<string, number>): number {
  const counts: Record<number, number> = {}
  for (const idx of Object.values(votes)) {
    counts[idx] = (counts[idx] ?? 0) + 1
  }
  let best = -1
  let bestCount = -1
  for (const [idxStr, count] of Object.entries(counts)) {
    const idx = Number(idxStr)
    if (count > bestCount || (count === bestCount && idx < best)) {
      best = idx
      bestCount = count
    }
  }
  return best
}

function _applyMajority() {
  const winner = _getMajority(_votes)
  _votes = {}
  useSessionStore.getState().setVoteState(null)

  if (winner >= 0 && _onComplete) {
    _onComplete(winner)
  }
}

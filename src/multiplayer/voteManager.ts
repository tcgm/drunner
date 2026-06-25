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
  let maxCount = 0
  for (const count of Object.values(counts)) {
    if (count > maxCount) maxCount = count
  }
  const tied = Object.entries(counts)
    .filter(([, c]) => c === maxCount)
    .map(([idx]) => Number(idx))
  return tied[Math.floor(Math.random() * tied.length)]
}

function _applyMajority() {
  const winner = _getMajority(_votes)
  _votes = {}
  useSessionStore.getState().setVoteState(null)

  if (winner >= 0 && _onComplete) {
    _onComplete(winner)
  }
}

// ── Map-node vote (separate accumulator, votes are nodeId strings) ─────────────

let _nodeVotes: Record<string, string> = {}
let _nodeTotalPlayers = 0
let _nodeRoomCode: string | null = null
let _onNodeComplete: ((nodeId: string) => void) | null = null

export function setNodeVoteCompleteCallback(cb: ((nodeId: string) => void) | null) {
  _onNodeComplete = cb
}

export function initNodeVotes(totalPlayers: number, roomCode: string) {
  _nodeVotes = {}
  _nodeTotalPlayers = totalPlayers
  _nodeRoomCode = roomCode
  useSessionStore.getState().setNodeVoteState(null)
}

export function recordNodeVote(playerId: string, nodeId: string) {
  _nodeVotes = { ..._nodeVotes, [playerId]: nodeId }

  const voteState = { votes: _nodeVotes, totalPlayers: _nodeTotalPlayers }
  useSessionStore.getState().setNodeVoteState(voteState)

  const socket = getSocket()
  if (_nodeRoomCode) {
    socket.emit('node-vote-update', { code: _nodeRoomCode, votes: _nodeVotes, totalPlayers: _nodeTotalPlayers })
  }

  if (_nodeTotalPlayers > 0 && Object.keys(_nodeVotes).length >= _nodeTotalPlayers) {
    _applyNodeMajority()
  }
}

export function clearNodeVotes() {
  _nodeVotes = {}
  useSessionStore.getState().setNodeVoteState(null)
}

function _getNodeMajority(votes: Record<string, string>): string {
  const counts: Record<string, number> = {}
  for (const nodeId of Object.values(votes)) {
    counts[nodeId] = (counts[nodeId] ?? 0) + 1
  }
  let maxCount = 0
  for (const count of Object.values(counts)) {
    if (count > maxCount) maxCount = count
  }
  const tied = Object.entries(counts)
    .filter(([, c]) => c === maxCount)
    .map(([nodeId]) => nodeId)
  return tied[Math.floor(Math.random() * tied.length)]
}

function _applyNodeMajority() {
  const winner = _getNodeMajority(_nodeVotes)
  _nodeVotes = {}
  useSessionStore.getState().setNodeVoteState(null)
  if (winner && _onNodeComplete) {
    _onNodeComplete(winner)
  }
}

// ── Retreat vote (unanimous — every player must agree before the run ends) ─────

let _retreatVotes: Set<string> = new Set()
let _retreatTotalPlayers = 0
let _retreatRoomCode: string | null = null
let _onRetreatComplete: (() => void) | null = null

export function setRetreatVoteCompleteCallback(cb: (() => void) | null) {
  _onRetreatComplete = cb
}

/** (Re)initialise for a new active run / player count change. */
export function initRetreatVotes(totalPlayers: number, roomCode: string) {
  _retreatVotes = new Set()
  _retreatTotalPlayers = totalPlayers
  _retreatRoomCode = roomCode
  useSessionStore.getState().setRetreatVoteState(null)
}

/** Cast (or retract) a player's vote to retreat. Fires the completion callback once everyone agrees. */
export function castRetreatVote(playerId: string, wantsRetreat: boolean) {
  if (wantsRetreat) _retreatVotes.add(playerId)
  else _retreatVotes.delete(playerId)

  const voteState = { votes: Array.from(_retreatVotes), totalPlayers: _retreatTotalPlayers }
  useSessionStore.getState().setRetreatVoteState(voteState)

  const socket = getSocket()
  if (_retreatRoomCode) {
    socket.emit('retreat-vote-update', { code: _retreatRoomCode, votes: voteState.votes, totalPlayers: _retreatTotalPlayers })
  }

  if (_retreatTotalPlayers > 0 && _retreatVotes.size >= _retreatTotalPlayers) {
    _retreatVotes = new Set()
    useSessionStore.getState().setRetreatVoteState(null)
    _onRetreatComplete?.()
  }
}

export function clearRetreatVotes() {
  _retreatVotes = new Set()
  useSessionStore.getState().setRetreatVoteState(null)
}

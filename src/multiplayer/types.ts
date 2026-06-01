/**
 * Multiplayer types shared between the store, sync hook, and UI.
 */

import type { GameState, Hero, Item, Run } from '@/types'

export interface MultiplayerPlayer {
  id: string
  name: string
}

/** The slice of GameState that is broadcast from host to guests each turn. */
export interface MultiplayerSyncState {
  dungeon: GameState['dungeon']
  party: GameState['party']
  isGameOver: boolean
  isPaused: boolean
  lastOutcome: GameState['lastOutcome']
  activeRun: GameState['activeRun']
}

/**
 * Actions a guest can request the host to perform on their behalf.
 * Uses choice index because EventChoice has no stable ID field.
 */
export type GuestAction =
  | { type: 'advance-dungeon' }
  | { type: 'select-choice'; choiceIndex: number }
  | { type: 'select-map-node'; nodeId: string }
  | { type: 'retreat' }
  | { type: 'start-dungeon'; startingFloor?: number; alkahestCost?: number }
  | { type: 'combat-action'; heroId: string; action: string }

// ── Extended multiplayer session types ──────────────────────────────────────

/** A hero contributed by one player to fill a party slot. */
export interface SlotAssignment {
  playerId: string
  playerName: string
  /** Full hero snapshot as sent by the contributing player. */
  heroSnapshot: Hero
  /** The hero's ID in the owning player's local roster. */
  heroSourceId: string
}

/** Public profile broadcast by each player so others can see their roster and location. */
export interface PlayerProfile {
  playerId: string
  playerName: string
  heroRosterPreview: Array<{
    id: string
    name: string
    className: string
    classIcon: string
    level: number
  }>
  bankGold: number
  currentLocation: 'menu' | 'town' | 'party-setup' | 'dungeon'
}

/** Payload the host sends to all players when a run ends. */
export interface RunEndPayload {
  /**
   * Updated hero state after the run, keyed by the hero's SOURCE id
   * (i.e. the id in the owning player's roster). Grouped by player socket id.
   */
  heroReturnsByPlayer: Record<string, Record<string, Hero>>
  /** Loot items to give to each player (keyed by socket id). */
  lootByPlayer: Record<string, Item[]>
  /** Gold to give to each player (keyed by socket id). */
  goldByPlayer: Record<string, number>
  /** The completed Run record for quest processing on each client. */
  run: Run
}

/** Live vote tally shown to all players while an event choice vote is open. */
export interface VoteState {
  /** playerId → choiceIndex they voted for */
  votes: Record<string, number>
  totalPlayers: number
}

/** State of the post-run loot draft. Held in session store until complete. */
export interface DraftState {
  /** Items available to pick from (shrinks as players pick). */
  pool: Item[]
  /** Items each player has already claimed. playerId → Item[]. */
  picks: Record<string, Item[]>
  /** Fixed gold split, determined before the draft starts. */
  goldByPlayer: Record<string, number>
  /** Pre-built hero return map (heroes go back to owners after draft). */
  heroReturnsByPlayer: Record<string, Record<string, Hero>>
  /** Player IDs in draft order (loops until pool is empty). */
  order: string[]
  /** Which position in `order` is currently picking (mod order.length). */
  currentPickerIndex: number
  /** The completed Run record, passed through for quest processing. */
  run: unknown
}

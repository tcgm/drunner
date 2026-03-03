/**
 * Boss Combat Manager - Handles combat lifecycle independent of React
 * 
 * This manager orchestrates combat state and flow without being tied to
 * React component lifecycle, preventing issues with unmounting, re-renders, etc.
 */

import type { Hero, BossCombatState, DungeonEvent, Dungeon } from '@/types'
import { initializeBossCombatState } from './combatState'
import { checkVictory, checkDefeat } from './combatFlow'

export type CombatStatus = 'active' | 'victory' | 'defeat'

export interface CombatManagerCallbacks {
    onVictory: () => void
    onDefeat: () => void
    onStateUpdate: (state: BossCombatState) => void
    onLog?: (type: string, message: string) => void
}

/**
 * Combat Manager - Non-React state machine for boss combat
 */
export class BossCombatManager {
    private combatState: BossCombatState
    private party: (Hero | null)[]
    private callbacks: CombatManagerCallbacks
    private status: CombatStatus = 'active'
    private victoryTimer: number | null = null
    private defeatTimer: number | null = null
    private isProcessing = false

    constructor(
        bossEvent: DungeonEvent,
        dungeon: Dungeon,
        party: (Hero | null)[],
        callbacks: CombatManagerCallbacks
    ) {
        this.combatState = initializeBossCombatState(bossEvent, dungeon)
        this.party = party
        this.callbacks = callbacks
    }

    /**
     * Get current combat state (read-only)
     */
    getState(): Readonly<BossCombatState> {
        return this.combatState
    }

    /**
     * Get current combat status
     */
    getStatus(): CombatStatus {
        return this.status
    }

    /**
     * Check if combat is processing an action
     */
    isCurrentlyProcessing(): boolean {
        return this.isProcessing
    }

    /**
     * Update combat state (e.g., after hero action or boss turn)
     */
    updateState(newState: BossCombatState): void {
        this.combatState = newState
        this.callbacks.onStateUpdate(newState)
        
        // Check victory/defeat after every state update
        this.checkCombatEnd()
    }

    /**
     * Set processing flag (prevents concurrent actions)
     */
    setProcessing(processing: boolean): void {
        this.isProcessing = processing
    }

    /**
     * Update party state (e.g., after hero death/revival)
     */
    updateParty(party: (Hero | null)[]): void {
        this.party = party
        
        // Check defeat after party update
        this.checkCombatEnd()
    }

    /**
     * Check and handle combat end conditions (victory/defeat)
     * This runs after every state update
     */
    private checkCombatEnd(): void {
        // Don't check if already ended
        // NOTE: We DO check even when processing - the killing blow happens during processing!
        if (this.status !== 'active') {
            return
        }

        const victory = checkVictory(this.combatState)
        const defeat = checkDefeat(this.party)

        if (victory) {
            this.handleVictory()
        } else if (defeat) {
            this.handleDefeat()
        }
    }

    /**
     * Handle victory condition
     */
    private handleVictory(): void {
        if (this.status !== 'active') return

        this.status = 'victory'
        this.log('phase', '🎉 Victory! The boss has been defeated!')

        // Allow UI to show victory animation before callback
        this.victoryTimer = window.setTimeout(() => {
            this.callbacks.onVictory()
        }, 1500)
    }

    /**
     * Handle defeat condition
     */
    private handleDefeat(): void {
        if (this.status !== 'active') return

        this.status = 'defeat'
        this.log('phase', '💀 Defeat... Your party has fallen...')

        // Allow UI to show defeat animation before callback
        this.defeatTimer = window.setTimeout(() => {
            this.callbacks.onDefeat()
        }, 1500)
    }

    /**
     * Force check combat end (for external triggers like instant kill)
     */
    forceCheckCombatEnd(): void {
        this.checkCombatEnd()
    }

    /**
     * Log a message (delegates to callback if provided)
     */
    private log(type: string, message: string): void {
        if (this.callbacks.onLog) {
            this.callbacks.onLog(type, message)
        }
    }

    /**
     * Cleanup manager resources (call when combat screen unmounts)
     */
    destroy(): void {
        if (this.victoryTimer !== null) {
            clearTimeout(this.victoryTimer)
            this.victoryTimer = null
        }
        if (this.defeatTimer !== null) {
            clearTimeout(this.defeatTimer)
            this.defeatTimer = null
        }
    }
}

/**
 * Create a new combat manager instance
 */
export function createCombatManager(
    bossEvent: DungeonEvent,
    dungeon: Dungeon,
    party: (Hero | null)[],
    callbacks: CombatManagerCallbacks
): BossCombatManager {
    return new BossCombatManager(bossEvent, dungeon, party, callbacks)
}

/**
 * Boss Combat System - Combat Flow Orchestrator
 * 
 * Main combat loop and turn resolution
 */

import type { Hero, BossCombatState, Dungeon } from '@/types'
import { calculateTurnOrder, updateHeroPositions } from './turnOrder'
import { recalculateDynamicBossStats } from './bossStats'
import { checkPhaseTransition, executePhaseTransition } from './phases'
import { checkAbilityTriggers, executeAbility } from './abilities'
import { selectAttackPattern, executeAttackPattern } from './attackPatterns'
import {
    decrementCooldowns,
    processEffectDurations,
    processStatusEffects,
    applyPassiveHealing,
} from './effects'

export interface BossTurnResult {
    passiveHealing?: number
    phaseTransition?: any
    abilitiesUsed: any[]
    attackResult: any
    statusEffects: any[]
}

export interface RoundEndResult {
    effectsProcessed: any[]
    cooldownsDecremented: boolean
    turnOrderRecalculated: boolean
}

/**
 * Start combat round - calculate initial turn order
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 */
export function startCombatRound(
    combatState: BossCombatState,
    party: (Hero | null)[]
): void {
    // Update hero positions based on party slots
    updateHeroPositions(party)

    // Calculate turn order
    combatState.turnOrder = calculateTurnOrder(party, combatState)
    combatState.currentTurnIndex = 0
}

/**
 * Process boss turn
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Boss turn result
 */
export function processBossTurn(
    combatState: BossCombatState,
    party: (Hero | null)[]
): BossTurnResult {
    const result: BossTurnResult = {
        abilitiesUsed: [],
        attackResult: null,
        statusEffects: [],
    }

    // 1. Check for phase transitions
    const newPhase = checkPhaseTransition(combatState)
    if (newPhase) {
        result.phaseTransition = executePhaseTransition(combatState, newPhase, party)
    }

    // 2. Apply passive healing
    if (combatState.healPerTurn) {
        result.passiveHealing = applyPassiveHealing(combatState)
    }

    // 3. Check and execute abilities
    const triggeredAbilities = checkAbilityTriggers(combatState, party)
    for (const ability of triggeredAbilities) {
        const abilityResult = executeAbility(ability, combatState, party)
        result.abilitiesUsed.push(abilityResult)
    }

    // 4. Select and execute attack pattern
    if (combatState.attackPatterns.length > 0) {
        const pattern = selectAttackPattern(
            combatState.attackPatterns,
            combatState,
            party
        )
        result.attackResult = executeAttackPattern(pattern, combatState, party)
    }

    return result
}

/**
 * Process end of combat round
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Round end result
 */
export function processRoundEnd(
    combatState: BossCombatState,
    party: (Hero | null)[]
): RoundEndResult {
    // 1. Increment combat depth
    combatState.combatDepth++

    // 2. Process status effects (poison, regen, etc.)
    const statusResults = processStatusEffects(combatState, party)

    // 3. Process buff/debuff durations
    processEffectDurations(combatState, party)

    // 4. Decrement cooldowns
    decrementCooldowns(combatState)

    // 5. Recalculate turn order for next round
    combatState.turnOrder = calculateTurnOrder(party, combatState)
    combatState.currentTurnIndex = 0

    return {
        effectsProcessed: statusResults,
        cooldownsDecremented: true,
        turnOrderRecalculated: true,
    }
}

/**
 * Check victory condition (boss HP = 0)
 * 
 * @param combatState - Current combat state
 * @returns True if boss is defeated
 */
export function checkVictory(combatState: BossCombatState): boolean {
    return combatState.currentHp <= 0
}

/**
 * Check defeat condition (all heroes dead)
 * 
 * @param party - Party of heroes
 * @returns True if all heroes are dead
 */
export function checkDefeat(party: (Hero | null)[]): boolean {
    const aliveHeroes = party.filter(h => h !== null && h.isAlive)
    return aliveHeroes.length === 0
}

/**
 * Get current combatant in turn order
 * 
 * @param combatState - Current combat state
 * @returns Current combatant or null if end of round
 */
export function getCurrentCombatant(combatState: BossCombatState) {
    if (
        combatState.currentTurnIndex >= combatState.turnOrder.length ||
        combatState.turnOrder.length === 0
    ) {
        return null
    }
    return combatState.turnOrder[combatState.currentTurnIndex]
}

/**
 * Advance to next combatant in turn order
 * 
 * @param combatState - Current combat state
 * @returns True if round continues, false if round ended
 */
export function advanceTurn(combatState: BossCombatState): boolean {
    combatState.currentTurnIndex++
    return combatState.currentTurnIndex < combatState.turnOrder.length
}

/**
 * Check if combat is still active (not victory or defeat)
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns True if combat continues
 */
export function isCombatActive(
    combatState: BossCombatState,
    party: (Hero | null)[]
): boolean {
    return !checkVictory(combatState) && !checkDefeat(party)
}

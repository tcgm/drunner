/**
 * Boss Combat System - Phase Transitions
 * 
 * Handles boss phase changes based on HP thresholds
 */

import type { BossCombatState, BossPhase, Hero } from '@/types'
import { executeAbility } from './abilities'

/**
 * Check if boss should transition to a new phase
 * 
 * @param combatState - Current combat state
 * @returns Next phase to enter, or null if no transition
 */
export function checkPhaseTransition(
    combatState: BossCombatState
): BossPhase | null {
    if (!combatState.phases || combatState.phases.length === 0) {
        return null
    }

    const currentHpPercent = combatState.currentHp / combatState.maxHp

    // Find the next phase based on HP threshold
    const nextPhase = combatState.phases.find(
        phase =>
            phase.phase > combatState.currentPhase &&
            currentHpPercent <= phase.hpThreshold
    )

    return nextPhase || null
}

export interface PhaseTransitionResult {
    phase: BossPhase
    abilityResults: any[]
    message: string
}

/**
 * Execute phase transition
 * 
 * @param combatState - Current combat state
 * @param newPhase - Phase to transition to
 * @param party - Party of heroes
 * @returns Transition result
 */
export function executePhaseTransition(
    combatState: BossCombatState,
    newPhase: BossPhase,
    party: (Hero | null)[]
): PhaseTransitionResult {
    const result: PhaseTransitionResult = {
        phase: newPhase,
        abilityResults: [],
        message: newPhase.name
            ? `Boss enters ${newPhase.name}!`
            : `Boss enters Phase ${newPhase.phase}!`,
    }

    // Update current phase
    combatState.currentPhase = newPhase.phase

    // Execute onEnter abilities
    if (newPhase.onEnter) {
        for (const ability of newPhase.onEnter) {
            const abilityResult = executeAbility(ability, combatState, party)
            result.abilityResults.push(abilityResult)
        }
    }

    // Update ability set
    if (newPhase.replaceAbilities) {
        combatState.abilities = [...newPhase.replaceAbilities]
    } else if (newPhase.addAbilities) {
        combatState.abilities.push(...newPhase.addAbilities)
    }

    // Update attack patterns
    if (newPhase.replaceAttackPatterns) {
        combatState.attackPatterns = [...newPhase.replaceAttackPatterns]
    } else if (newPhase.addAttackPatterns) {
        combatState.attackPatterns.push(...newPhase.addAttackPatterns)
    }

    // Apply stat modifiers
    if (newPhase.statModifiers) {
        if (newPhase.statModifiers.attack !== undefined) {
            combatState.baseStats.attack += newPhase.statModifiers.attack
        }
        if (newPhase.statModifiers.defense !== undefined) {
            combatState.baseStats.defense += newPhase.statModifiers.defense
        }
        if (newPhase.statModifiers.speed !== undefined) {
            combatState.baseStats.speed += newPhase.statModifiers.speed
        }
        if (newPhase.statModifiers.luck !== undefined) {
            combatState.baseStats.luck += newPhase.statModifiers.luck
        }
    }

    // Update passive healing
    if (newPhase.healPerTurn !== undefined) {
        combatState.healPerTurn = newPhase.healPerTurn
    }

    return result
}

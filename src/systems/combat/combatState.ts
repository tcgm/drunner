/**
 * Boss Combat System - Combat State Initialization
 * 
 * Initializes boss combat state for turn-based battles
 */

import type { BossCombatState, DungeonEvent, Dungeon } from '@/types'
import { calculateInitialBossStats, getBossBaseStats } from './bossStats'
import { HEAVY_STRIKE, WHIRLWIND, RAPID_STRIKES } from '@/data/attackPatterns/boss'

/**
 * Initialize boss combat state at the start of battle
 * 
 * @param bossEvent - The boss event definition
 * @param dungeon - Current dungeon state
 * @returns Initialized boss combat state
 */
export function initializeBossCombatState(
    bossEvent: DungeonEvent,
    dungeon: Dungeon
): BossCombatState {
    const floor = dungeon.floor
    const depth = dungeon.depth

    // Calculate initial boss stats (maxHP locked here)
    const initialStats = calculateInitialBossStats(bossEvent, floor, depth)
    const baseStats = getBossBaseStats(bossEvent)

    // Use default attack patterns if none provided
    const defaultAttackPatterns = [HEAVY_STRIKE, WHIRLWIND, RAPID_STRIKES]
    const attackPatterns = bossEvent.attackPatterns && bossEvent.attackPatterns.length > 0
        ? [...bossEvent.attackPatterns]
        : defaultAttackPatterns

    // Initialize combat state
    const combatState: BossCombatState = {
        currentHp: initialStats.currentHp,
        maxHp: initialStats.maxHp,
        baseStats: {
            attack: baseStats.baseAttack,
            defense: baseStats.baseDefense,
            speed: baseStats.baseSpeed,
            luck: baseStats.baseLuck,
        },
        abilities: bossEvent.bossAbilities ? [...bossEvent.bossAbilities] : [],
        attackPatterns: attackPatterns,
        phases: bossEvent.phases ? [...bossEvent.phases] : undefined,
        currentPhase: 1, // Start at phase 1
        combatChoices: bossEvent.combatChoices ? [...bossEvent.combatChoices] : undefined,
        healPerTurn: bossEvent.healPerTurn,
        combatDepth: 0, // Start at turn 0
        floor, // Lock floor for danger calculations
        depth, // Lock depth for danger calculations
        itemCooldowns: new Map<string, number>(),
        abilityCooldowns: new Map<string, number>(),
        activeEffects: [],
        turnOrder: [],
        currentTurnIndex: 0,
    }

    return combatState
}

/**
 * Update boss event with combat state (for persistence)
 * 
 * @param bossEvent - The boss event to update
 * @param combatState - Current combat state
 * @returns Updated boss event with combat state
 */
export function updateBossEventWithState(
    bossEvent: DungeonEvent,
    combatState: BossCombatState
): DungeonEvent {
    return {
        ...bossEvent,
        combatState,
    }
}

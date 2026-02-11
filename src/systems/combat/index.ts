/**
 * Boss Combat System
 * 
 * Turn-based combat system for boss encounters
 * 
 * Features:
 * - Dynamic stat scaling based on floor, depth, and combat depth
 * - Phase transitions at HP thresholds
 * - Boss abilities with cooldowns and triggers
 * - Attack patterns with weights and conditions
 * - Turn-based combat with speed-based turn order
 * - Buff/debuff/status effect system
 */

// Danger calculation
export { calculateDanger, applyFirstBossScaling } from './dangerCalculation'

// Boss stats
export {
    getBossBaseStats,
    calculateScaledStat,
    calculateInitialBossStats,
    recalculateDynamicBossStats,
    type BossBaseStats,
    type BossScaledStats,
} from './bossStats'

// Combat state
export {
    initializeBossCombatState,
    updateBossEventWithState,
} from './combatState'

// Turn order
export {
    calculateTurnOrder,
    getHeroPosition,
    updateHeroPositions,
} from './turnOrder'

// Targeting
export {
    selectBossTarget,
    checkPatternCondition,
} from './targeting'

// Attack patterns
export {
    selectAttackPattern,
    executeAttackPattern,
    type AttackResult,
} from './attackPatterns'

// Abilities
export {
    checkAbilityTriggers,
    executeAbility,
    type AbilityExecutionResult,
} from './abilities'

// Phase transitions
export {
    checkPhaseTransition,
    executePhaseTransition,
    type PhaseTransitionResult,
} from './phases'

// Effects and cooldowns
export {
    decrementCooldowns,
    processEffectDurations,
    processStatusEffects,
    applyPassiveHealing,
    applyStatModifiers,
} from './effects'

// Combat flow
export {
    startCombatRound,
    processBossTurn,
    processRoundEnd,
    checkVictory,
    checkDefeat,
    getCurrentCombatant,
    advanceTurn,
    isCombatActive,
    type BossTurnResult,
    type RoundEndResult,
} from './combatFlow'

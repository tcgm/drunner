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

// Combat manager (non-React state machine)
export {
    BossCombatManager,
    createCombatManager,
    type CombatStatus,
    type CombatManagerCallbacks,
} from './combatManager'

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

// Hero actions
export {
    executeAttack,
    executeDefend,
    executeFlee,
    canPerformAction,
    type HeroAction,
    type HeroActionType,
    type HeroActionResult,
} from './heroActions'

// Hero abilities
export {
    executeHeroAbility,
} from './heroAbilities'

// Item usage and consumables
export {
    useConsumable,
    getConsumableActionCost,
    isReviveConsumable,
    getUsableConsumables,
    type ConsumableUsageResult,
} from './itemUsage'

// Hero turn processing
export {
    processHeroTurn,
    getAvailableActions,
    canAffordActionCost,
    calculateConsumableActionCost,
    validateActionSequence,
    type HeroTurnContext,
    type HeroTurnResult,
} from './heroTurn'

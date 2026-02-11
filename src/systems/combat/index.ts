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

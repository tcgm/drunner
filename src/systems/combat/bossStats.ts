/**
 * Boss Combat System - Boss Stats Calculator
 * 
 * Calculates boss stats based on tier, danger level, and scaling factors
 */

import { GAME_CONFIG } from '@/config/gameConfig'
import type { DungeonEvent } from '@/types'
import { calculateDanger, applyFirstBossScaling } from './dangerCalculation'

export interface BossBaseStats {
    baseHp: number
    baseAttack: number
    baseDefense: number
    baseSpeed: number
    baseLuck: number
}

export interface BossScaledStats {
    maxHp: number // Locked at combat start
    currentHp: number
    attack: number // Dynamic (recalculated each turn)
    defense: number // Dynamic
    speed: number // Dynamic
    luck: number // Dynamic
}

/**
 * Get base stats for a boss based on tier and custom overrides
 * 
 * @param bossEvent - The boss event definition
 * @returns Base stats before scaling
 */
export function getBossBaseStats(bossEvent: DungeonEvent): BossBaseStats {
    const config = GAME_CONFIG.combat.turnBased.bossStats

    // Determine tier
    let tierStats: BossBaseStats
    if (bossEvent.isFinalBoss) {
        tierStats = config.finalBoss
    } else if (bossEvent.isZoneBoss) {
        tierStats = config.zoneBoss
    } else {
        tierStats = config.floorBoss
    }

    // Apply custom base stats overrides if defined
    if (bossEvent.customBaseStats) {
        return {
            baseHp: bossEvent.customBaseStats.baseHp ?? tierStats.baseHp,
            baseAttack: bossEvent.customBaseStats.baseAttack ?? tierStats.baseAttack,
            baseDefense: bossEvent.customBaseStats.baseDefense ?? tierStats.baseDefense,
            baseSpeed: bossEvent.customBaseStats.baseSpeed ?? tierStats.baseSpeed,
            baseLuck: bossEvent.customBaseStats.baseLuck ?? tierStats.baseLuck,
        }
    }

    return tierStats
}

/**
 * Calculate scaled stat value based on base stat and danger level
 * 
 * Formula: baseStat * (1 + (danger - 1) * scalingFactor)
 * 
 * At danger = 1 (floor 1, no events, no turns): returns baseStat (no scaling)
 * At danger = 10: with 0.15 scaling = baseStat * 2.35 (+135%)
 * 
 * @param baseStat - Base stat value before scaling
 * @param danger - Effective danger level
 * @param scalingFactor - Scaling factor per danger point (e.g., 0.15 for HP)
 * @returns Scaled stat value
 */
export function calculateScaledStat(
    baseStat: number,
    danger: number,
    scalingFactor: number
): number {
    return Math.round(baseStat * (1 + (danger - 1) * scalingFactor))
}

/**
 * Calculate boss stats for combat start (maxHP locked, initial dynamic stats)
 * 
 * @param bossEvent - The boss event definition
 * @param floor - Current floor
 * @param depth - Total events completed
 * @returns Scaled boss stats with maxHP locked at combat start
 */
export function calculateInitialBossStats(
    bossEvent: DungeonEvent,
    floor: number,
    depth: number
): BossScaledStats {
    // Calculate danger at combat start (combatDepth = 0)
    let danger = calculateDanger(floor, depth, 0)

    // Apply first boss scaling if applicable
    danger = applyFirstBossScaling(danger, floor)

    const baseStats = getBossBaseStats(bossEvent)
    const scaling = GAME_CONFIG.combat.turnBased.bossScaling

    // Lock maxHP at combat start
    const maxHp = calculateScaledStat(baseStats.baseHp, danger, scaling.hp)

    // Calculate initial dynamic stats
    const attack = calculateScaledStat(baseStats.baseAttack, danger, scaling.attack)
    const defense = calculateScaledStat(baseStats.baseDefense, danger, scaling.defense)
    const speed = calculateScaledStat(baseStats.baseSpeed, danger, scaling.speed)
    const luck = calculateScaledStat(baseStats.baseLuck, danger, scaling.luck)

    return {
        maxHp,
        currentHp: maxHp, // Start at full HP
        attack,
        defense,
        speed,
        luck,
    }
}

/**
 * Recalculate dynamic boss stats during combat (HP stays locked)
 * 
 * @param baseStats - Boss base stats
 * @param floor - Floor when combat started
 * @param depth - Depth when combat started
 * @param combatDepth - Current turn count
 * @param currentHp - Current HP (doesn't change)
 * @param maxHp - Max HP (locked at combat start, doesn't change)
 * @returns Updated boss stats with new dynamic values
 */
export function recalculateDynamicBossStats(
    baseStats: BossBaseStats,
    floor: number,
    depth: number,
    combatDepth: number,
    currentHp: number,
    maxHp: number
): BossScaledStats {
    // Calculate current danger with combat depth
    let danger = calculateDanger(floor, depth, combatDepth)

    // Apply first boss scaling if applicable
    danger = applyFirstBossScaling(danger, floor)

    const scaling = GAME_CONFIG.combat.turnBased.bossScaling

    // Recalculate dynamic stats only
    const attack = calculateScaledStat(baseStats.baseAttack, danger, scaling.attack)
    const defense = calculateScaledStat(baseStats.baseDefense, danger, scaling.defense)
    const speed = calculateScaledStat(baseStats.baseSpeed, danger, scaling.speed)
    const luck = calculateScaledStat(baseStats.baseLuck, danger, scaling.luck)

    return {
        maxHp, // Stays locked
        currentHp, // Stays as-is
        attack,
        defense,
        speed,
        luck,
    }
}

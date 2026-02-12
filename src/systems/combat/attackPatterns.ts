/**
 * Boss Combat System - Attack Pattern Selection and Execution
 * 
 * Selects and executes boss attack patterns
 */

import type { Hero, BossCombatState, BossAttackPattern } from '@/types'
import { checkPatternCondition, selectBossTarget } from './targeting'
import { recalculateDynamicBossStats } from './bossStats'
import { applyDefenseReduction } from '@/utils/defenseUtils'
import { calculateTotalStats } from '@/utils/statCalculator'

/**
 * Select attack pattern from available patterns using weights
 * 
 * @param patterns - Available attack patterns
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Selected attack pattern
 */
export function selectAttackPattern(
    patterns: BossAttackPattern[],
    combatState: BossCombatState,
    party: (Hero | null)[]
): BossAttackPattern {
    if (patterns.length === 0) {
        throw new Error('Boss has no attack patterns defined')
    }

    // Filter patterns by condition
    const validPatterns = patterns.filter(p =>
        checkPatternCondition(p, combatState, party)
    )

    if (validPatterns.length === 0) {
        // Fallback to first pattern if no conditions are met
        return patterns[0]
    }

    // Select based on weights
    const totalWeight = validPatterns.reduce((sum, p) => sum + p.weight, 0)
    let roll = Math.random() * totalWeight

    for (const pattern of validPatterns) {
        roll -= pattern.weight
        if (roll <= 0) {
            return pattern
        }
    }

    return validPatterns[validPatterns.length - 1]
}

export interface AttackResult {
    pattern: BossAttackPattern
    targets: Hero[]
    damage: Array<{
        heroId: string
        heroName: string
        damage: number
        originalDamage: number
        isCrit: boolean
        isDodge: boolean
    }>
    totalDamage: number
}

/**
 * Execute boss attack pattern on target(s)
 * 
 * @param pattern - Attack pattern to execute
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Attack result with damage dealt
 */
export function executeAttackPattern(
    pattern: BossAttackPattern,
    combatState: BossCombatState,
    party: (Hero | null)[]
): AttackResult {
    // Select target(s)
    const targetResult = selectBossTarget(pattern, combatState, party)

    if (!targetResult) {
        return {
            pattern,
            targets: [],
            damage: [],
            totalDamage: 0,
        }
    }

    const targets = Array.isArray(targetResult) ? targetResult : [targetResult]

    // Get current boss stats
    const baseStats = {
        baseHp: 0, // Not needed for attack calculation
        baseAttack: combatState.baseStats.attack,
        baseDefense: combatState.baseStats.defense,
        baseSpeed: combatState.baseStats.speed,
        baseLuck: combatState.baseStats.luck,
    }
    const bossStats = recalculateDynamicBossStats(
        baseStats,
        combatState.floor,
        combatState.depth,
        combatState.combatDepth,
        combatState.currentHp,
        combatState.maxHp
    )

    // Calculate damage for each target
    const damageResults: AttackResult['damage'] = []
    let totalDamage = 0

    for (const target of targets) {
        const heroStats = calculateTotalStats(target)

        // Base damage = boss attack * pattern multiplier
        let baseDamage = Math.round(bossStats.attack * pattern.damageMultiplier)

        // AOE damage reduction
        if (pattern.attackType === 'aoe' && pattern.aoeDamageReduction) {
            baseDamage = Math.round(baseDamage * pattern.aoeDamageReduction)
        }

        // Crit check (boss luck vs hero luck)
        // Hero luck counters boss's crit chance
        const baseCritChance = pattern.critChance ?? 0.05 // Default 5% base crit if no pattern crit
        const luckDifference = bossStats.luck - heroStats.luck
        const luckCritBonus = Math.max(0, luckDifference) / 1000 // Only positive difference adds to crit
        const critChance = Math.min(0.95, baseCritChance + luckCritBonus) // Cap at 95%
        const isCrit = Math.random() < critChance
        if (isCrit) {
            baseDamage = Math.round(baseDamage * 2) // 2x damage on crit
        }

        // Dodge check (hero luck vs boss luck)
        // Boss luck counters hero's dodge chance
        const netLuck = Math.max(0, heroStats.luck - bossStats.luck)
        const dodgeChance = netLuck / 1000 // 1% per 10 net luck
        const isDodge = Math.random() < dodgeChance

        let finalDamage = 0
        if (!isDodge) {
            // Apply defense reduction
            finalDamage = applyDefenseReduction(baseDamage, heroStats.defense)
            finalDamage = Math.max(1, finalDamage) // Minimum 1 damage
        }

        // Apply damage to hero
        target.stats.hp = Math.max(0, target.stats.hp - finalDamage)
        if (target.stats.hp === 0) {
            target.isAlive = false
        }

        damageResults.push({
            heroId: target.id,
            heroName: target.name,
            damage: finalDamage,
            originalDamage: baseDamage,
            isCrit,
            isDodge,
        })

        totalDamage += finalDamage
    }

    return {
        pattern,
        targets,
        damage: damageResults,
        totalDamage,
    }
}

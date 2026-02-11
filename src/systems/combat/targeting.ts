/**
 * Boss Combat System - Targeting
 * 
 * Intelligent boss targeting based on danger level
 */

import type { Hero, BossCombatState, BossAttackPattern } from '@/types'
import { calculateDanger } from './dangerCalculation'

/**
 * Select target(s) for boss attack based on pattern and intelligence
 * 
 * @param pattern - Attack pattern to execute
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Target hero(es) or null if no valid targets
 */
export function selectBossTarget(
    pattern: BossAttackPattern,
    combatState: BossCombatState,
    party: (Hero | null)[]
): Hero | Hero[] | null {
    const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)

    if (aliveHeroes.length === 0) {
        return null
    }

    // AOE: Target all alive heroes
    if (pattern.attackType === 'aoe') {
        return aliveHeroes
    }

    // Cleave: Target frontline heroes
    if (pattern.attackType === 'cleave') {
        const frontline = aliveHeroes.filter(h => h.position === 'frontline')
        return frontline.length > 0 ? frontline : aliveHeroes
    }

    // Multi: Target random heroes (can hit same hero multiple times)
    if (pattern.attackType === 'multi') {
        const targets: Hero[] = []
        const targetCount = pattern.targetCount || 3

        for (let i = 0; i < targetCount; i++) {
            const randomIndex = Math.floor(Math.random() * aliveHeroes.length)
            targets.push(aliveHeroes[randomIndex])
        }

        return targets
    }

    // Single-target: Intelligent targeting based on danger
    return selectSingleTarget(combatState, party, aliveHeroes)
}

/**
 * Select single target using intelligence based on danger level
 * 
 * @param combatState - Current combat state
 * @param party - Full party (for checking positions)
 * @param aliveHeroes - Filtered list of alive heroes
 * @returns Single target hero
 */
function selectSingleTarget(
    combatState: BossCombatState,
    party: (Hero | null)[],
    aliveHeroes: Hero[]
): Hero {
    const danger = calculateDanger(
        combatState.floor,
        combatState.depth,
        combatState.combatDepth
    )

    // Frontline guard: Must target frontline if any alive
    const frontline = aliveHeroes.filter(h => h.position === 'frontline')
    const backline = aliveHeroes.filter(h => h.position === 'backline')
    const validTargets = frontline.length > 0 ? frontline : backline

    // Low-danger bosses (floors 1-20): Random or highest HP
    if (danger <= 20) {
        return selectRandom(validTargets)
    }

    // Mid-danger bosses (floors 21-60): Prefer low HP, occasional support targeting
    if (danger <= 60) {
        // 30% chance to target healers/support if backline is exposed
        if (Math.random() < 0.3 && backline.length === 0) {
            const support = validTargets.filter(h =>
                h.class.name === 'Cleric' ||
                h.class.name === 'Bard' ||
                h.class.name === 'Healer'
            )
            if (support.length > 0) {
                return selectLowestHp(support)
            }
        }
        // Otherwise target lowest HP
        return selectLowestHp(validTargets)
    }

    // High-danger bosses (floors 61+): Prioritize healers > support > damage dealers
    if (backline.length === 0) {
        // Backline exposed - prioritize high-value targets
        const healers = validTargets.filter(h =>
            h.class.name === 'Cleric' ||
            h.class.name === 'Healer' ||
            h.class.name === 'Paladin'
        )
        if (healers.length > 0) {
            return selectLowestHp(healers)
        }

        const support = validTargets.filter(h =>
            h.class.name === 'Bard' ||
            h.class.name === 'Mage'
        )
        if (support.length > 0) {
            return selectLowestHp(support)
        }
    }

    // Default: Target lowest HP
    return selectLowestHp(validTargets)
}

/**
 * Select random hero from list
 */
function selectRandom(heroes: Hero[]): Hero {
    const index = Math.floor(Math.random() * heroes.length)
    return heroes[index]
}

/**
 * Select hero with lowest HP
 */
function selectLowestHp(heroes: Hero[]): Hero {
    return heroes.reduce((lowest, hero) =>
        hero.stats.hp < lowest.stats.hp ? hero : lowest
    )
}

/**
 * Check if pattern's condition is met (if it has one)
 * 
 * @param pattern - Attack pattern with optional condition
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns True if condition is met or no condition exists
 */
export function checkPatternCondition(
    pattern: BossAttackPattern,
    combatState: BossCombatState,
    party: (Hero | null)[]
): boolean {
    if (!pattern.condition) {
        return true
    }

    return pattern.condition(combatState, party.filter((h): h is Hero => h !== null))
}

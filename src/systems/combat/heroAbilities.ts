/**
 * Boss Combat System - Hero Ability Execution
 * 
 * Handles hero ability execution during combat
 */

import type { Hero, BossCombatState, Ability, AbilityEffect, Stats } from '@/types'
import type { HeroActionResult } from './heroActions'
import { calculateTotalStats } from '@/utils/statCalculator'
import { applyDefenseReduction } from '@/utils/defenseUtils'
import { recalculateDynamicBossStats } from './bossStats'

/**
 * Execute hero ability during combat
 * 
 * @param hero - Hero using ability
 * @param ability - Ability to execute
 * @param combatState - Current combat state
 * @param party - Party of heroes (for ally targeting)
 * @returns Action result
 */
export function executeHeroAbility(
    hero: Hero,
    ability: Ability,
    combatState: BossCombatState,
    party: (Hero | null)[]
): HeroActionResult {
    const result: HeroActionResult = {
        action: {
            type: 'useAbility',
            heroId: hero.id,
            ability,
        },
        success: true,
        effects: [],
        message: `${hero.name} uses ${ability.name}!`,
    }

    const effect = ability.effect
    const heroStats = calculateTotalStats(hero)

    // Calculate effective value with scaling
    let effectiveValue = effect.value
    if (effect.scaling) {
        const scalingStat = heroStats[effect.scaling.stat as keyof Stats]
        const scalingValue = (typeof scalingStat === 'number' ? scalingStat : 0)
        effectiveValue += Math.round(scalingValue * effect.scaling.ratio)
    }

    // Process effect based on type
    switch (effect.type) {
        case 'damage':
            result.damage = processDamageEffect(
                hero,
                effectiveValue,
                effect,
                combatState,
                party,
                result
            )
            break

        case 'heal':
            result.healing = processHealEffect(
                hero,
                effectiveValue,
                effect,
                party,
                result
            )
            break

        case 'buff':
            processBuffEffect(
                hero,
                effectiveValue,
                effect,
                party,
                result
            )
            break

        case 'debuff':
            processDebuffEffect(
                hero,
                effectiveValue,
                effect,
                combatState,
                result
            )
            break

        case 'special':
            // Special abilities handled case-by-case
            result.effects.push({
                type: 'special',
                target: hero.id,
                description: ability.description,
            })
            break
    }

    // Set cooldown for combat (turn-based)
    const cooldownKey = `${hero.id}-${ability.id}`
    combatState.abilityCooldowns.set(cooldownKey, ability.cooldown)

    // Note: Global cooldowns (lastUsedFloor/lastUsedDepth) are NOT updated during combat
    // They will be updated when combat ends if needed
    // Combat uses its own turn-based cooldown system via combatState.abilityCooldowns

    // Track charges
    const heroAbility = hero.abilities.find(a => a.id === ability.id)
    if (heroAbility && heroAbility.charges !== undefined) {
        heroAbility.chargesUsed = (heroAbility.chargesUsed || 0) + 1
    }

    return result
}

/**
 * Process damage effect
 */
function processDamageEffect(
    hero: Hero,
    value: number,
    effect: AbilityEffect,
    combatState: BossCombatState,
    party: (Hero | null)[],
    result: HeroActionResult
): number {
    let totalDamage = 0

    if (effect.target === 'enemy' || effect.target === 'all-enemies') {
        // Damage boss - use current scaled defense
        const scaledBossStats = recalculateDynamicBossStats(
            {
                baseHp: 0,
                baseAttack: combatState.baseStats.attack,
                baseDefense: combatState.baseStats.defense,
                baseSpeed: combatState.baseStats.speed,
                baseLuck: combatState.baseStats.luck
            },
            combatState.floor,
            combatState.depth,
            combatState.combatDepth,
            combatState.currentHp,
            combatState.maxHp
        )
        const bossDefense = scaledBossStats.defense
        const finalDamage = applyDefenseReduction(value, bossDefense)
        const actualDamage = Math.max(1, finalDamage)

        combatState.currentHp = Math.max(0, combatState.currentHp - actualDamage)
        totalDamage = actualDamage

        result.effects.push({
            type: 'damage',
            target: 'boss',
            value: actualDamage,
            description: `Boss took ${actualDamage} damage from ${hero.name}'s ability!`,
        })
    }

    return totalDamage
}

/**
 * Process heal effect
 */
function processHealEffect(
    hero: Hero,
    value: number,
    effect: AbilityEffect,
    party: (Hero | null)[],
    result: HeroActionResult
): number {
    let totalHealing = 0
    const targets = selectHealTargets(effect, hero, party)

    // Check if this is a heal-over-time effect (has duration)
    if (effect.duration && effect.duration > 1) {
        // Apply as HoT status effect - value is healing per turn
        const healPerTurn = value
        
        for (const target of targets) {
            if (!target.combatEffects) {
                target.combatEffects = []
            }

            target.combatEffects.push({
                id: `regen-${Date.now()}-${target.id}`,
                type: 'status',
                name: 'Regeneration',
                duration: effect.duration,
                target: target.id,
                behavior: {
                    type: 'healPerTurn',
                    healAmount: healPerTurn,
                }
            })

            totalHealing += healPerTurn * effect.duration

            result.effects.push({
                type: 'heal',
                target: target.id,
                value: healPerTurn,
                description: `${target.name} will regenerate ${healPerTurn} HP per turn for ${effect.duration} turns!`,
            })
        }
    } else {
        // Apply instant heal
        for (const target of targets) {
            const targetStats = calculateTotalStats(target)
            const actualMaxHp = targetStats.maxHp
            const maxPossibleHeal = Math.max(0, actualMaxHp - target.stats.hp)
            const healAmount = Math.min(value, maxPossibleHeal)
            target.stats.hp += healAmount
            totalHealing += healAmount

            result.effects.push({
                type: 'heal',
                target: target.id,
                value: healAmount,
                description: `${target.name} healed for ${healAmount} HP!`,
            })
        }
    }

    return totalHealing
}

/**
 * Process buff effect
 */
function processBuffEffect(
    hero: Hero,
    value: number,
    effect: AbilityEffect,
    party: (Hero | null)[],
    result: HeroActionResult
): void {
    const targets = selectBuffTargets(effect, hero, party)
    const duration = effect.duration || 3

    for (const target of targets) {
        if (!target.combatEffects) {
            target.combatEffects = []
        }

        // TODO: Add proper stat targeting when AbilityEffect is extended
        target.combatEffects.push({
            id: `buff-${Date.now()}-${target.id}`,
            type: 'buff',
            name: `Buff`,
            value,
            duration,
            target: target.id,
        })

        result.effects.push({
            type: 'buff',
            target: target.id,
            value,
            description: `${target.name} gained a buff!`,
        })
    }
}

/**
 * Process debuff effect
 */
function processDebuffEffect(
    hero: Hero,
    value: number,
    effect: AbilityEffect,
    combatState: BossCombatState,
    result: HeroActionResult
): void {
    const duration = effect.duration || 3

    if (effect.target === 'enemy' || effect.target === 'all-enemies') {
        // Debuff boss
        combatState.activeEffects.push({
            id: `debuff-${Date.now()}`,
            type: 'debuff',
            name: `Debuff`,
            value: -value,
            duration,
            target: 'boss',
        })

        result.effects.push({
            type: 'debuff',
            target: 'boss',
            value,
            description: `Boss was debuffed!`,
        })
    }
}

/**
 * Select heal targets based on effect target
 */
function selectHealTargets(
    effect: AbilityEffect,
    hero: Hero,
    party: (Hero | null)[]
): Hero[] {
    const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)

    switch (effect.target) {
        case 'self':
            return [hero]

        case 'ally': {
            // Select most wounded ally (using total stats including equipment)
            const others = aliveHeroes.filter(h => h.id !== hero.id)
            if (others.length === 0) return [hero]

            const mostWounded = others.reduce((lowest, h) => {
                const hStats = calculateTotalStats(h)
                const lowestStats = calculateTotalStats(lowest)
                const hRatio = h.stats.hp / hStats.maxHp
                const lowestRatio = lowest.stats.hp / lowestStats.maxHp
                return hRatio < lowestRatio ? h : lowest
            })
            return [mostWounded]
        }

        case 'all-allies':
            return aliveHeroes

        default:
            return [hero]
    }
}

/**
 * Select buff targets based on effect target
 */
function selectBuffTargets(
    effect: AbilityEffect,
    hero: Hero,
    party: (Hero | null)[]
): Hero[] {
    const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)

    switch (effect.target) {
        case 'self':
            return [hero]

        case 'ally': {
            const others = aliveHeroes.filter(h => h.id !== hero.id)
            return others.length > 0 ? [others[0]] : [hero]
        }

        case 'all-allies':
            return aliveHeroes

        default:
            return [hero]
    }
}

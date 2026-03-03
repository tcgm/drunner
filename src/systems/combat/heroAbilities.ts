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
import { resolveAbilityTargets } from './targetingResolver'
import { applyBurningDot, applyDotEffect } from './effects'

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
    // heroStats already includes combatEffects (via calculateTotalStats), so scaling
    // automatically benefits from active buffs without a separate applyStatModifiers call.
    let effectiveValue = effect.value
    if (effect.scaling) {
        const rawStat = heroStats[effect.scaling.stat as keyof Stats]
        const baseStatValue = (typeof rawStat === 'number' ? rawStat : 0)
        effectiveValue += Math.round(baseStatValue * effect.scaling.ratio)
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
            // Apply per-ability DoT if defined (new dot property)
            if (effect.dot && effect.targeting.side === 'enemy') {
                // Scale the dot damage if the dot has its own scaling config
                let dotDamage = effect.dot.damage
                if (effect.dot.scaling) {
                    const rawStat = heroStats[effect.dot.scaling.stat as keyof typeof heroStats]
                    const statValue = typeof rawStat === 'number' ? rawStat : 0
                    dotDamage += Math.floor(statValue * effect.dot.scaling.ratio)
                }
                const scaledDot = { ...effect.dot, damage: dotDamage }
                const totalDmgPerTurn = applyDotEffect(combatState, scaledDot)
                result.effects.push({
                    type: 'status',
                    target: 'boss',
                    description: `${hero.name}'s ${ability.name} afflicts the boss with ${effect.dot.name}! ${totalDmgPerTurn} dmg/turn`,
                })
            // Legacy fallback: burnStacks uses global BURN_STACK_DAMAGE per stack
            } else if (effect.burnStacks && effect.burnStacks > 0 && effect.targeting.side === 'enemy') {
                const totalDmgPerTurn = applyBurningDot(combatState, effect.burnStacks)
                result.effects.push({
                    type: 'status',
                    target: 'boss',
                    description: `${hero.name}'s ${ability.name} ignites the boss! Burning: ${totalDmgPerTurn} dmg/turn`,
                })
            }
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
            processSpecialEffect(
                hero,
                effectiveValue,
                effect,
                ability,
                combatState,
                party,
                result
            )
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

    if (effect.targeting.side === 'enemy') {
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
            combatState.maxHp,
            combatState.activeEffects
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
    const targets = resolveAbilityTargets(effect.targeting, hero, party).heroes

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
    const targets = resolveAbilityTargets(effect.targeting, hero, party).heroes
    const duration = effect.duration || 3

    for (const target of targets) {
        if (!target.combatEffects) {
            target.combatEffects = []
        }

        target.combatEffects.push({
            id: `buff-${Date.now()}-${target.id}`,
            type: 'buff',
            name: `Buff`,
            stat: effect.stat,
            value,
            duration,
            target: target.id,
        })

        result.effects.push({
            type: 'buff',
            target: target.id,
            value,
            description: `${target.name} gained +${value} ${effect.stat || 'stat'}!`,
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

    if (effect.targeting.side === 'enemy') {
        // Debuff boss
        combatState.activeEffects.push({
            id: `debuff-${Date.now()}`,
            type: 'debuff',
            name: effect.stat ? `${effect.stat} debuff` : 'Debuff',
            stat: effect.stat,
            value: -value,
            duration,
            target: 'boss',
        })

        result.effects.push({
            type: 'debuff',
            target: 'boss',
            value,
            description: effect.stat
                ? `Boss's ${effect.stat} reduced by ${value} for ${duration} turns!`
                : `Boss was debuffed for ${duration} turns!`,
        })
    }
}

/**
 * Process special ability effects (case-by-case per ability id)
 */
function processSpecialEffect(
    hero: Hero,
    value: number,
    effect: AbilityEffect,
    ability: Ability,
    combatState: BossCombatState,
    _party: (Hero | null)[],
    result: HeroActionResult
): void {
    const heroStats = calculateTotalStats(hero)

    switch (ability.id) {
        case 'taunt': {
            // Duration comes from ability definition; defense bonus scales with primary stat
            const primaryStat = (hero.class.primaryStats?.[0]) ?? 'defense'
            const primaryStatValue = (heroStats[primaryStat as keyof Stats] as number) ?? 0

            const duration = effect.duration || 2
            // Defense bonus: 20% of primary stat value
            const defenseBonus = Math.round(primaryStatValue * 0.2)

            if (!hero.combatEffects) hero.combatEffects = []
            // Replace any existing taunt so it doesn't stack
            hero.combatEffects = hero.combatEffects.filter(e => e.name !== 'Taunting')

            hero.combatEffects.push({
                id: `taunt-${Date.now()}-${hero.id}`,
                type: 'buff',
                name: 'Taunting',
                stat: 'defense',
                value: defenseBonus,
                duration,
                target: hero.id,
            })

            result.effects.push({
                type: 'buff',
                target: hero.id,
                value: defenseBonus,
                description: `${hero.name} taunts the boss! Boss will focus attacks on them for ${duration} turns! (+${defenseBonus} defense)`,
            })
            break
        }

        case 'drain-life': {
            // Damage boss, then heal self for 50% of damage dealt
            const scaledBossStats = recalculateDynamicBossStats(
                {
                    baseHp: 0,
                    baseAttack: combatState.baseStats.attack,
                    baseDefense: combatState.baseStats.defense,
                    baseSpeed: combatState.baseStats.speed,
                    baseLuck: combatState.baseStats.luck,
                },
                combatState.floor,
                combatState.depth,
                combatState.combatDepth,
                combatState.currentHp,
                combatState.maxHp,
                combatState.activeEffects
            )
            const finalDamage = applyDefenseReduction(value, scaledBossStats.defense)
            const actualDamage = Math.max(1, finalDamage)
            combatState.currentHp = Math.max(0, combatState.currentHp - actualDamage)
            result.damage = (result.damage ?? 0) + actualDamage

            // Heal self for 50% of damage dealt
            const healAmount = Math.round(actualDamage * 0.5)
            const maxPossibleHeal = Math.max(0, heroStats.maxHp - hero.stats.hp)
            const actualHeal = Math.min(healAmount, maxPossibleHeal)
            hero.stats.hp += actualHeal
            result.healing = (result.healing ?? 0) + actualHeal

            result.effects.push({
                type: 'damage',
                target: 'boss',
                value: actualDamage,
                description: `${hero.name} drains ${actualDamage} life from the boss, healing for ${actualHeal} HP!`,
            })
            break
        }

        case 'summon-skeleton': {
            // Buff caster's attack (skeleton fights alongside)
            const atkBonus = Math.max(5, value)
            const duration = effect.duration || 5

            if (!hero.combatEffects) hero.combatEffects = []
            // Replace existing skeleton aid (no stacking)
            hero.combatEffects = hero.combatEffects.filter(e => e.name !== 'Skeletal Aid')

            hero.combatEffects.push({
                id: `skeleton-${Date.now()}-${hero.id}`,
                type: 'buff',
                name: 'Skeletal Aid',
                stat: 'attack',
                value: atkBonus,
                duration,
                target: hero.id,
            })

            result.effects.push({
                type: 'buff',
                target: hero.id,
                value: atkBonus,
                description: `${hero.name} summons a skeleton to fight alongside! +${atkBonus} attack for ${duration} turns!`,
            })
            break
        }

        case 'track': {
            // Expose boss weakness  -  apply a defense debuff
            const weaknessAmount = Math.max(3, Math.round(value) || 5)
            const duration = 2

            combatState.activeEffects.push({
                id: `track-${Date.now()}`,
                type: 'debuff',
                name: 'Exposed',
                stat: 'defense',
                value: -weaknessAmount,
                duration,
                target: 'boss',
            })

            result.effects.push({
                type: 'debuff',
                target: 'boss',
                value: weaknessAmount,
                description: `${hero.name} tracks the boss's weakness! Boss defense -${weaknessAmount} for ${duration} turns!`,
            })
            break
        }

        case 'poison-blade': {
            // If the ability defines a dot, honour its config; otherwise derive from value/duration
            const baseDot = effect.dot ?? {
                name: 'Poisoned',
                damage: Math.max(3, value),
                duration: effect.duration || 3,
                stacking: 'replace' as const,
            }

            // Apply dot scaling if defined (same pattern as the generic 'damage' handler)
            let dotDamage = baseDot.damage
            if (baseDot.scaling) {
                const rawStat = heroStats[baseDot.scaling.stat as keyof typeof heroStats]
                const statValue = typeof rawStat === 'number' ? rawStat : 0
                dotDamage += Math.floor(statValue * baseDot.scaling.ratio)
            }
            const scaledDot = { ...baseDot, damage: Math.max(1, dotDamage) }
            const totalPoison = applyDotEffect(combatState, scaledDot)

            result.effects.push({
                type: 'status',
                target: 'boss',
                value: totalPoison,
                description: `${hero.name} poisons the boss! ${totalPoison} damage per turn for ${scaledDot.duration} turns!`,
            })
            break
        }

        default:
            result.effects.push({
                type: 'special',
                target: hero.id,
                description: `${hero.name} uses ${ability.name}!`,
            })
    }
}

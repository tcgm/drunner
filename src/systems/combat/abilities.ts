/**
 * Boss Combat System - Boss Ability Execution
 * 
 * Handles boss ability triggers and execution
 */

import type { Hero, BossCombatState, BossAbility, AbilityEffect } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'
import { applyDefenseReduction } from '@/utils/defenseUtils'
import { recalculateDynamicBossStats } from './bossStats'

export interface AbilityExecutionResult {
    ability: BossAbility
    executed: boolean
    effects: Array<{
        type: string
        target: string[]
        value?: number
        description: string
    }>
}

/**
 * Check which abilities should trigger this turn
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Array of abilities that should execute
 */
export function checkAbilityTriggers(
    combatState: BossCombatState,
    party: (Hero | null)[]
): BossAbility[] {
    const triggeredAbilities: BossAbility[] = []

    for (const ability of combatState.abilities) {
        // Check if on cooldown
        const cooldownRemaining = combatState.abilityCooldowns.get(ability.id) || 0
        if (cooldownRemaining > 0) {
            continue
        }

        // Check trigger type
        let shouldTrigger = false

        switch (ability.trigger) {
            case 'always':
                shouldTrigger = true
                break

            case 'onTurnStart':
                shouldTrigger = true
                break

            case 'onHpThreshold':
                if (ability.hpThreshold !== undefined) {
                    const hpPercent = combatState.currentHp / combatState.maxHp
                    const wasAboveThreshold = ability.lastUsed === -999 // Never used
                    shouldTrigger = hpPercent <= ability.hpThreshold && wasAboveThreshold
                }
                break

            case 'onPhaseChange':
                if (ability.phase !== undefined) {
                    shouldTrigger = combatState.currentPhase === ability.phase &&
                        ability.lastUsed < combatState.combatDepth
                }
                break

            case 'onPlayerAction':
                // TODO: Implement player action triggers
                break
        }

        if (shouldTrigger) {
            triggeredAbilities.push(ability)
        }
    }

    return triggeredAbilities
}

/**
 * Execute a boss ability
 * 
 * @param ability - Ability to execute
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Execution result
 */
export function executeAbility(
    ability: BossAbility,
    combatState: BossCombatState,
    party: (Hero | null)[]
): AbilityExecutionResult {
    const result: AbilityExecutionResult = {
        ability,
        executed: true,
        effects: [],
    }

    // Process each effect
    for (const effect of ability.effects) {
        const effectResult = executeAbilityEffect(effect, combatState, party, ability.name, ability.id)
        result.effects.push(effectResult)
    }

    // Set cooldown
    combatState.abilityCooldowns.set(ability.id, ability.cooldown)
    ability.lastUsed = combatState.combatDepth

    return result
}

/**
 * Execute a single ability effect
 */
function executeAbilityEffect(
    effect: AbilityEffect,
    combatState: BossCombatState,
    party: (Hero | null)[],
    abilityName: string,
    abilityId: string
): {
    type: string
    target: string[]
    value?: number
    description: string
} {
    const targets: string[] = []
    let description = ''

    switch (effect.type) {
        case 'damage': {
            const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
            const targetHeroes = selectEffectTargets(effect, aliveHeroes)

            for (const hero of targetHeroes) {
                const heroStats = calculateTotalStats(hero)
                let damage = effect.value || 0

                // Apply scaling if present
                if (effect.scaling) {
                    const scalingStat = heroStats[effect.scaling.stat] || 0
                    damage += Math.round(scalingStat * effect.scaling.ratio)
                }

                // Apply defense
                const finalDamage = applyDefenseReduction(damage, heroStats.defense)
                hero.stats.hp = Math.max(0, hero.stats.hp - finalDamage)

                if (hero.stats.hp === 0) {
                    hero.isAlive = false
                }

                targets.push(hero.id)
            }

            description = `${targetHeroes.map(h => h.name).join(', ')} took ${effect.value} damage!`
            break
        }

        case 'heal': {
            if (effect.target === 'self') {
                const healAmount = effect.value || 0
                combatState.currentHp = Math.min(
                    combatState.currentHp + healAmount,
                    combatState.maxHp
                )
                targets.push('boss')
                description = `Boss healed for ${healAmount} HP!`
            }
            break
        }

        case 'buff': {
            if (effect.target === 'self') {
                let buffValue = effect.value || 0
                
                // Special handling for ENRAGE - double the boss's current attack
                if (abilityId === 'enrage' && effect.stat === 'attack') {
                    const currentBossStats = recalculateDynamicBossStats(
                        combatState.baseStats,
                        combatState.floor,
                        combatState.depth,
                        combatState.combatDepth,
                        combatState.currentHp,
                        combatState.maxHp,
                        combatState.activeEffects
                    )
                    buffValue = currentBossStats.attack // Add current attack to double it
                }
                
                combatState.activeEffects.push({
                    id: `buff-${Date.now()}-boss`,
                    type: 'buff',
                    name: abilityName,
                    stat: effect.stat,
                    value: buffValue,
                    duration: effect.duration || 3,
                    target: 'boss',
                })
                
                targets.push('boss')
                description = `Boss gained +${buffValue} ${effect.stat || 'stat'}!`
            }
            break
        }

        case 'debuff': {
            const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)
            const targetHeroes = selectEffectTargets(effect, aliveHeroes)

            for (const hero of targetHeroes) {
                if (!hero.combatEffects) {
                    hero.combatEffects = []
                }
                
                hero.combatEffects.push({
                    id: `debuff-${Date.now()}-${hero.id}`,
                    type: 'debuff',
                    name: `Debuff`,
                    stat: effect.stat,
                    value: -(effect.value || 0),
                    duration: effect.duration || 2,
                    target: hero.id,
                })
                
                targets.push(hero.id)
            }

            description = `${targetHeroes.map(h => h.name).join(', ')} lost ${effect.value} ${effect.stat || 'stat'}!`
            break
        }

        case 'special': {
            // Custom special effects can be implemented here
            description = `${abilityName} activated!`
            break
        }
    }

    return {
        type: effect.type,
        target: targets,
        value: effect.value,
        description,
    }
}

/**
 * Select targets for an ability effect
 */
function selectEffectTargets(
    effect: AbilityEffect,
    aliveHeroes: Hero[]
): Hero[] {
    if (aliveHeroes.length === 0) {
        return []
    }

    switch (effect.target) {
        case 'all-allies':
        case 'all-enemies':
            return aliveHeroes

        case 'enemy': {
            const index = Math.floor(Math.random() * aliveHeroes.length)
            return [aliveHeroes[index]]
        }

        case 'ally':
        case 'self':
            return []

        default:
            return []
    }
}

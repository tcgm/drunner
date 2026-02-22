/**
 * Boss Combat System - Effect and Cooldown Tracking
 * 
 * Manages buffs, debuffs, status effects, and cooldowns during combat
 */

import type { Hero, BossCombatState, CombatEffect } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'

/**
 * Decrement all cooldowns (abilities and items)
 * 
 * @param combatState - Current combat state
 */
export function decrementCooldowns(combatState: BossCombatState): void {
    // Decrement ability cooldowns
    for (const [id, cooldown] of combatState.abilityCooldowns.entries()) {
        if (cooldown > 0) {
            combatState.abilityCooldowns.set(id, cooldown - 1)
        }
    }

    // Decrement item cooldowns
    for (const [id, cooldown] of combatState.itemCooldowns.entries()) {
        if (cooldown > 0) {
            combatState.itemCooldowns.set(id, cooldown - 1)
        }
    }
}

/**
 * Process buff/debuff duration decrements
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 */
export function processEffectDurations(
    combatState: BossCombatState,
    party: (Hero | null)[]
): void {
    // Process boss effects
    combatState.activeEffects = combatState.activeEffects.filter(effect => {
        if (effect.duration === 999) {
            return true // Permanent effect
        }
        effect.duration--
        return effect.duration > 0
    })

    // Process hero effects
    for (const hero of party) {
        if (hero && hero.combatEffects) {
            hero.combatEffects = hero.combatEffects.filter(effect => {
                if (effect.duration === 999) {
                    return true
                }
                effect.duration--
                return effect.duration > 0
            })
        }
    }
}

/**
 * Process status effects (poison, regen, burn, etc.)
 * 
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Array of status effect results
 */
export function processStatusEffects(
    combatState: BossCombatState,
    party: (Hero | null)[]
): Array<{
    effectName: string
    target: string
    damage?: number
    healing?: number
}> {
    const results: Array<{
        effectName: string
        target: string
        damage?: number
        healing?: number
    }> = []

    // Process boss status effects
    for (const effect of combatState.activeEffects.filter(e => e.type === 'status')) {
        if (!effect.behavior) continue

        const combatant = {
            id: 'boss',
            type: 'boss' as const,
            speed: 0,
            isAlive: true,
        }

        // Fire custom callback if present
        if (effect.behavior.onRoundEnd) {
            effect.behavior.onRoundEnd(combatant, combatState)
        }

        // Apply damage/healing to boss HP and track for display
        if (effect.behavior.type === 'damagePerTurn' && effect.behavior.damageAmount) {
            const damage = effect.behavior.damageAmount
            combatState.currentHp = Math.max(0, combatState.currentHp - damage)
            results.push({ effectName: effect.name, target: 'boss', damage })
        } else if (effect.behavior.type === 'healPerTurn' && effect.behavior.healAmount) {
            const healing = effect.behavior.healAmount
            combatState.currentHp = Math.min(combatState.maxHp, combatState.currentHp + healing)
            results.push({ effectName: effect.name, target: 'boss', healing })
        }
    }

    // Process hero status effects
    for (const hero of party) {
        if (!hero || !hero.combatEffects) {
            continue
        }

        for (const effect of hero.combatEffects.filter(e => e.type === 'status')) {
            if (!effect.behavior) continue

            const combatant = {
                id: hero.id,
                type: 'hero' as const,
                speed: hero.stats.speed,
                isAlive: hero.isAlive,
            }

            // Fire custom callback if present
            if (effect.behavior.onRoundEnd) {
                effect.behavior.onRoundEnd(combatant, combatState)
            }

            if (effect.behavior.type === 'damagePerTurn' && effect.behavior.damageAmount) {
                const damage = effect.behavior.damageAmount
                hero.stats.hp = Math.max(0, hero.stats.hp - damage)
                if (hero.stats.hp === 0) {
                    hero.isAlive = false
                }
                results.push({ effectName: effect.name, target: hero.name, damage })
            } else if (effect.behavior.type === 'healPerTurn' && effect.behavior.healAmount) {
                const healing = effect.behavior.healAmount
                const maxHp = calculateTotalStats(hero).maxHp
                hero.stats.hp = Math.min(hero.stats.hp + healing, maxHp)
                results.push({ effectName: effect.name, target: hero.name, healing })
            }
        }
    }

    return results
}

/**
 * Apply stat modifiers from combat effects
 * 
 * @param baseStat - Base stat value
 * @param effects - Active combat effects
 * @param statName - Name of stat to modify
 * @returns Modified stat value (minimum 0)
 */
export function applyStatModifiers(
    baseStat: number,
    effects: CombatEffect[] | undefined,
    statName: string
): number {
    if (!effects || effects.length === 0) {
        return baseStat
    }

    let modifier = 0
    for (const effect of effects) {
        if (effect.stat === statName && effect.value !== undefined) {
            modifier += effect.value
        }
    }

    return Math.max(0, baseStat + modifier)
}

/**
 * Apply passive boss healing
 * 
 * @param combatState - Current combat state
 * @returns Amount healed
 */
export function applyPassiveHealing(combatState: BossCombatState): number {
    if (!combatState.healPerTurn || combatState.healPerTurn <= 0) {
        return 0
    }

    const healAmount = combatState.healPerTurn
    const oldHp = combatState.currentHp
    combatState.currentHp = Math.min(
        combatState.currentHp + healAmount,
        combatState.maxHp
    )

    return combatState.currentHp - oldHp
}

/** Damage dealt per individual burning stack per turn */
export const BURN_STACK_DAMAGE = 15

/**
 * Apply stacking Burning DoT to the boss.
 *
 * If the boss already has a "Burning" status effect the damage is increased
 * by `stacks * BURN_STACK_DAMAGE` and the duration is refreshed to at least
 * 3 rounds.  Otherwise a new "Burning" status effect is created.
 *
 * @param combatState - Current combat state (boss side)
 * @param stacks      - Number of burn stacks to apply (each = BURN_STACK_DAMAGE dmg/turn)
 * @returns The total burning damage per turn after this application
 */
export function applyBurningDot(
    combatState: BossCombatState,
    stacks: number = 1
): number {
    const addedDamage = stacks * BURN_STACK_DAMAGE

    const existing = combatState.activeEffects.find(
        (e) => e.type === 'status' && e.name === 'Burning'
    )

    if (existing && existing.behavior?.type === 'damagePerTurn') {
        existing.behavior.damageAmount = (existing.behavior.damageAmount ?? 0) + addedDamage
        existing.duration = Math.max(existing.duration, 3)
        return existing.behavior.damageAmount
    }

    combatState.activeEffects.push({
        id: `burning-${Date.now()}`,
        type: 'status',
        name: 'Burning',
        duration: 3,
        target: 'boss',
        behavior: {
            type: 'damagePerTurn',
            damageAmount: addedDamage,
        },
    })

    return addedDamage
}

/**
 * Boss Combat System - Effect and Cooldown Tracking
 * 
 * Manages buffs, debuffs, status effects, and cooldowns during combat
 */

import type { Hero, BossCombatState, CombatEffect } from '@/types'

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
        if (effect.behavior?.onRoundEnd) {
            // Execute custom behavior
            const combatant = {
                id: 'boss',
                type: 'boss' as const,
                speed: 0,
                isAlive: true,
            }

            effect.behavior.onRoundEnd(combatant, combatState)

            // Track damage/healing for display
            if (effect.behavior.type === 'damagePerTurn' && effect.behavior.damageAmount) {
                results.push({
                    effectName: effect.name,
                    target: 'boss',
                    damage: effect.behavior.damageAmount,
                })
            } else if (effect.behavior.type === 'healPerTurn' && effect.behavior.healAmount) {
                results.push({
                    effectName: effect.name,
                    target: 'boss',
                    healing: effect.behavior.healAmount,
                })
            }
        }
    }

    // Process hero status effects
    for (const hero of party) {
        if (!hero || !hero.combatEffects) {
            continue
        }

        for (const effect of hero.combatEffects.filter(e => e.type === 'status')) {
            if (effect.behavior?.onRoundEnd) {
                const combatant = {
                    id: hero.id,
                    type: 'hero' as const,
                    speed: hero.stats.speed,
                    isAlive: hero.isAlive,
                }

                effect.behavior.onRoundEnd(combatant, combatState)

                // Track damage/healing for display
                if (effect.behavior.type === 'damagePerTurn' && effect.behavior.damageAmount) {
                    // Apply damage to hero
                    const damage = effect.behavior.damageAmount
                    hero.stats.hp = Math.max(0, hero.stats.hp - damage)
                    if (hero.stats.hp === 0) {
                        hero.isAlive = false
                    }

                    results.push({
                        effectName: effect.name,
                        target: hero.name,
                        damage,
                    })
                } else if (effect.behavior.type === 'healPerTurn' && effect.behavior.healAmount) {
                    const healing = effect.behavior.healAmount
                    hero.stats.hp = Math.min(hero.stats.hp + healing, hero.stats.maxHp)

                    results.push({
                        effectName: effect.name,
                        target: hero.name,
                        healing,
                    })
                }
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
    statName: 'attack' | 'defense' | 'speed' | 'luck'
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

/**
 * Boss Combat System - Item Usage and Consumables
 * 
 * Handles item usage during combat with action economy
 */

import type { Hero, BossCombatState, Consumable, ConsumableEffect } from '@/types'
import type { HeroActionResult } from './heroActions'
import { calculateTotalStats } from '@/utils/statCalculator'

export interface ConsumableUsageResult extends HeroActionResult {
    actionCost: number // 1.0 for revive, 0.33 for other consumables
    isRevive: boolean
}

/**
 * Check if consumable is a revive item
 * 
 * @param consumable - Consumable to check
 * @returns True if consumable has revive effect
 */
export function isReviveConsumable(consumable: Consumable): boolean {
    return consumable.effects.some(e => e.type === 'revive')
}

/**
 * Calculate action cost for consumable
 * 
 * @param consumable - Consumable to use
 * @returns Action cost (1.0 for revive, 0.33 for others)
 */
export function getConsumableActionCost(consumable: Consumable): number {
    return isReviveConsumable(consumable) ? 1.0 : 0.33
}

/**
 * Use consumable during combat
 * 
 * @param hero - Hero using the item
 * @param consumable - Consumable to use
 * @param slotKey - Slot key to consume from
 * @param combatState - Current combat state
 * @param party - Party of heroes
 * @returns Usage result
 */
export function useConsumable(
    hero: Hero,
    consumable: Consumable,
    slotKey: string,
    combatState: BossCombatState,
    party: (Hero | null)[]
): ConsumableUsageResult {
    const isRevive = isReviveConsumable(consumable)
    const actionCost = getConsumableActionCost(consumable)

    const result: ConsumableUsageResult = {
        action: {
            type: 'useItem',
            heroId: hero.id,
            item: consumable,
            itemSlot: slotKey,
        },
        success: true,
        effects: [],
        message: `${hero.name} uses ${consumable.name}!`,
        actionCost,
        isRevive,
    }

    // Process each effect
    for (const effect of consumable.effects) {
        processConsumableEffect(hero, effect, combatState, party, result)
    }

    // Consume the item (decrement stack or remove)
    if (consumable.stackable && consumable.stackCount && consumable.stackCount > 1) {
        consumable.stackCount--
    } else {
        // Remove from slot
        hero.slots[slotKey] = null
    }

    return result
}

/**
 * Process a single consumable effect
 */
function processConsumableEffect(
    hero: Hero,
    effect: ConsumableEffect,
    combatState: BossCombatState,
    party: (Hero | null)[],
    result: ConsumableUsageResult
): void {
    switch (effect.type) {
        case 'heal':
            processHealEffect(hero, effect, party, result)
            break

        case 'hot': // Heal over time
            processHotEffect(hero, effect, party, result, combatState)
            break

        case 'buff':
            processBuffEffect(hero, effect, party, result, combatState)
            break

        case 'revive':
            processReviveEffect(hero, effect, party, result)
            break

        case 'cleanse':
            processCleanseEffect(hero, effect, party, result)
            break

        case 'damage':
            processDamageEffect(hero, effect, combatState, result)
            break

        case 'special':
            // Special effects handled case-by-case
            result.effects.push({
                type: 'special',
                target: hero.id,
                description: 'Special effect activated!',
            })
            break
    }
}

/**
 * Process heal effect
 */
function processHealEffect(
    hero: Hero,
    effect: ConsumableEffect,
    party: (Hero | null)[],
    result: ConsumableUsageResult
): void {
    const targets = selectConsumableTargets(effect, hero, party)
    const healAmount = effect.value || 0

    for (const target of targets) {
        const actualHeal = Math.min(healAmount, target.stats.maxHp - target.stats.hp)
        target.stats.hp += actualHeal

        result.healing = (result.healing || 0) + actualHeal
        result.effects.push({
            type: 'heal',
            target: target.id,
            value: actualHeal,
            description: `${target.name} healed for ${actualHeal} HP!`,
        })
    }
}

/**
 * Process heal over time effect
 */
function processHotEffect(
    hero: Hero,
    effect: ConsumableEffect,
    party: (Hero | null)[],
    result: ConsumableUsageResult,
    combatState: BossCombatState
): void {
    const targets = selectConsumableTargets(effect, hero, party)
    const healPerTick = effect.value || 0
    const duration = effect.duration || 3

    for (const target of targets) {
        if (!target.combatEffects) {
            target.combatEffects = []
        }

        target.combatEffects.push({
            id: `hot-${Date.now()}-${target.id}`,
            type: 'status',
            name: 'Regenerating',
            duration,
            target: target.id,
            behavior: {
                type: 'healPerTurn',
                healAmount: healPerTick,
                onRoundEnd: (combatant, state) => {
                    // Healing handled by effect processing system
                },
            },
        })

        result.effects.push({
            type: 'hot',
            target: target.id,
            value: healPerTick,
            description: `${target.name} will regenerate ${healPerTick} HP per round for ${duration} rounds!`,
        })
    }
}

/**
 * Process buff effect
 */
function processBuffEffect(
    hero: Hero,
    effect: ConsumableEffect,
    party: (Hero | null)[],
    result: ConsumableUsageResult,
    combatState: BossCombatState
): void {
    const targets = selectConsumableTargets(effect, hero, party)
    const buffValue = effect.value || 0
    const duration = effect.duration || 3

    for (const target of targets) {
        if (!target.combatEffects) {
            target.combatEffects = []
        }

        if (effect.stat) {
            target.combatEffects.push({
                id: `buff-${Date.now()}-${target.id}`,
                type: 'buff',
                name: `${effect.stat} boost`,
                stat: effect.stat as 'attack' | 'defense' | 'speed' | 'luck' | 'hp',
                value: buffValue,
                duration,
                target: target.id,
            })

            result.effects.push({
                type: 'buff',
                target: target.id,
                value: buffValue,
                description: `${target.name} gained +${buffValue} ${effect.stat} for ${duration} rounds!`,
            })
        }
    }
}

/**
 * Process revive effect
 */
function processReviveEffect(
    hero: Hero,
    effect: ConsumableEffect,
    party: (Hero | null)[],
    result: ConsumableUsageResult
): void {
    const deadHeroes = party.filter((h): h is Hero => h !== null && !h.isAlive)

    if (deadHeroes.length === 0) {
        result.effects.push({
            type: 'revive',
            target: 'none',
            description: 'No heroes to revive!',
        })
        return
    }

    // Revive the first dead hero (or specific target logic)
    const target = deadHeroes[0]
    const reviveHp = effect.value || Math.round(target.stats.maxHp * 0.5)

    target.isAlive = true
    target.stats.hp = Math.min(reviveHp, target.stats.maxHp)

    result.effects.push({
        type: 'revive',
        target: target.id,
        value: reviveHp,
        description: `${target.name} has been revived with ${reviveHp} HP!`,
    })
}

/**
 * Process cleanse effect
 */
function processCleanseEffect(
    hero: Hero,
    effect: ConsumableEffect,
    party: (Hero | null)[],
    result: ConsumableUsageResult
): void {
    const targets = selectConsumableTargets(effect, hero, party)

    for (const target of targets) {
        if (target.combatEffects) {
            const debuffsRemoved = target.combatEffects.filter(e => e.type === 'debuff').length
            target.combatEffects = target.combatEffects.filter(e => e.type !== 'debuff')

            result.effects.push({
                type: 'cleanse',
                target: target.id,
                description: `${target.name} had ${debuffsRemoved} debuff(s) removed!`,
            })
        }
    }
}

/**
 * Process damage effect (offensive consumables)
 */
function processDamageEffect(
    hero: Hero,
    effect: ConsumableEffect,
    combatState: BossCombatState,
    result: ConsumableUsageResult
): void {
    const damage = effect.value || 0
    combatState.currentHp = Math.max(0, combatState.currentHp - damage)

    result.damage = damage
    result.effects.push({
        type: 'damage',
        target: 'boss',
        value: damage,
        description: `Boss took ${damage} damage!`,
    })
}

/**
 * Select targets for consumable effect
 */
function selectConsumableTargets(
    effect: ConsumableEffect,
    hero: Hero,
    party: (Hero | null)[]
): Hero[] {
    const aliveHeroes = party.filter((h): h is Hero => h !== null && h.isAlive)

    switch (effect.target) {
        case 'self':
            return [hero]

        case 'ally': {
            // Select most wounded ally
            const others = aliveHeroes.filter(h => h.id !== hero.id)
            if (others.length === 0) return [hero]

            return [others.reduce((lowest, h) =>
                (h.stats.hp / h.stats.maxHp) < (lowest.stats.hp / lowest.stats.maxHp)
                    ? h
                    : lowest
            )]
        }

        case 'all-allies':
            return aliveHeroes

        default:
            return [hero]
    }
}

/**
 * Get list of usable consumables for hero
 * 
 * @param hero - Hero to check
 * @returns Array of consumables with their slot keys
 */
export function getUsableConsumables(hero: Hero): Array<{ consumable: Consumable; slotKey: string }> {
    const usableConsumables: Array<{ consumable: Consumable; slotKey: string }> = []

    for (const [slotKey, item] of Object.entries(hero.slots)) {
        if (item && 'consumableType' in item && item.usableInCombat) {
            usableConsumables.push({
                consumable: item as Consumable,
                slotKey,
            })
        }
    }

    return usableConsumables
}

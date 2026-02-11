/**
 * Boss Combat System - Hero Actions
 * 
 * Defines and handles hero actions during combat
 */

import type { Hero, BossCombatState, Ability, Consumable } from '@/types'
import { calculateTotalStats } from '@/utils/statCalculator'
import { applyDefenseReduction } from '@/utils/defenseUtils'

export type HeroActionType =
    | 'attack'
    | 'defend'
    | 'useAbility'
    | 'useItem'
    | 'flee'

export interface HeroAction {
    type: HeroActionType
    heroId: string
    ability?: Ability // For useAbility
    item?: Consumable // For useItem
    itemSlot?: string // For useItem (which slot to consume from)
}

export interface HeroActionResult {
    action: HeroAction
    success: boolean
    damage?: number
    healing?: number
    effects: Array<{
        type: string
        target: string
        value?: number
        description: string
    }>
    message: string
}

/**
 * Execute hero attack action
 * 
 * @param hero - Hero performing attack
 * @param combatState - Current combat state
 * @returns Action result
 */
export function executeAttack(
    hero: Hero,
    combatState: BossCombatState
): HeroActionResult {
    const heroStats = calculateTotalStats(hero)

    // Calculate base damage
    let baseDamage = heroStats.attack

    // Crit check
    const critChance = heroStats.luck / 1000 // 1% per 10 luck
    const isCrit = Math.random() < critChance
    if (isCrit) {
        baseDamage = Math.round(baseDamage * 2)
    }

    // Get boss defense (with current scaling)
    const bossDefense = combatState.baseStats.defense

    // Apply defense reduction
    const finalDamage = applyDefenseReduction(baseDamage, bossDefense)
    const actualDamage = Math.max(1, finalDamage)

    // Apply damage to boss
    combatState.currentHp = Math.max(0, combatState.currentHp - actualDamage)

    return {
        action: {
            type: 'attack',
            heroId: hero.id,
        },
        success: true,
        damage: actualDamage,
        effects: [
            {
                type: 'bossDamage',
                target: 'boss',
                value: actualDamage,
                description: `${hero.name} dealt ${actualDamage} damage${isCrit ? ' (CRIT!)' : ''}!`,
            },
        ],
        message: `${hero.name} attacks the boss!${isCrit ? ' Critical hit!' : ''}`,
    }
}

/**
 * Execute hero defend action
 * 
 * Increases defense for the rest of this round
 * 
 * @param hero - Hero performing defend
 * @param combatState - Current combat state
 * @returns Action result
 */
export function executeDefend(
    hero: Hero,
    combatState: BossCombatState
): HeroActionResult {
    const heroStats = calculateTotalStats(hero)
    const defenseBonus = Math.round(heroStats.defense * 0.5) // +50% defense

    // Add temporary defense buff (expires at round end)
    if (!hero.combatEffects) {
        hero.combatEffects = []
    }

    hero.combatEffects.push({
        id: `defend-${Date.now()}`,
        type: 'buff',
        name: 'Defending',
        stat: 'defense',
        value: defenseBonus,
        duration: 1, // Lasts 1 round
        target: hero.id,
    })

    return {
        action: {
            type: 'defend',
            heroId: hero.id,
        },
        success: true,
        effects: [
            {
                type: 'buff',
                target: hero.id,
                value: defenseBonus,
                description: `${hero.name} gained +${defenseBonus} defense!`,
            },
        ],
        message: `${hero.name} takes a defensive stance!`,
    }
}

/**
 * Execute flee action
 * 
 * Exits the dungeon, keeping gold and equipped items, losing inventory
 * 
 * @param party - Party of heroes
 * @param combatState - Current combat state
 * @returns Action result
 */
export function executeFlee(
    party: (Hero | null)[],
    combatState: BossCombatState
): HeroActionResult {
    return {
        action: {
            type: 'flee',
            heroId: 'party',
        },
        success: true,
        effects: [
            {
                type: 'flee',
                target: 'all',
                description: 'The party has fled the dungeon!',
            },
        ],
        message: 'The party retreats from battle and exits the dungeon!',
    }
}

/**
 * Check if hero can perform action
 * 
 * @param hero - Hero to check
 * @param action - Action to perform
 * @param combatState - Current combat state
 * @returns True if action is valid
 */
export function canPerformAction(
    hero: Hero,
    action: HeroAction,
    combatState: BossCombatState
): { valid: boolean; reason?: string } {
    if (!hero.isAlive) {
        return { valid: false, reason: 'Hero is dead' }
    }

    switch (action.type) {
        case 'attack':
        case 'defend':
        case 'flee':
            return { valid: true }

        case 'useAbility':
            if (!action.ability) {
                return { valid: false, reason: 'No ability specified' }
            }

            // Check cooldown
            const abilityCooldown = combatState.abilityCooldowns.get(
                `${hero.id}-${action.ability.id}`
            ) || 0

            if (abilityCooldown > 0) {
                return {
                    valid: false,
                    reason: `Ability on cooldown (${abilityCooldown} rounds remaining)`
                }
            }

            // Check charges
            if (action.ability.charges !== undefined) {
                const chargesUsed = action.ability.chargesUsed || 0
                if (chargesUsed >= action.ability.charges) {
                    return { valid: false, reason: 'No charges remaining' }
                }
            }

            return { valid: true }

        case 'useItem':
            if (!action.item) {
                return { valid: false, reason: 'No item specified' }
            }

            // Check if item is usable in combat
            if (!action.item.usableInCombat) {
                return { valid: false, reason: 'Item cannot be used in combat' }
            }

            // TODO: Check item cooldown if applicable

            return { valid: true }

        default:
            return { valid: false, reason: 'Unknown action type' }
    }
}

/**
 * Boss Combat System - Hero Turn Processing
 * 
 * Orchestrates hero turns and action execution
 */

import type { Hero, BossCombatState, Ability, Consumable } from '@/types'
import type { HeroAction, HeroActionResult } from './heroActions'
import {
    executeAttack,
    executeDefend,
    executeFlee,
    canPerformAction,
} from './heroActions'
import { executeHeroAbility } from './heroAbilities'
import {
    useConsumable,
    getConsumableActionCost,
    isReviveConsumable,
    getUsableConsumables,
    type ConsumableUsageResult,
} from './itemUsage'

export interface HeroTurnContext {
    hero: Hero
    combatState: BossCombatState
    party: (Hero | null)[]
    actionCostUsed: number // Track action overflow
}

export interface HeroTurnResult {
    actions: HeroActionResult[]
    totalActionCost: number
    turnComplete: boolean
    fled: boolean
}

/**
 * Process hero turn with action economy
 * 
 * Allows:
 * - 1 main action (attack, defend, ability, flee)
 * - Up to 3 consumables (1/3 action each)
 * - Revive consumables count as full action
 * - Action overflow allowed
 * 
 * @param context - Hero turn context
 * @param actions - Array of actions to perform
 * @returns Turn result
 */
export function processHeroTurn(
    context: HeroTurnContext,
    actions: HeroAction[]
): HeroTurnResult {
    const result: HeroTurnResult = {
        actions: [],
        totalActionCost: 0,
        turnComplete: false,
        fled: false,
    }
    
    for (const action of actions) {
        // Check if action is valid
        const validation = canPerformAction(context.hero, action, context.combatState)
        if (!validation.valid) {
            result.actions.push({
                action,
                success: false,
                effects: [],
                message: `Cannot perform action: ${validation.reason}`,
            })
            continue
        }
        
        // Execute action based on type
        let actionResult: HeroActionResult | ConsumableUsageResult
        let actionCost = 1.0
        
        switch (action.type) {
            case 'attack':
                actionResult = executeAttack(context.hero, context.combatState)
                break
                
            case 'defend':
                actionResult = executeDefend(context.hero, context.combatState)
                break
                
            case 'useAbility':
                if (!action.ability) {
                    continue
                }
                actionResult = executeHeroAbility(
                    context.hero,
                    action.ability,
                    context.combatState,
                    context.party
                )
                break
                
            case 'useItem':
                if (!action.item || !action.itemSlot) {
                    continue
                }
                actionResult = useConsumable(
                    context.hero,
                    action.item,
                    action.itemSlot,
                    context.combatState,
                    context.party
                )
                actionCost = (actionResult as ConsumableUsageResult).actionCost
                break
                
            case 'flee':
                actionResult = executeFlee(context.party, context.combatState)
                result.fled = true
                result.turnComplete = true
                result.actions.push(actionResult)
                return result // Immediate exit
                
            default:
                continue
        }
        
        result.actions.push(actionResult)
        result.totalActionCost += actionCost
    }
    
    result.turnComplete = true
    return result
}

/**
 * Get available actions for hero
 * 
 * @param hero - Hero to get actions for
 * @param combatState - Current combat state
 * @returns Array of available action types
 */
export function getAvailableActions(
    hero: Hero,
    combatState: BossCombatState
): {
    canAttack: boolean
    canDefend: boolean
    canUseAbility: boolean
    usableAbilities: Ability[]
    canUseItem: boolean
    usableItems: Array<{ consumable: Consumable; slotKey: string }>
    canFlee: boolean
} {
    const usableAbilities = hero.abilities.filter(ability => {
        const action: HeroAction = {
            type: 'useAbility',
            heroId: hero.id,
            ability,
        }
        return canPerformAction(hero, action, combatState).valid
    })
    
    const usableItems = getUsableConsumables(hero)
    
    return {
        canAttack: hero.isAlive,
        canDefend: hero.isAlive,
        canUseAbility: usableAbilities.length > 0,
        usableAbilities,
        canUseItem: usableItems.length > 0,
        usableItems,
        canFlee: true,
    }
}

/**
 * Check if hero can afford action cost
 * 
 * @param currentCost - Current action cost used
 * @param additionalCost - Additional cost to add
 * @returns True if within reasonable overflow limits
 */
export function canAffordActionCost(
    currentCost: number,
    additionalCost: number
): boolean {
    // Allow up to 2.0 total action cost (overflow allowed)
    return (currentCost + additionalCost) <= 2.0
}

/**
 * Calculate consumable action summary
 * 
 * @param consumables - Array of consumables to use
 * @returns Action cost breakdown
 */
export function calculateConsumableActionCost(
    consumables: Consumable[]
): {
    totalCost: number
    reviveCount: number
    otherCount: number
} {
    let totalCost = 0
    let reviveCount = 0
    let otherCount = 0
    
    for (const consumable of consumables) {
        const cost = getConsumableActionCost(consumable)
        totalCost += cost
        
        if (isReviveConsumable(consumable)) {
            reviveCount++
        } else {
            otherCount++
        }
    }
    
    return {
        totalCost,
        reviveCount,
        otherCount,
    }
}

/**
 * Validate action sequence for hero turn
 * 
 * Ensures actions follow the rules:
 * - At most 1 main action (attack, defend, ability)
 * - Any number of consumables (with action cost limits)
 * - Flee ends turn immediately
 * 
 * @param actions - Actions to validate
 * @returns Validation result
 */
export function validateActionSequence(
    actions: HeroAction[]
): { valid: boolean; reason?: string } {
    let mainActionCount = 0
    let totalConsumableCost = 0
    
    for (const action of actions) {
        switch (action.type) {
            case 'attack':
            case 'defend':
            case 'useAbility':
                mainActionCount++
                if (mainActionCount > 1) {
                    return {
                        valid: false,
                        reason: 'Cannot perform more than 1 main action per turn',
                    }
                }
                break
                
            case 'useItem':
                if (action.item) {
                    totalConsumableCost += getConsumableActionCost(action.item)
                }
                break
                
            case 'flee':
                // Flee must be only action
                if (actions.length > 1) {
                    return {
                        valid: false,
                        reason: 'Flee must be the only action',
                    }
                }
                break
        }
    }
    
    // Check total action cost (allow overflow up to 2.0)
    const totalCost = mainActionCount + totalConsumableCost
    if (totalCost > 2.0) {
        return {
            valid: false,
            reason: `Total action cost (${totalCost.toFixed(2)}) exceeds limit (2.0)`,
        }
    }
    
    return { valid: true }
}

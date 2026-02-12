import type { Hero, Ability, AbilityEffect } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { calculateTotalStats } from '@/utils/statCalculator'
import { refreshAbilityFromTemplate } from '@/utils/abilityUtils'

/**
 * Check if an ability can be used at the current floor/depth
 */
export function canUseAbility(
    ability: Ability,
    currentFloor: number,
    currentDepth?: number
): boolean {
    const cooldownType = ability.cooldownType || 'depth' // Default to depth

    if (cooldownType === 'depth') {
        if (ability.lastUsedDepth === undefined || currentDepth === undefined) {
            // Never used before or no depth provided - can use
            return true
        }
        // If lastUsedDepth is higher than current depth, it's stale data from previous run - treat as available
        if (ability.lastUsedDepth > currentDepth) {
            return true
        }
        const depthsSinceLastUse = currentDepth - ability.lastUsedDepth
        return depthsSinceLastUse >= ability.cooldown
    } else {
        if (ability.lastUsedFloor === undefined) {
            // Never used before - can use
            return true
        }
        const floorsSinceLastUse = currentFloor - ability.lastUsedFloor
        return floorsSinceLastUse >= ability.cooldown
    }
}

/**
 * Get remaining cooldown for an ability (floors or depths depending on cooldownType)
 */
export function getRemainingCooldown(
    ability: Ability,
    currentFloor: number,
    currentDepth?: number
): number {
    const cooldownType = ability.cooldownType || 'depth' // Default to depth

    console.log('[CD Debug]', ability.name, '- Type:', cooldownType, 'Floor:', currentFloor, 'Depth:', currentDepth, 'LastUsedFloor:', ability.lastUsedFloor, 'LastUsedDepth:', ability.lastUsedDepth)

    if (cooldownType === 'depth') {
        if (ability.lastUsedDepth === undefined || currentDepth === undefined) {
            return 0
        }
        // If lastUsedDepth is higher than current depth, it's stale data from previous run - no cooldown
        if (ability.lastUsedDepth > currentDepth) {
            return 0
        }
        const depthsSinceLastUse = currentDepth - ability.lastUsedDepth
        const remaining = ability.cooldown - depthsSinceLastUse
        // Cap at max cooldown (safety check for edge cases)
        return Math.min(Math.max(0, remaining), ability.cooldown)
    } else {
        if (ability.lastUsedFloor === undefined) {
            return 0
        }
        const floorsSinceLastUse = currentFloor - ability.lastUsedFloor
        const remaining = ability.cooldown - floorsSinceLastUse
        // Cap at max cooldown (safety check for edge cases)
        return Math.min(Math.max(0, remaining), ability.cooldown)
    }
}

/**
 * Check if hero has charges remaining for an ability
 */
export function hasChargesRemaining(ability: Ability): boolean {
    if (!ability.charges) {
        // No charge limit - always available (only cooldown matters)
        return true
    }

    const used = ability.chargesUsed || 0
    return used < ability.charges
}

/**
 * Use an ability and apply its effects
 * Returns updated hero and party state, plus effect results
 */
export function useAbility(
    hero: Hero,
    abilityId: string,
    currentFloor: number,
    party: (Hero | null)[],
    currentDepth?: number
): {
    hero: Hero
    party: (Hero | null)[]
    message: string
    success: boolean
} {
    // Find the ability
    const savedAbility = hero.abilities.find(a => a.id === abilityId)

    if (!savedAbility) {
        return {
            hero,
            party,
            message: 'Ability not found',
            success: false
        }
    }

    // Refresh ability from template to ensure current definition with scaling
    const ability = refreshAbilityFromTemplate(savedAbility)

    const cooldownType = ability.cooldownType || 'depth'
    const unitName = cooldownType === 'depth' ? 'depth' : 'floor'

    // Check if ability can be used
    if (!canUseAbility(ability, currentFloor, currentDepth)) {
        const remaining = getRemainingCooldown(ability, currentFloor, currentDepth)
        return {
            hero,
            party,
            message: `${ability.name} is on cooldown (${remaining} ${unitName}${remaining !== 1 ? 's' : ''} remaining)`,
            success: false
        }
    }

    // Check charges
    if (!hasChargesRemaining(ability)) {
        return {
            hero,
            party,
            message: `${ability.name} has no charges remaining`,
            success: false
        }
    }

    // Apply the ability effect
    const result = applyAbilityEffect(hero, ability, party, currentFloor)

    // Update ability usage tracking - refresh all abilities to ensure current definitions
    const updatedAbilities = hero.abilities.map(a => {
        // Refresh all abilities from template to ensure current definitions
        const refreshed = refreshAbilityFromTemplate(a)

        if (a.id === abilityId) {
            const cooldownType = ability.cooldownType || 'depth'
            console.log('[CD Debug] Using ability:', a.name, 'Setting lastUsedFloor:', currentFloor, 'lastUsedDepth:', currentDepth, 'cooldownType:', cooldownType)
            // Update runtime state for the used ability
            return {
                ...refreshed,
                lastUsedFloor: currentFloor,
                lastUsedDepth: currentDepth,
                chargesUsed: (a.chargesUsed || 0) + (a.charges ? 1 : 0)
            }
        }
        return refreshed
    })

    const updatedHero = {
        ...result.hero,
        abilities: updatedAbilities
    }

    console.log('[CD Debug] Updated hero abilities:', updatedHero.abilities.find(a => a.id === abilityId))

    return {
        hero: updatedHero,
        party: result.party,
        message: result.message,
        success: true
    }
}

/**
 * Calculate the final effect value with stat scaling
 */
function calculateEffectValue(baseValue: number, scaling: AbilityEffect['scaling'], hero: Hero): number {
    if (!scaling) return baseValue

    const stats = calculateTotalStats(hero)
    const statValue = stats[scaling.stat] || 0
    const scaledBonus = Math.floor(statValue * scaling.ratio)

    return baseValue + scaledBonus
}

/**
 * Apply the actual ability effect based on type
 */
function applyAbilityEffect(
    hero: Hero,
    ability: Ability,
    party: (Hero | null)[],
    currentFloor: number
): {
    hero: Hero
    party: (Hero | null)[]
    message: string
} {
    const effect = ability.effect
    let updatedHero = { ...hero }
    let updatedParty = [...party]
    let message = `${hero.name} used ${ability.name}!`

    // Calculate final effect value with stat scaling
    const effectValue = calculateEffectValue(effect.value, effect.scaling, hero)

    switch (effect.type) {
        case 'heal': {
            const targets = selectTargets(effect.target, hero, party)
            
            // Check if this is a heal-over-time effect (has duration > 1)
            if (effect.duration && effect.duration > 1) {
                // Apply HoT as status effect - value is healing per turn
                const healPerTurn = effectValue
                targets.forEach(target => {
                    const targetIndex = updatedParty.findIndex(h => h?.id === target.id)
                    if (targetIndex !== -1 && updatedParty[targetIndex]) {
                        const currentTarget = updatedParty[targetIndex]!
                        
                        // Add regeneration combat effect
                        const combatEffects = currentTarget.combatEffects || []
                        combatEffects.push({
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
                        
                        updatedParty[targetIndex] = {
                            ...currentTarget,
                            combatEffects
                        }
                        
                        if (target.id === hero.id) {
                            updatedHero = updatedParty[targetIndex]!
                        }
                        
                        message += ` ${target.name} will regenerate ${healPerTurn} HP per event for ${effect.duration} events!`
                    }
                })
            } else {
                // Instant heal
                targets.forEach(target => {
                    const targetIndex = updatedParty.findIndex(h => h?.id === target.id)
                    if (targetIndex !== -1 && updatedParty[targetIndex]) {
                        const currentTarget = updatedParty[targetIndex]!
                        const totalStats = calculateTotalStats(currentTarget)
                        const currentHp = currentTarget.stats.hp
                        const maxHp = totalStats.maxHp
                        const maxPossibleHeal = Math.max(0, maxHp - currentHp)
                        const healAmount = Math.min(effectValue, maxPossibleHeal)
                        const newHp = Math.min(currentHp + effectValue, maxHp)

                        updatedParty[targetIndex] = {
                            ...currentTarget,
                            stats: {
                                ...currentTarget.stats,
                                hp: newHp
                            }
                        }

                        if (target.id === hero.id) {
                            updatedHero = updatedParty[targetIndex]!
                        }

                        message += ` Healed ${target.name} for ${healAmount} HP!`
                    }
                })
            }
            break
        }

        case 'buff': {
            // For now, buffs will show as a message but won't apply timed effects
            // This could be expanded to use the effect system later
            message += ` Granted ${ability.name} buff!`
            break
        }

        case 'damage': {
            // Damage abilities would need enemy targeting
            // For now, just show message
            message += ` Dealt ${effectValue} damage!`
            break
        }

        case 'debuff': {
            // Debuff abilities would affect enemies
            message += ` Applied debuff!`
            break
        }

        case 'special': {
            // Special abilities have unique effects
            message += ` Special effect activated!`
            break
        }
    }

    return {
        hero: updatedHero,
        party: updatedParty,
        message
    }
}

/**
 * Select targets based on targeting rule
 */
function selectTargets(
    target: AbilityEffect['target'],
    caster: Hero,
    party: (Hero | null)[]
): Hero[] {
    const aliveParty = party.filter((h): h is Hero => h !== null && h.isAlive)

    switch (target) {
        case 'self':
            return [caster]

        case 'ally': {
            // For now, select random ally (could add UI for selection later)
            const allies = aliveParty.filter(h => h.id !== caster.id)
            if (allies.length === 0) return [caster]
            return [allies[Math.floor(Math.random() * allies.length)]]
        }

        case 'all-allies':
            return aliveParty

        case 'enemy':
        case 'all-enemies':
            // Enemy targeting would be for combat events
            // Return empty for now
            return []

        default:
            return [caster]
    }
}

/**
 * Tick cooldowns when floor increases
 * Called when the party advances to the next floor
 */
export function tickAbilityCooldowns(heroes: (Hero | null)[], newFloor: number): (Hero | null)[] {
    return heroes.map(hero => {
        if (!hero) return null

        // Abilities automatically become available as floors progress
        // No need to modify the abilities - canUseAbility checks the floor difference
        return hero
    })
}

/**
 * Reset all ability charges for a new run
 */
export function resetAbilityCharges(hero: Hero): Hero {
    return {
        ...hero,
        abilities: hero.abilities.map(ability => ({
            ...ability,
            lastUsedFloor: undefined,
            lastUsedDepth: undefined,
            chargesUsed: 0
        }))
    }
}

/**
 * Get ability status for UI display
 */
export function getAbilityStatus(
    ability: Ability,
    currentFloor: number,
    currentDepth?: number
): {
    canUse: boolean
    cooldownRemaining: number
    chargesRemaining: number | null
    statusText: string
} {
    const canUse = canUseAbility(ability, currentFloor, currentDepth) && hasChargesRemaining(ability)
    const cooldownRemaining = getRemainingCooldown(ability, currentFloor, currentDepth)
    const chargesRemaining = ability.charges
        ? ability.charges - (ability.chargesUsed || 0)
        : null

    const cooldownType = ability.cooldownType || 'depth'
    const unitName = cooldownType === 'depth' ? 'depth' : 'floor'

    let statusText = ''
    if (cooldownRemaining > 0) {
        statusText = `Cooldown: ${cooldownRemaining} ${unitName}${cooldownRemaining !== 1 ? 's' : ''}`
    } else if (chargesRemaining !== null) {
        statusText = `Charges: ${chargesRemaining}/${ability.charges}`
    } else {
        statusText = 'Ready'
    }

    return {
        canUse,
        cooldownRemaining,
        chargesRemaining,
        statusText
    }
}

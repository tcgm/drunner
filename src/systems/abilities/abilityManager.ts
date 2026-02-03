import type { Hero, Ability, AbilityEffect } from '@/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Check if an ability can be used at the current floor
 */
export function canUseAbility(ability: Ability, currentFloor: number): boolean {
    if (!ability.lastUsedFloor) {
        // Never used before - can use
        return true
    }

    const floorsSinceLastUse = currentFloor - ability.lastUsedFloor
    return floorsSinceLastUse >= ability.cooldown
}

/**
 * Get remaining cooldown floors for an ability
 */
export function getRemainingCooldown(ability: Ability, currentFloor: number): number {
    if (!ability.lastUsedFloor) {
        return 0
    }

    const floorsSinceLastUse = currentFloor - ability.lastUsedFloor
    const remaining = ability.cooldown - floorsSinceLastUse
    return Math.max(0, remaining)
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
    party: (Hero | null)[]
): {
    hero: Hero
    party: (Hero | null)[]
    message: string
    success: boolean
} {
    // Find the ability
    const ability = hero.abilities.find(a => a.id === abilityId)

    if (!ability) {
        return {
            hero,
            party,
            message: 'Ability not found',
            success: false
        }
    }

    // Check if ability can be used
    if (!canUseAbility(ability, currentFloor)) {
        const remaining = getRemainingCooldown(ability, currentFloor)
        return {
            hero,
            party,
            message: `${ability.name} is on cooldown (${remaining} floor${remaining !== 1 ? 's' : ''} remaining)`,
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

    // Update ability usage tracking
    const updatedAbilities = hero.abilities.map(a => {
        if (a.id === abilityId) {
            return {
                ...a,
                lastUsedFloor: currentFloor,
                chargesUsed: (a.chargesUsed || 0) + (a.charges ? 1 : 0)
            }
        }
        return a
    })

    const updatedHero = {
        ...result.hero,
        abilities: updatedAbilities
    }

    return {
        hero: updatedHero,
        party: result.party,
        message: result.message,
        success: true
    }
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

    switch (effect.type) {
        case 'heal': {
            const targets = selectTargets(effect.target, hero, party)
            targets.forEach(target => {
                const healAmount = Math.min(effect.value, target.stats.maxHp - target.stats.hp)
                const targetIndex = updatedParty.findIndex(h => h?.id === target.id)
                if (targetIndex !== -1 && updatedParty[targetIndex]) {
                    updatedParty[targetIndex] = {
                        ...updatedParty[targetIndex]!,
                        stats: {
                            ...updatedParty[targetIndex]!.stats,
                            hp: Math.min(target.stats.hp + effect.value, target.stats.maxHp)
                        }
                    }

                    if (target.id === hero.id) {
                        updatedHero = updatedParty[targetIndex]!
                    }
                }
                message += ` Healed ${target.name} for ${healAmount} HP!`
            })
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
            message += ` Dealt ${effect.value} damage!`
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
            chargesUsed: 0
        }))
    }
}

/**
 * Get ability status for UI display
 */
export function getAbilityStatus(ability: Ability, currentFloor: number): {
    canUse: boolean
    cooldownRemaining: number
    chargesRemaining: number | null
    statusText: string
} {
    const canUse = canUseAbility(ability, currentFloor) && hasChargesRemaining(ability)
    const cooldownRemaining = getRemainingCooldown(ability, currentFloor)
    const chargesRemaining = ability.charges
        ? ability.charges - (ability.chargesUsed || 0)
        : null

    let statusText = ''
    if (cooldownRemaining > 0) {
        statusText = `Cooldown: ${cooldownRemaining} floor${cooldownRemaining !== 1 ? 's' : ''}`
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

import type { Ability, Hero } from '@/types'
import * as ALL_ABILITIES from '@/data/abilities'

/**
 * Restore ability icons after deserialization
 * Icons are React components and can't be serialized to localStorage,
 * so we need to look them up from the templates
 * 
 * @deprecated Use refreshAbilityFromTemplate instead for full ability refresh
 */
export function restoreAbilityIcon(ability: Ability): Ability {
    // Check if icon already exists and is valid
    const hasValidIcon = ability.icon &&
        typeof ability.icon === 'function'

    if (hasValidIcon) {
        return ability
    }

    // Find the template ability by ID
    const template = Object.values(ALL_ABILITIES).find(
        (a): a is Ability => typeof a === 'object' && 'id' in a && a.id === ability.id
    )

    if (template?.icon) {
        return { ...ability, icon: template.icon }
    }

    // If no template found, return as-is
    return ability
}

/**
 * Refresh ability from template while preserving runtime state
 * This ensures abilities always use current definitions (effects, scaling, etc.)
 * while maintaining cooldowns and charges from the saved state
 */
export function refreshAbilityFromTemplate(ability: Ability): Ability {
    // Find the template ability by ID
    const template = Object.values(ALL_ABILITIES).find(
        (a): a is Ability => typeof a === 'object' && 'id' in a && a.id === ability.id
    )

    if (!template) {
        console.warn(`[AbilityRefresh] No template found for ability: ${ability.id}`)
        return ability
    }

    // Use template for all static data, preserve runtime state from saved ability
    return {
        ...template, // Get fresh definition (name, description, effect, scaling, cooldown, etc.)
        lastUsedFloor: ability.lastUsedFloor, // Preserve cooldown state
        chargesUsed: ability.chargesUsed, // Preserve charge usage
        // Note: icon comes from template
    }
}

/**
 * Restore ability icons for all abilities on a hero
 * @deprecated Use refreshHeroAbilities instead for full ability refresh
 */
export function restoreHeroAbilityIcons(hero: Hero): Hero {
    return {
        ...hero,
        abilities: hero.abilities.map(restoreAbilityIcon)
    }
}

/**
 * Refresh all hero abilities from templates
 * Ensures abilities use current definitions while preserving runtime state
 */
export function refreshHeroAbilities(hero: Hero): Hero {
    return {
        ...hero,
        abilities: hero.abilities.map(refreshAbilityFromTemplate)
    }
}

/**
 * Restore ability icons for multiple heroes
 * @deprecated Use refreshPartyAbilities instead for full ability refresh
 */
export function restorePartyAbilityIcons(party: (Hero | null)[]): (Hero | null)[] {
    return party.map(hero => hero ? restoreHeroAbilityIcons(hero) : null)
}

/**
 * Refresh all abilities for party from templates
 * Ensures abilities use current definitions while preserving runtime state
 */
export function refreshPartyAbilities(party: (Hero | null)[]): (Hero | null)[] {
    return party.map(hero => hero ? refreshHeroAbilities(hero) : null)
}

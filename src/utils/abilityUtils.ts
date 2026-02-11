import type { Ability, Hero } from '@/types'
import * as ALL_ABILITIES from '@/data/abilities'

/**
 * Restore ability icons after deserialization
 * Icons are React components and can't be serialized to localStorage,
 * so we need to look them up from the templates
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
 * Restore ability icons for all abilities on a hero
 */
export function restoreHeroAbilityIcons(hero: Hero): Hero {
    return {
        ...hero,
        abilities: hero.abilities.map(restoreAbilityIcon)
    }
}

/**
 * Restore ability icons for multiple heroes
 */
export function restorePartyAbilityIcons(party: (Hero | null)[]): (Hero | null)[] {
    return party.map(hero => hero ? restoreHeroAbilityIcons(hero) : null)
}

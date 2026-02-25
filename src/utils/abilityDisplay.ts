import type { Ability, Hero } from '@/types'
import { calculateTotalStats } from './statCalculator'

const STAT_ABBREV: Record<string, string> = {
    attack: 'ATK',
    defense: 'DEF',
    speed: 'SPD',
    luck: 'LCK',
    wisdom: 'WIS',
    charisma: 'CHA',
    magicPower: 'MAG',
}

/** Short uppercase abbreviation for a stat name, e.g. 'magicPower' → 'MAG' */
export function getStatAbbrev(stat: string): string {
    return STAT_ABBREV[stat] ?? stat.toUpperCase()
}

/**
 * Returns just the scaling tag for an ability, e.g. "1.7×MAG".
 * Returns null if the ability has no scaling.
 */
export function getAbilityScalingTag(ability: Ability): string | null {
    const scaling = ability.effect.scaling
    if (!scaling) return null
    return `${scaling.ratio}×${getStatAbbrev(scaling.stat)}`
}

/**
 * Returns the raw scaling formula string for an ability, e.g. "25 + 1.7×MAG".
 * Returns null if the ability has no scaling.
 */
export function getAbilityScalingFormula(ability: Ability): string | null {
    const tag = getAbilityScalingTag(ability)
    if (!tag) return null
    return `${ability.effect.value} + ${tag}`
}

/**
 * Returns the scaling formula with the resolved result, e.g. "25 + 1.7×MAG (76)".
 * Returns null if the ability has no scaling.
 */
export function getAbilityScalingFormulaWithResult(ability: Ability, hero: Hero): string | null {
    const formula = getAbilityScalingFormula(ability)
    if (!formula) return null
    const result = calculateAbilityValue(ability, hero)
    return `${formula} (${result})`
}

/**
 * Calculate the final effect value for an ability based on hero stats
 */
export function calculateAbilityValue(ability: Ability, hero: Hero): number {
    const baseValue = ability.effect.value
    const scaling = ability.effect.scaling

    if (!scaling) return baseValue

    const stats = calculateTotalStats(hero)
    const statValue = stats[scaling.stat] || 0
    const scaledBonus = Math.floor(statValue * scaling.ratio)

    return baseValue + scaledBonus
}

/**
 * Get a formatted ability description with calculated values and formula (short form for tooltips).
 * E.g. "Deals 76 DMG (25 + 1.7×MAG)" or "Heals 30 HP"
 */
export function getAbilityDescription(ability: Ability, hero: Hero): string {
    const calculatedValue = calculateAbilityValue(ability, hero)
    const effect = ability.effect
    const scalingTag = getAbilityScalingTag(ability)

    let valueText = ''

    switch (effect.type) {
        case 'heal':
            valueText = `Heals ${calculatedValue} HP`
            break
        case 'damage':
            valueText = `Deals ${calculatedValue} DMG`
            break
        case 'buff':
            valueText = `+${calculatedValue}${effect.stat ? ` ${getStatAbbrev(effect.stat)}` : ' bonus'}`
            break
        case 'debuff':
            valueText = `-${calculatedValue}${effect.stat ? ` ${getStatAbbrev(effect.stat)}` : ''}`
            break
        case 'special':
            return ability.description
    }

    if (scalingTag) {
        valueText += ` (${scalingTag})`
    }

    return valueText
}

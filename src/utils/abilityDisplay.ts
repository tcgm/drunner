import type { Ability, Hero } from '@/types'
import { calculateTotalStats } from './statCalculator'

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
 * Get a formatted ability description with calculated values
 */
export function getAbilityDescription(ability: Ability, hero: Hero): string {
    const calculatedValue = calculateAbilityValue(ability, hero)
    const effect = ability.effect

    let valueText = ''

    switch (effect.type) {
        case 'heal':
            valueText = `Heals ${calculatedValue} HP`
            break
        case 'damage':
            valueText = `Deals ${calculatedValue} damage`
            break
        case 'buff':
            valueText = `Grants +${calculatedValue} bonus`
            break
        case 'debuff':
            valueText = `Reduces by ${calculatedValue}`
            break
        case 'special':
            valueText = ability.description
            return valueText
    }

    // Add scaling info if present
    if (effect.scaling) {
        const baseValue = effect.value
        const bonus = calculatedValue - baseValue
        valueText += ` (${baseValue} + ${bonus})`
    }

    return valueText
}

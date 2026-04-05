import type { UniqueHeroDefinition } from './_types'

/** A celestine paladin who has never second-guessed a decision — whether this is sublime certainty or profound obliviousness remains unclear. */
export const solenne: UniqueHeroDefinition = {
    id: 'solenne',
    name: 'Solenne the Unerring',
    species: 'celestine',
    heroRarity: 'legendary',
    level: 5,
    classId: 'paladin',
    statBonuses: [
        { stat: 'charisma', value: 10 },
        { stat: 'defense', value: 8 },
        { stat: 'wisdom', value: 7 },
    ],
    hireCostOverride: 3000,
    lore: 'She has never second-guessed a decision in her life. This could be sublime certainty or profound obliviousness. The results are indistinguishable.',
}

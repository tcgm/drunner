import type { UniqueHeroDefinition } from './_types'

/** A being from between the stars, where reality is thin and thoughts become weapons. */
export const voidwalker: UniqueHeroDefinition = {
    id: 'voidwalker',
    name: 'Nyxara the Unseen',
    species: 'devil',
    heroRarity: 'legendary',
    level: 5,
    classId: 'trickster',
    statBonuses: [
        { stat: 'luck', value: 15 },
        { stat: 'wisdom', value: 10 },
        { stat: 'speed', value: 8 },
    ],
    hireCostOverride: 3500,
    lore: 'She exists in the spaces between heartbeats. You cannot quite focus on her face, and that is probably for the best.',
}

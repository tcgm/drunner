import type { UniqueHeroDefinition } from './_types'

/** A human paladin ordained in three separate orders, left all of them amicably, and follows her own convictions. */
export const priya: UniqueHeroDefinition = {
    id: 'priya',
    name: 'Priya the Wayward',
    species: 'human',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'paladin',
    statBonuses: [
        { stat: 'charisma', value: 8 },
        { stat: 'wisdom', value: 5 },
        { stat: 'defense', value: 5 },
    ],
    hireCostOverride: 1300,
    lore: 'She was ordained in three separate religious orders, left all of them amicably, and now follows her own convictions. All three orders consider her one of their best despite this.',
}

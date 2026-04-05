import type { UniqueHeroDefinition } from './_types'

/** A kitsune cleric who heals people, but only after confirming they've learned something from the experience. */
export const foxfireren: UniqueHeroDefinition = {
    id: 'foxfireren',
    name: 'Foxfire Ren',
    species: 'kitsune',
    heroRarity: 'rare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 6 },
        { stat: 'luck', value: 5 },
        { stat: 'charisma', value: 3 },
    ],
    hireCostOverride: 800,
    lore: 'She heals people, but only after she\'s absolutely confirmed they\'ve learned something. What they\'re supposed to learn is never specified.',
}

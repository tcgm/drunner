import type { UniqueHeroDefinition } from './_types'

/** Heaven's most devoted soldier, until she saw what Heaven actually asked of its soldiers. */
export const nyx: UniqueHeroDefinition = {
    id: 'nyx',
    name: 'Nyx Dawnfall',
    species: 'angel',
    heroRarity: 'legendary',
    level: 5,
    classId: 'paladin',
    statBonuses: [
        { stat: 'charisma', value: 12 },
        { stat: 'defense', value: 8 },
        { stat: 'wisdom', value: 6 },
    ],
    hireCostOverride: 3000,
    lore: 'She was Heaven\'s most devoted soldier, until she saw what Heaven actually asked of its soldiers. The fall was her own choice. She considers it the first honest thing she ever did.',
}

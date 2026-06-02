import type { UniqueHeroDefinition } from './_types'

/** A fae druid who carries a pocket garden of medicinal nightmares. */
export const morrowmoss: UniqueHeroDefinition = {
    id: 'morrowmoss',
    name: 'Morrowmoss',
    species: 'fae',
    heroRarity: 'legendary',
    level: 5,
    classId: 'druid',
    statBonuses: [
        { stat: 'wisdom', value: 14 },
        { stat: 'magicPower', value: 10 },
        { stat: 'luck', value: 8 },
    ],
    hireCostOverride: 3600,
    lore: 'Where she walks, moss climbs stone in seconds and broken things remember how they were meant to live. She is kind, unless you are cruel first.',
}
import type { UniqueHeroDefinition } from './_types'

/** A small drakin rogue who is fast for his size and deeply sensitive about the first part. */
export const skrix: UniqueHeroDefinition = {
    id: 'skrix',
    name: 'Skrix',
    species: 'drakin',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 5 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 440,
    lore: 'Small for a drakin. Faster for it. He\'s deeply sensitive about the first part and aggressively smug about the second.',
}

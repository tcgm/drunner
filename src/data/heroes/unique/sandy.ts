import type { UniqueHeroDefinition } from './_types'

/** She collects prayers and weaves them into music. The songs are very old and very good. She doesn't explain how she decides which prayers to use. She says they choose themselves. */
export const sandy: UniqueHeroDefinition = {
    id: 'sandy',
    name: 'Sandy',
    species: 'angel',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 8 },
        { stat: 'luck', value: 6 },
        { stat: 'wisdom', value: 4 },
    ],
    hireCostOverride: 1400,
    lore: 'She collects prayers and turns them into music. The songs are very old and very good. She doesn\'t explain how she picks which prayers to use. She says they choose themselves.',
}

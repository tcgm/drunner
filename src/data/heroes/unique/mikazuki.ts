import type { UniqueHeroDefinition } from './_types'

/** A tengu ranger who has never carried a map in fourteen years. The sky tells her everything, she says. */
export const mikazuki: UniqueHeroDefinition = {
    id: 'mikazuki',
    name: 'Mikazuki',
    species: 'tengu',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 8 },
        { stat: 'speed', value: 8 },
        { stat: 'luck', value: 3 },
    ],
    hireCostOverride: 1350,
    lore: 'She has never carried a map. She says the sky tells her everything. This is either mystical truth or an extraordinary bluff sustained over fourteen years.',
}

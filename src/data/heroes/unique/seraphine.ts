import type { UniqueHeroDefinition } from './_types'

/** An elven ranger who claims she's never missed. She's not wrong. */
export const seraphine: UniqueHeroDefinition = {
    id: 'seraphine',
    name: 'Seraphine Ashwood',
    species: 'elf',
    heroRarity: 'epic',
    level: 4,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 10 },
        { stat: 'speed', value: 8 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 2000,
    lore: 'She doesn\'t miss. She\'s never missed. She finds the suggestion that she has ever missed deeply, personally offensive.',
}

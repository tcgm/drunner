import type { UniqueHeroDefinition } from './_types'

/** A celestine bard who sings about light exclusively, in dungeons, in the dark. */
export const vesper: UniqueHeroDefinition = {
    id: 'vesper',
    name: 'Vesper of the Long Night',
    species: 'celestine',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 5 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 470,
    lore: 'She sings about light exclusively. In dungeons. In the dark. Everyone finds this more comforting than it has any right to be.',
}

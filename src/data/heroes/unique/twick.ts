import type { UniqueHeroDefinition } from './_types'

/** A gnome rogue with seventeen things in his pockets at any time. Three of them are useful. He cannot always confirm which three. */
export const twick: UniqueHeroDefinition = {
    id: 'twick',
    name: 'Twick',
    species: 'gnome',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'rogue',
    statBonuses: [
        { stat: 'luck', value: 6 },
        { stat: 'speed', value: 4 },
    ],
    hireCostOverride: 430,
    lore: 'He has seventeen things in his pockets at any time, three of which are useful. He cannot always confirm which three but trusts the process.',
}

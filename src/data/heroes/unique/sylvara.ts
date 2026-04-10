import type { UniqueHeroDefinition } from './_types'

/** An ancient dryad druid who has watched forests rise and fall for centuries. Her healing touch carries the patience of old growth. */
export const sylvara: UniqueHeroDefinition = {
    id: 'sylvara',
    name: 'Sylvara Deeproot',
    species: 'dryad',
    heroRarity: 'rare',
    level: 3,
    classId: 'druid',
    statBonuses: [
        { stat: 'wisdom', value: 8 },
        { stat: 'magicPower', value: 5 },
        { stat: 'luck', value: 3 },
    ],
    hireCostOverride: 1000,
    lore: 'She has watched three forests grow to fullness and wither to ash. She does not mourn. She says the dungeon is simply "a very old tree that forgot how to grow."',
}

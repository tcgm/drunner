import type { UniqueHeroDefinition } from './_types'

/** A devil paladin who was redeemed, found the process exhausting, and is doing good now but reserves the right to find it annoying. */
export const ashari: UniqueHeroDefinition = {
    id: 'ashari',
    name: 'Ashari Half-Flame',
    species: 'devil',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'paladin',
    statBonuses: [
        { stat: 'charisma', value: 7 },
        { stat: 'defense', value: 6 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 1350,
    lore: 'She was redeemed. She found the process exhausting. She is doing good now, but she reserves the right to find it annoying.',
}

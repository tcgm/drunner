import type { UniqueHeroDefinition } from './_types'

/** A tengu warrior who always fights from above and visibly struggles with the injustice of flat ground. */
export const zenko: UniqueHeroDefinition = {
    id: 'zenko',
    name: 'Zenko of the High Thermals',
    species: 'tengu',
    heroRarity: 'rare',
    level: 3,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 7 },
        { stat: 'speed', value: 6 },
        { stat: 'maxHp', value: 10 },
    ],
    hireCostOverride: 900,
    lore: 'He fights from above. Always from above. If forced to fight on flat ground he visibly struggles with the injustice of it.',
}

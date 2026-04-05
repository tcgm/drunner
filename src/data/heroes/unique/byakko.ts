import type { UniqueHeroDefinition } from './_types'

/** A nekomata warrior who waits for the perfect moment to strike. The perfect moment takes five seconds. She uses those five seconds well. */
export const byakko: UniqueHeroDefinition = {
    id: 'byakko',
    name: 'Byakko Claw-in-Waiting',
    species: 'nekomata',
    heroRarity: 'epic',
    level: 4,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 10 },
        { stat: 'speed', value: 7 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 1750,
    lore: 'She waits for the perfect moment to strike. The perfect moment takes approximately five seconds. She uses those five seconds to let something significantly regret she hesitated.',
}

import type { UniqueHeroDefinition } from './_types'

/** A halfling rogue who has been underestimated so many times he now uses it as a tactic. */
export const torin: UniqueHeroDefinition = {
    id: 'torin',
    name: 'Torin Dustpoint',
    species: 'halfling',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'rogue',
    statBonuses: [
        { stat: 'luck', value: 5 },
        { stat: 'speed', value: 5 },
    ],
    hireCostOverride: 430,
    lore: 'He has been underestimated so many times that he has started using it as a tactic. He considers it the most reliable spell in his arsenal.',
}

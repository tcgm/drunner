import type { UniqueHeroDefinition } from './_types'

/** Angel of death. She is incredibly kind about her work. She holds your hand. She asks if you have anyone you'd like her to tell. The kindness is the disturbing part. */
export const azza: UniqueHeroDefinition = {
    id: 'azza',
    name: 'Aza',
    species: 'angel',
    heroRarity: 'legendary',
    level: 5,
    classId: 'reaper',
    statBonuses: [
        { stat: 'wisdom', value: 10 },
        { stat: 'maxHp', value: 20 },
        { stat: 'luck', value: 8 },
    ],
    hireCostOverride: 3000,
    lore: 'Angel of death. She is very, very kind about it. She holds your hand. She asks if there\'s anyone you\'d like her to tell. The extraordinary kindness is, somehow, the most unsettling part.',
}

import type { UniqueHeroDefinition } from './_types'

/** The most reasonable oni anyone has ever met. This is not saying much, but he takes pride in the distinction. */
export const kigaru: UniqueHeroDefinition = {
    id: 'kigaru',
    name: 'Kigaru the Reasonable',
    species: 'oni',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'paladin',
    statBonuses: [
        { stat: 'defense', value: 7 },
        { stat: 'charisma', value: 6 },
        { stat: 'maxHp', value: 20 },
    ],
    hireCostOverride: 1300,
    lore: 'He is the most reasonable oni anyone has ever met. This is not saying much, but he takes pride in the distinction.',
}

import type { UniqueHeroDefinition } from './_types'

/** A kitsune who has been three different merchants, two noble heirs, and one very convincing horse this week. */
export const tsuran: UniqueHeroDefinition = {
    id: 'tsuran',
    name: 'Tsuran Silvertail',
    species: 'kitsune',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'trickster',
    statBonuses: [
        { stat: 'speed', value: 4 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 420,
    lore: 'She\'s been three different merchants, two noble heirs, and one very convincing horse this week. She finds the rogue label reductive.',
}

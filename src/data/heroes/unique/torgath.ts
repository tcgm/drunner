import type { UniqueHeroDefinition } from './_types'

/** A dwarven paladin who swore an oath to protect the helpless. It has cost him everything. He would swear it again. */
export const torgath: UniqueHeroDefinition = {
    id: 'torgath',
    name: 'Torgath Stoneheart',
    species: 'dwarf',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'paladin',
    statBonuses: [
        { stat: 'defense', value: 8 },
        { stat: 'charisma', value: 5 },
        { stat: 'maxHp', value: 20 },
    ],
    hireCostOverride: 1300,
    lore: 'He swore an oath to protect the helpless. It has cost him everything. He would swear it again without hesitation, and that is either his greatest virtue or his greatest flaw.',
}

import type { UniqueHeroDefinition } from './_types'

/** A kitsune warrior who meditates before every battle and after every battle, somehow managing to fight in between. */
export const kuzunoha: UniqueHeroDefinition = {
    id: 'kuzunoha',
    name: 'Kuzunoha the Serene',
    species: 'kitsune',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'trickster',
    statBonuses: [
        { stat: 'attack', value: 7 },
        { stat: 'defense', value: 5 },
        { stat: 'maxHp', value: 10 },
    ],
    hireCostOverride: 1150,
    lore: 'She meditates before every battle. She meditates after. Nobody catches her meditating during, but the results suggest she might be.',
}

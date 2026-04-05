import type { UniqueHeroDefinition } from './_types'

/** A celestine warrior assigned to guard a doorway eleven years ago. He is still, technically, guarding it — from inside the dungeon. */
export const caldus: UniqueHeroDefinition = {
    id: 'caldus',
    name: 'Caldus the Stubborn',
    species: 'celestine',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'warrior',
    statBonuses: [
        { stat: 'defense', value: 8 },
        { stat: 'maxHp', value: 20 },
        { stat: 'attack', value: 5 },
    ],
    hireCostOverride: 1200,
    lore: 'He was assigned to guard a doorway eleven years ago. He\'s still technically guarding it — but he\'s doing it from inside the dungeon now. The details are unclear.',
}

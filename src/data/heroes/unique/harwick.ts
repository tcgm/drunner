import type { UniqueHeroDefinition } from './_types'

/** A halfling warrior who weighs less than most of his weapons. Nothing has ever gotten past him. He attributes this to stubbornness, mainly. */
export const harwick: UniqueHeroDefinition = {
    id: 'harwick',
    name: 'Harwick the Immovable',
    species: 'halfling',
    heroRarity: 'epic',
    level: 4,
    classId: 'warrior',
    statBonuses: [
        { stat: 'defense', value: 10 },
        { stat: 'maxHp', value: 25 },
        { stat: 'attack', value: 6 },
    ],
    hireCostOverride: 1850,
    lore: 'He weighs less than most of his weapons. Yet nothing has ever gotten past him. He attributes this to "stubbornness, mainly."',
}

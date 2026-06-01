import type { UniqueHeroDefinition } from './_types'

/** The unluckiest devil in the infernal hierarchy. Not cursed — just like this. */
export const bellend: UniqueHeroDefinition = {
    id: 'bellend',
    name: 'Bellend',
    species: 'human',
    heroRarity: 'legendary',
    level: 5,
    classId: 'monk',
    statBonuses: [
        { stat: 'attack', value: 12 },
        { stat: 'maxHp', value: 25 },
        { stat: 'defense', value: 6 },
    ],
    hireCostOverride: 3500,
    lore: "The unluckiest human in the kingdom. Not cursed, hexed, or even jinxed. He's Just like this. It is unclear whether this is a punishment or simply the natural outcome of existing.",
}

import type { UniqueHeroDefinition } from './_types'

/** A dwarf warrior who has been "retired" eleven times. The dungeon keeps pulling him back. */
export const grommash: UniqueHeroDefinition = {
    id: 'grommash',
    name: 'Grommash Ironbrew',
    species: 'dwarf',
    heroRarity: 'legendary',
    level: 5,
    classId: 'warrior',
    statBonuses: [
        { stat: 'defense', value: 14 },
        { stat: 'maxHp', value: 40 },
        { stat: 'attack', value: 8 },
    ],
    hireCostOverride: 3200,
    lore: 'He\'s been retired eleven times. Each time he swore he was done. Each time the dungeon disagreed. He has stopped arguing with the dungeon.',
}

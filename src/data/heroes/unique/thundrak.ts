import type { UniqueHeroDefinition } from './_types'

/** A dwarven ranger who claims mountains make him paranoid. Below ground, however, he's in his element. */
export const thundrak: UniqueHeroDefinition = {
    id: 'thundrak',
    name: 'Thundrak Coppercoat',
    species: 'dwarf',
    heroRarity: 'epic',
    level: 4,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 9 },
        { stat: 'defense', value: 6 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 1800,
    lore: 'He claims mountains make him paranoid. Below ground, however, he\'s in his element. The dungeon is just an inside mountain. He is weirdly comfortable here.',
}

import type { UniqueHeroDefinition } from './_types'

/** A devil warrior who calls himself magnificent constantly. He is, empirically, magnificent. This makes it somehow worse. */
export const salaxar: UniqueHeroDefinition = {
    id: 'salaxar',
    name: 'Salaxar the Magnificent',
    species: 'devil',
    heroRarity: 'legendary',
    level: 5,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 14 },
        { stat: 'maxHp', value: 30 },
        { stat: 'defense', value: 6 },
    ],
    hireCostOverride: 3400,
    lore: 'He calls himself magnificent constantly. He is, empirically, magnificent. This makes it somehow worse.',
}

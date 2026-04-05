import type { UniqueHeroDefinition } from './_types'

/** A hellborn mage born in fire who considers it an origin story. The fire is still there, he says, just on the inside. */
export const vexis: UniqueHeroDefinition = {
    id: 'vexis',
    name: 'Vexis Ashenborn',
    species: 'hellborn',
    heroRarity: 'legendary',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 14 },
        { stat: 'wisdom', value: 10 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 3400,
    lore: 'He was born in fire. He considers this an origin story. The fire is still there, he says, just "on the inside." This is probably metaphorical. Probably.',
}

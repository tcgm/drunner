import type { UniqueHeroDefinition } from './_types'

/** Commander of Heaven's armies. She is technically retired. She has been technically retired six times. */
export const mika: UniqueHeroDefinition = {
    id: 'mika',
    name: 'Mika',
    species: 'angel',
    heroRarity: 'legendary',
    level: 5,
    classId: 'archangel',
    statBonuses: [
        { stat: 'attack', value: 10 },
        { stat: 'defense', value: 10 },
        { stat: 'maxHp', value: 20 },
    ],
    hireCostOverride: 3500,
    lore: 'Commander of Heaven\'s armies. She is technically retired. She has been technically retired six times. She sighs every time she comes back. She comes back anyway.',
}

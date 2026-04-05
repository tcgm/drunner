import type { UniqueHeroDefinition } from './_types'

/** A nekomata ranger whose second tail arrived at age forty — very young for her kind. Nobody knows what it means. She isn't concerned. */
export const tamamo: UniqueHeroDefinition = {
    id: 'tamamo',
    name: 'Tamamo the Two-Tailed',
    species: 'nekomata',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'ranger',
    statBonuses: [
        { stat: 'speed', value: 8 },
        { stat: 'luck', value: 6 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 1200,
    lore: 'The second tail arrived at age forty, which for a nekomata is very young. Nobody knows what it means. She does not appear concerned.',
}

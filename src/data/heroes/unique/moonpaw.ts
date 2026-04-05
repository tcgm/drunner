import type { UniqueHeroDefinition } from './_types'

/** A nekomata bard who picked up the lute three days ago and is already better at it than people who've practiced for years. */
export const moonpaw: UniqueHeroDefinition = {
    id: 'moonpaw',
    name: 'Moonpaw',
    species: 'nekomata',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'luck', value: 5 },
        { stat: 'charisma', value: 5 },
    ],
    hireCostOverride: 450,
    lore: 'She picked up the lute three days ago. She is already better at it than people who have practiced for years. She finds this unremarkable.',
}

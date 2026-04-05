import type { UniqueHeroDefinition } from './_types'

/** A drakin ranger who scouts three floors ahead and then acts offended if anyone suggests this was helpful. */
export const krausk: UniqueHeroDefinition = {
    id: 'krausk',
    name: 'Krausk Stormwing',
    species: 'drakin',
    heroRarity: 'epic',
    level: 4,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 9 },
        { stat: 'speed', value: 7 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 1850,
    lore: 'He flies ahead of the party, returns with a complete tactical map of the next three floors, and then acts offended if anyone suggests this was helpful.',
}

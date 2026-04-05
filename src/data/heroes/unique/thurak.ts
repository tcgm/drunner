import type { UniqueHeroDefinition } from './_types'

/** A careful orc paladin who plans everything before, during, and after every battle. His survival rate is not typical for his kind. */
export const thurak: UniqueHeroDefinition = {
    id: 'thurak',
    name: 'Thurak the Careful',
    species: 'orc',
    heroRarity: 'rare',
    level: 3,
    classId: 'paladin',
    statBonuses: [
        { stat: 'defense', value: 7 },
        { stat: 'charisma', value: 5 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 950,
    lore: 'He plans everything. Before every battle, during every battle, and for some time after, just in case. This level of caution is unusual for an orc. His survival rate is not.',
}

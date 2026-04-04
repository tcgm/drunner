import type { UniqueHeroDefinition } from './_types'

/** A tanuki bard who has been three different people this week alone. He recommends it. */
export const bramblewick: UniqueHeroDefinition = {
    id: 'bramblewick',
    name: 'Bramblewick',
    species: 'tanuki',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'luck', value: 6 },
        { stat: 'charisma', value: 5 },
    ],
    hireCostOverride: 480,
    lore: 'He has been three different people this week alone. He recommends it. "You should try being someone else sometime," he says, almost certainly from experience.',
}

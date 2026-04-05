import type { UniqueHeroDefinition } from './_types'

/** An elf who cannot sit still — she has been asked to leave two temples and one very nice forest for fidgeting. */
export const sylvaine: UniqueHeroDefinition = {
    id: 'sylvaine',
    name: 'Sylvaine the Unquiet',
    species: 'elf',
    heroRarity: 'rare',
    level: 3,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 7 },
        { stat: 'luck', value: 6 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 880,
    lore: 'She cannot sit still. Elves are supposed to be serene. She has been asked to leave two temples and one very nice forest for fidgeting.',
}

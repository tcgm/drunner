import type { UniqueHeroDefinition } from './_types'

/** A human with no last name, no record, and a face that nobody seems to remember clearly. */
export const sable: UniqueHeroDefinition = {
    id: 'sable',
    name: 'Sable',
    species: 'human',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 5 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 450,
    lore: 'No last name. No record. No face that anyone remembers clearly. When asked where she came from, she says "around." When pressed, she says "around" again, slower.',
}

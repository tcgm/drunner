import type { UniqueHeroDefinition } from './_types'

/** A tengu bard who sings at a volume her colleagues describe as geological. */
export const karura: UniqueHeroDefinition = {
    id: 'karura',
    name: 'Karura the Loud',
    species: 'tengu',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 5 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 460,
    lore: 'She sings at a volume her colleagues describe as "geological." In fairness, the acoustics of dungeon corridors do carry rather well.',
}

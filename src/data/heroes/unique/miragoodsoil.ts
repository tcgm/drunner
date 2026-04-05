import type { UniqueHeroDefinition } from './_types'

/** A halfling cleric who grew up mending fences, feeding neighbors, and settling disputes. She does the same in dungeons. The disputes are just louder. */
export const miragoodsoil: UniqueHeroDefinition = {
    id: 'miragoodsoil',
    name: 'Mira Goodsoil',
    species: 'halfling',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 8 },
        { stat: 'maxHp', value: 12 },
        { stat: 'charisma', value: 6 },
    ],
    hireCostOverride: 1200,
    lore: 'She grew up mending fences, feeding neighbors, and settling disputes. She does essentially the same thing in dungeons. The disputes are just louder.',
}

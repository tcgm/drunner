import type { UniqueHeroDefinition } from './_types'

/** An orc warrior who carries two axes and throws both. Nobody knows how she retrieves them so quickly. She has not offered to explain. */
export const borga: UniqueHeroDefinition = {
    id: 'borga',
    name: 'Borga Twice-Axe',
    species: 'orc',
    heroRarity: 'legendary',
    level: 5,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 14 },
        { stat: 'maxHp', value: 35 },
        { stat: 'defense', value: 5 },
    ],
    hireCostOverride: 3400,
    lore: 'She carries two axes. This is unusual. She also throws both and then retrieves them. Nobody knows how she retrieves them so quickly. She has not offered to explain.',
}

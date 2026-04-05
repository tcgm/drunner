import type { UniqueHeroDefinition } from './_types'

/** A fae cleric who helps because she wants to. This is almost certainly true. The smirk is more ambiguous. */
export const clover: UniqueHeroDefinition = {
    id: 'clover',
    name: 'Clover the Obliging',
    species: 'fae',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'cleric',
    statBonuses: [
        { stat: 'luck', value: 6 },
        { stat: 'wisdom', value: 4 },
    ],
    hireCostOverride: 460,
    lore: 'She helps because she wants to, she says. This is almost certainly true. The smirk while she says it is more ambiguous.',
}

import type { UniqueHeroDefinition } from './_types'

/** A hellborn cleric who was the worst person in a very bad place, then had a realization, and became something else entirely. */
export const ashcroft: UniqueHeroDefinition = {
    id: 'ashcroft',
    name: 'Ashcroft the Redeemed',
    species: 'hellborn',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 7 },
        { stat: 'maxHp', value: 15 },
        { stat: 'charisma', value: 5 },
    ],
    hireCostOverride: 1350,
    lore: 'He was the worst person in a very bad place, then had a realization, and became something else entirely. He talks about it only when asked, and only in outline. The details are his.',
}

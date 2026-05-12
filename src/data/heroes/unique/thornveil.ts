import type { UniqueHeroDefinition } from './_types'

/** A dryad mage whose magic grows from within — literally. Her spells bloom outward like flowers, beautiful and destructive. */
export const thornveil: UniqueHeroDefinition = {
    id: 'thornveil',
    name: 'Thornveil',
    species: 'dryad',
    heroRarity: 'epic',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 12 },
        { stat: 'wisdom', value: 8 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 1800,
    lore: 'She has no last name. She says names are for things that end. Her bark is older than the guild itself, and her eyes have seen too many dungeons to pretend to be afraid of this one.',
}

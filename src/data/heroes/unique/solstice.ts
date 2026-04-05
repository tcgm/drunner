import type { UniqueHeroDefinition } from './_types'

/** A fae mage who arrived on midsummer's day and only operates during seasons she personally approves of. She has approved of all of them so far. */
export const solstice: UniqueHeroDefinition = {
    id: 'solstice',
    name: 'Solstice',
    species: 'fae',
    heroRarity: 'epic',
    level: 4,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 10 },
        { stat: 'luck', value: 8 },
        { stat: 'wisdom', value: 5 },
    ],
    hireCostOverride: 2000,
    lore: 'She arrived on midsummer\'s day and only operates during seasons she personally approves of. She has approved of all of them so far, but the hedging is noted.',
}

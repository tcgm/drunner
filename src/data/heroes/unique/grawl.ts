import type { UniqueHeroDefinition } from './_types'

/** An orc ranger who is fast for an orc, which makes her average overall. She is aggressively aware of this. She uses it as motivation. */
export const grawl: UniqueHeroDefinition = {
    id: 'grawl',
    name: 'Grawl Swiftfoot',
    species: 'orc',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'ranger',
    statBonuses: [
        { stat: 'attack', value: 4 },
        { stat: 'speed', value: 5 },
    ],
    hireCostOverride: 440,
    lore: 'She is fast for an orc, which makes her approximately average overall. She is aggressively aware of this. She uses it as motivation.',
}

import type { UniqueHeroDefinition } from './_types'

/** The only fae to ever take and keep a paladin's oath. Nobody knows how. The oath apparently doesn't either, but it's holding. */
export const brimstone: UniqueHeroDefinition = {
    id: 'brimstone',
    name: 'Brimstone Nightveil',
    species: 'fae',
    heroRarity: 'legendary',
    level: 5,
    classId: 'paladin',
    statBonuses: [
        { stat: 'charisma', value: 10 },
        { stat: 'defense', value: 8 },
        { stat: 'luck', value: 7 },
    ],
    hireCostOverride: 3200,
    lore: 'She is the only fae to ever take and keep a paladin\'s oath. Nobody knows how. The oath apparently doesn\'t either, but it\'s holding.',
}

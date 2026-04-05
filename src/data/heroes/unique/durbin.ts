import type { UniqueHeroDefinition } from './_types'

/** A gnome cleric who prays before every action, including eating and sitting down. His deity has apparently accepted this arrangement. */
export const durbin: UniqueHeroDefinition = {
    id: 'durbin',
    name: 'Durbin the Devout',
    species: 'gnome',
    heroRarity: 'rare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 6 },
        { stat: 'charisma', value: 5 },
        { stat: 'maxHp', value: 10 },
    ],
    hireCostOverride: 900,
    lore: 'He prays before every action, including eating and sitting down. His deity has apparently accepted this arrangement. The blessings come through reliably.',
}

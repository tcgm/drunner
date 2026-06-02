import type { UniqueHeroDefinition } from './_types'

/** A drakin storm-shaman who tempers rage into precise bursts of flame. */
export const embermaw: UniqueHeroDefinition = {
    id: 'embermaw',
    name: 'Cindervane Embermaw',
    species: 'drakin',
    heroRarity: 'epic',
    level: 5,
    classId: 'shaman',
    statBonuses: [
        { stat: 'magicPower', value: 13 },
        { stat: 'wisdom', value: 9 },
        { stat: 'attack', value: 5 },
    ],
    hireCostOverride: 3200,
    lore: 'He speaks to fire the way most people speak to old hunting dogs: firmly, respectfully, and with the expectation that something is about to catch on fire.',
}
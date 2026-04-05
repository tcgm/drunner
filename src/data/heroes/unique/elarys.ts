import type { UniqueHeroDefinition } from './_types'

/** A celestine mage told she would be called when the moment was right. She got tired of waiting. */
export const elarys: UniqueHeroDefinition = {
    id: 'elarys',
    name: 'Elarys Dawn-in-Waiting',
    species: 'celestine',
    heroRarity: 'rare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 6 },
        { stat: 'magicPower', value: 6 },
        { stat: 'charisma', value: 3 },
    ],
    hireCostOverride: 900,
    lore: 'She was told she would be called when the moment was right. She got tired of waiting and came herself.',
}

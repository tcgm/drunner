import type { UniqueHeroDefinition } from './_types'

/** A shaman who commands the fury of the skies. */
export const stormcaller: UniqueHeroDefinition = {
    id: 'stormcaller',
    name: 'Kaelen Stormborn',
    species: 'human',
    heroRarity: 'epic',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 14 },
        { stat: 'wisdom', value: 11 },
        { stat: 'speed', value: 9 },
    ],
    hireCostOverride: 3300,
    lore: "Lightning follows him wherever he goes. He doesn't know why. He thinks it's kind of convenient for keeping insects away.",
}

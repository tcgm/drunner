import type { UniqueHeroDefinition } from './_types'

/** A tengu mage who remembers a library that burned. He remembers every book in it. He would rather not talk about the library. */
export const tenmeiken: UniqueHeroDefinition = {
    id: 'tenmeiken',
    name: 'Tenmeiken the Last Scholar',
    species: 'tengu',
    heroRarity: 'legendary',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 12 },
        { stat: 'magicPower', value: 10 },
        { stat: 'speed', value: 4 },
    ],
    hireCostOverride: 3200,
    lore: 'He remembers a library that burned. He remembers every book in it. He would rather not talk about the library.',
}

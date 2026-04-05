import type { UniqueHeroDefinition } from './_types'

/** Every test said he had no aptitude for magic. He learned anyway, out of spite, for forty years. He still introduces himself as ordinary. */
export const aldric: UniqueHeroDefinition = {
    id: 'aldric',
    name: 'Aldric the Ordinary',
    species: 'human',
    heroRarity: 'legendary',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 10 },
        { stat: 'magicPower', value: 10 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 3000,
    lore: 'Every test said he had no aptitude for magic. He learned anyway. After forty years of spite-fueled practice, he is one of the strongest mages alive. He still introduces himself as ordinary.',
}

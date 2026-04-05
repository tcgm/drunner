import type { UniqueHeroDefinition } from './_types'

/** A devil rogue who has never signed a contract, finds them limiting, and has also never broken a verbal promise. */
export const nixara: UniqueHeroDefinition = {
    id: 'nixara',
    name: 'Nixara',
    species: 'devil',
    heroRarity: 'epic',
    level: 4,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 11 },
        { stat: 'luck', value: 7 },
        { stat: 'attack', value: 5 },
    ],
    hireCostOverride: 2000,
    lore: 'She has never signed a contract in her life. She finds them limiting. She has also never broken a verbal promise, which she considers far more binding.',
}

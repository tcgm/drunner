import type { UniqueHeroDefinition } from './_types'

/** An oni warrior who broke the dungeon record for fastest floor clear. He also broke most of the floor. */
export const ragehoof: UniqueHeroDefinition = {
    id: 'ragehoof',
    name: 'Ragehoof',
    species: 'oni',
    heroRarity: 'epic',
    level: 4,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 14 },
        { stat: 'maxHp', value: 25 },
        { stat: 'speed', value: 5 },
    ],
    hireCostOverride: 1900,
    lore: 'He broke the dungeon record for fastest floor clear. He also broke most of the floor. Guild management has requested he try to break fewer floors. He has not acknowledged this request.',
}

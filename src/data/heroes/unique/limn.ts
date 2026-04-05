import type { UniqueHeroDefinition } from './_types'

/** A hellborn rogue who moves like smoke through narrow places. Growing up in Hell apparently has certain practical advantages. */
export const limn: UniqueHeroDefinition = {
    id: 'limn',
    name: 'Limn',
    species: 'hellborn',
    heroRarity: 'rare',
    level: 3,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 8 },
        { stat: 'luck', value: 7 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 1000,
    lore: 'She moves like smoke through narrow places. She says she learned it growing up. Growing up in Hell apparently has certain practical advantages.',
}

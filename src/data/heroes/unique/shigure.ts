import type { UniqueHeroDefinition } from './_types'

/** An oni rogue who is categorically too fast for something her size. She finds the comment offensive. She also absolutely uses it. */
export const shigure: UniqueHeroDefinition = {
    id: 'shigure',
    name: 'Shigure',
    species: 'oni',
    heroRarity: 'rare',
    level: 3,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 8 },
        { stat: 'attack', value: 6 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 950,
    lore: 'She is categorically too fast for something her size. She finds this comment offensive. She also absolutely uses it.',
}

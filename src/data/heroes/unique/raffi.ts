import type { UniqueHeroDefinition } from './_types'

/** The greatest healer in existence. She finds being told this exhausting. Just stop getting hurt, she says, every time, to everyone. */
export const raffi: UniqueHeroDefinition = {
    id: 'raffi',
    name: 'Raffi',
    species: 'angel',
    heroRarity: 'legendary',
    level: 5,
    classId: 'archangel',
    statBonuses: [
        { stat: 'wisdom', value: 12 },
        { stat: 'maxHp', value: 25 },
        { stat: 'charisma', value: 6 },
    ],
    hireCostOverride: 3200,
    lore: 'She is the greatest healer in existence. She has been told this so many times she finds it boring. "Just stop getting hurt," she says, every time, to everyone. Nobody does.',
}

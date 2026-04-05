import type { UniqueHeroDefinition } from './_types'

/** A human cleric who's been at it three years and still isn't sure it's the right fit. He heals excellently while having this crisis. */
export const solen: UniqueHeroDefinition = {
    id: 'solen',
    name: 'Solen the Undecided',
    species: 'human',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 5 },
        { stat: 'charisma', value: 4 },
    ],
    hireCostOverride: 440,
    lore: 'He\'s been a cleric for three years. He still isn\'t sure it\'s the right fit. He heals people while having this crisis. The healing is excellent. The conversational presence is challenging.',
}

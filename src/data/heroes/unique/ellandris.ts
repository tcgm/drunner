import type { UniqueHeroDefinition } from './_types'

/** An elven bard who plays songs nobody recognizes. People who've heard them find them in their dreams for weeks after. */
export const ellandris: UniqueHeroDefinition = {
    id: 'ellandris',
    name: 'Ellandris the Pale Stranger',
    species: 'elf',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 8 },
        { stat: 'luck', value: 6 },
        { stat: 'wisdom', value: 3 },
    ],
    hireCostOverride: 1300,
    lore: 'He arrived in town a century ago and never explained why. He plays songs nobody recognizes. People who\'ve heard them find them in their dreams for weeks after.',
}

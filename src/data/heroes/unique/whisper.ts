import type { UniqueHeroDefinition } from './_types'

/** A fae rogue whose real name nobody knows. She finds the mystery more useful than the answer. */
export const whisper: UniqueHeroDefinition = {
    id: 'whisper',
    name: 'Whisper',
    species: 'fae',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'trickster',
    statBonuses: [
        { stat: 'luck', value: 9 },
        { stat: 'speed', value: 7 },
        { stat: 'charisma', value: 4 },
    ],
    hireCostOverride: 1400,
    lore: 'Nobody knows her real name. She\'s not telling. She finds the mystery considerably more useful than the answer would be.',
}

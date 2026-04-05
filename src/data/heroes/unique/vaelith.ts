import type { UniqueHeroDefinition } from './_types'

/** A drakin cleric whose healing tradition nobody else recognizes, but whose patients consistently live. */
export const vaelith: UniqueHeroDefinition = {
    id: 'vaelith',
    name: 'Vaelith the Pale',
    species: 'drakin',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 8 },
        { stat: 'maxHp', value: 15 },
        { stat: 'charisma', value: 4 },
    ],
    hireCostOverride: 1300,
    lore: 'She claims her healing comes from an ancient draconic tradition nobody else knows. Nobody has verified this. Her patients live, so the question has not been pressed.',
}

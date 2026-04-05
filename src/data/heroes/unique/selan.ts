import type { UniqueHeroDefinition } from './_types'

/** An angel bard who writes hymns nobody else has ever heard. She's not entirely sure they came from her. */
export const selan: UniqueHeroDefinition = {
    id: 'selan',
    name: 'Selan',
    species: 'angel',
    heroRarity: 'rare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 7 },
        { stat: 'wisdom', value: 5 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 920,
    lore: 'She writes hymns nobody else has ever heard. When asked who taught them to her, she says, "I\'m not sure they came from me." She says this completely seriously.',
}

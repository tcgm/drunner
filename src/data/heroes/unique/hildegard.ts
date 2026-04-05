import type { UniqueHeroDefinition } from './_types'

/** A dwarven cleric who has healed more grievous wounds than minor ones. She considers this a professional compliment. */
export const hildegard: UniqueHeroDefinition = {
    id: 'hildegard',
    name: 'Hildegard Stoneson',
    species: 'dwarf',
    heroRarity: 'rare',
    level: 3,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 7 },
        { stat: 'maxHp', value: 15 },
        { stat: 'defense', value: 4 },
    ],
    hireCostOverride: 950,
    lore: 'She has healed more grievous wounds than she has treated minor ones. She considers this a professional compliment.',
}

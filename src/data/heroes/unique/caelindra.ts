import type { UniqueHeroDefinition } from './_types'

/** An elven cleric who took a vow of healing, not a vow of bedside manner. She will fix you. She will not be warm about it. */
export const caelindra: UniqueHeroDefinition = {
    id: 'caelindra',
    name: 'Caelindra',
    species: 'elf',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 5 },
        { stat: 'charisma', value: 4 },
    ],
    hireCostOverride: 460,
    lore: 'She took a vow of healing. She did not take a vow of bedside manner. She will fix you. She will not be warm about it.',
}

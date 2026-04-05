import type { UniqueHeroDefinition } from './_types'

/** Angel of fate and death. She considers herself more of a consultant. She dresses like she's going to a garden party. */
export const sari: UniqueHeroDefinition = {
    id: 'sari',
    name: 'Sariel',
    species: 'angel',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'rogue',
    statBonuses: [
        { stat: 'speed', value: 8 },
        { stat: 'luck', value: 7 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 1350,
    lore: 'She is technically an angel of fate and the dying. She considers this "more of a consulting role." She dresses like she\'s going to a garden party. The knife is very small and very sharp.',
}

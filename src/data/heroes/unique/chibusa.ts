import type { UniqueHeroDefinition } from './_types'

/** A tanuki warrior who brings snacks into every dungeon. Always. The snacks are good. Nobody questions the snacks. */
export const chibusa: UniqueHeroDefinition = {
    id: 'chibusa',
    name: 'Chibusa',
    species: 'tanuki',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 4 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 430,
    lore: 'She brings snacks. Always. Into every dungeon. The snacks are good. Nobody questions the snacks.',
}

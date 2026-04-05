import type { UniqueHeroDefinition } from './_types'

/** A nekomata mage whose spells succeed at improbable rates. Her explanation: "I wanted them to." */
export const koibito: UniqueHeroDefinition = {
    id: 'koibito',
    name: 'Koibito',
    species: 'nekomata',
    heroRarity: 'rare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'luck', value: 8 },
        { stat: 'wisdom', value: 5 },
        { stat: 'magicPower', value: 4 },
    ],
    hireCostOverride: 880,
    lore: 'Her spells succeed at improbable rates. When asked to explain this, she tilts her head, blinks slowly, and says "I wanted them to." This is her full explanation.',
}

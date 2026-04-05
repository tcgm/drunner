import type { UniqueHeroDefinition } from './_types'

/** A tanuki mage who learned magic by watching others cast and guessing. His guesses were correct. He refuses to verify this against any written source. */
export const isobu: UniqueHeroDefinition = {
    id: 'isobu',
    name: 'Isobu',
    species: 'tanuki',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 7 },
        { stat: 'luck', value: 6 },
        { stat: 'magicPower', value: 5 },
    ],
    hireCostOverride: 1250,
    lore: 'He learned magic by watching other people cast it and guessing how it worked. His guesses were correct. He refuses to verify this against any written source.',
}

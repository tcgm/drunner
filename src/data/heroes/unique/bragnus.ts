import type { UniqueHeroDefinition } from './_types'

/** A barely literate dwarf mage who guesses at his spells. His guesses, so far, have been correct enough. */
export const bragnus: UniqueHeroDefinition = {
    id: 'bragnus',
    name: 'Bragnus the Barely Literate',
    species: 'dwarf',
    heroRarity: 'uncommon',
    level: 2,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 5 },
        { stat: 'luck', value: 4 },
    ],
    hireCostOverride: 430,
    lore: 'He cannot read most of his spellbook. He guesses. His guesses are, so far, correct enough. He has written detailed notes in the margins using entirely invented words.',
}

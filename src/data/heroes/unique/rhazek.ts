import type { UniqueHeroDefinition } from './_types'

/** An orc shaman cast out of his tribe for communing with the dead. The dead, at least, listen. */
export const rhazek: UniqueHeroDefinition = {
    id: 'rhazek',
    name: 'Rhazek the Forsaken',
    species: 'orc',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'necromancer',
    statBonuses: [
        { stat: 'magicPower', value: 8 },
        { stat: 'wisdom', value: 7 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 1250,
    lore: 'He was cast out of his tribe for communing with the dead. The dead, at least, listen. They don\'t judge. They don\'t leave. He finds them to be better company than most of the living.',
}

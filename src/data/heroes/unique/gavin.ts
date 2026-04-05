import type { UniqueHeroDefinition } from './_types'

/** An angel mage who specializes in stopping things before they cause harm. He has strong opinions about preemptive solutions. */
export const gavin: UniqueHeroDefinition = {
    id: 'gavin',
    name: 'Gavin of the Second Chances',
    species: 'angel',
    heroRarity: 'veryRare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 7 },
        { stat: 'magicPower', value: 7 },
        { stat: 'charisma', value: 4 },
    ],
    hireCostOverride: 1300,
    lore: 'He specializes in barriers and redirections — magic that stops things before they harm. He has strong opinions about preemptive solutions. He is difficult to argue with.',
}

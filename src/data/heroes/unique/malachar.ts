import type { UniqueHeroDefinition } from './_types'

/** A devil necromancer of indeterminate age who died centuries ago and decided it didn't apply to him. */
export const malachar: UniqueHeroDefinition = {
    id: 'malachar',
    name: 'Malachar the Hollow',
    species: 'devil',
    heroRarity: 'mythic',
    level: 6,
    classId: 'necromancer',
    statBonuses: [
        { stat: 'magicPower', value: 16 },
        { stat: 'wisdom', value: 12 },
        { stat: 'maxHp', value: 25 },
    ],
    hireCostOverride: 5500,
    lore: 'He died centuries ago. He didn\'t let that stop him. You\'re not entirely sure what\'s keeping him going and he\'s not telling.',
}

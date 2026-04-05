import type { UniqueHeroDefinition } from './_types'

/** An angel cleric who has never turned anyone away. He finds the concept of refusal philosophically incoherent when someone is hurting. */
export const radiel: UniqueHeroDefinition = {
    id: 'radiel',
    name: 'Radiel the Compassionate',
    species: 'angel',
    heroRarity: 'epic',
    level: 4,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 10 },
        { stat: 'charisma', value: 7 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 2000,
    lore: 'He has never turned anyone away. Not once. He finds the concept of refusal philosophically incoherent when someone is hurting.',
}

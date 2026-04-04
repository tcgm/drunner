import type { UniqueHeroDefinition } from './_types'

/** A halfling bard who has never met a door she couldn't talk her way through, a lock she couldn't charm, or a meal she couldn't finish. */
export const pip: UniqueHeroDefinition = {
    id: 'pip',
    name: 'Pip Tumbleweed',
    species: 'halfling',
    heroRarity: 'rare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'luck', value: 8 },
        { stat: 'charisma', value: 7 },
        { stat: 'speed', value: 3 },
    ],
    hireCostOverride: 1000,
    lore: 'Everybody loves her immediately. Nobody is sure why. She is absolutely sure why and she will not explain.',
}

import type { UniqueHeroDefinition } from './_types'

/** A tanuki cleric who spent decades as a trickster, then started genuinely helping people by accident and could not stop. */
export const hayata: UniqueHeroDefinition = {
    id: 'hayata',
    name: 'Hayata the Converted',
    species: 'tanuki',
    heroRarity: 'epic',
    level: 4,
    classId: 'cleric',
    statBonuses: [
        { stat: 'wisdom', value: 9 },
        { stat: 'charisma', value: 8 },
        { stat: 'maxHp', value: 15 },
    ],
    hireCostOverride: 1950,
    lore: 'He spent decades as a trickster, then started genuinely helping people by accident and could not stop. He finds the transition embarrassing. The people he\'s helped find it lovely.',
}

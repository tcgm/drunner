import type { UniqueHeroDefinition } from './_types'

/** A devil bard who is extraordinarily polite. Suspiciously polite. The kind of polite that makes you wonder what he wants. */
export const velscorn: UniqueHeroDefinition = {
    id: 'velscorn',
    name: 'Velscorn the Polite',
    species: 'devil',
    heroRarity: 'rare',
    level: 3,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 8 },
        { stat: 'luck', value: 5 },
        { stat: 'wisdom', value: 3 },
    ],
    hireCostOverride: 950,
    lore: 'Extraordinarily polite. Suspiciously polite. The kind of polite that makes you wonder what he wants. He may simply be polite. It remains unclear.',
}

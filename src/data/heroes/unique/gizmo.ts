import type { UniqueHeroDefinition } from './_types'

/** A gnome mage whose last seven inventions exploded. She considers this a seventy percent success rate. */
export const gizmo: UniqueHeroDefinition = {
    id: 'gizmo',
    name: 'Gizmo Sparktinkle',
    species: 'gnome',
    heroRarity: 'rare',
    level: 3,
    classId: 'mage',
    statBonuses: [
        { stat: 'wisdom', value: 7 },
        { stat: 'magicPower', value: 6 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 950,
    lore: 'Her last seven inventions exploded. She considers this a seventy percent success rate and a thirty percent "learning opportunity." She has not explained the math.',
}

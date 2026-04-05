import type { UniqueHeroDefinition } from './_types'

/** A human warrior with no special bloodline, no ancient destiny. Just a man who has survived long enough to become very good at surviving. */
export const darek: UniqueHeroDefinition = {
    id: 'darek',
    name: 'Darek Ironhand',
    species: 'human',
    heroRarity: 'rare',
    level: 3,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 8 },
        { stat: 'defense', value: 5 },
        { stat: 'maxHp', value: 12 },
    ],
    hireCostOverride: 900,
    lore: 'No special bloodline, no ancient destiny, no hidden power. Just a man who has survived long enough to become very, very good at surviving.',
}

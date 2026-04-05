import type { UniqueHeroDefinition } from './_types'

/** A gnome warrior who is three feet tall and has the personal gravity of a mountain. Enemies mid-flight have time to reconsider. */
export const ironbell: UniqueHeroDefinition = {
    id: 'ironbell',
    name: 'Ironbell',
    species: 'gnome',
    heroRarity: 'epic',
    level: 4,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 9 },
        { stat: 'defense', value: 8 },
        { stat: 'maxHp', value: 20 },
    ],
    hireCostOverride: 1900,
    lore: 'She is three feet tall and has the personal gravity of a mountain. Enemies frequently underestimate her. They have time, mid-flight, to reconsider.',
}

import type { UniqueHeroDefinition } from './_types'

/** Lord of flies. She herself is immaculate and deeply offended by mess. The flies do not receive the same memo. */
export const beel: UniqueHeroDefinition = {
  id: 'beel',
  name: 'Beel',
  species: 'devil',
  heroRarity: 'legendary',
  level: 5,
    classId: 'archdevil',
  statBonuses: [
    { stat: 'attack', value: 13 },
    { stat: 'maxHp', value: 30 },
    { stat: 'defense', value: 7 },
  ],
  hireCostOverride: 3500,
  lore: 'Lord of flies. She is, herself, meticulous. Immaculate. Deeply offended by mess. The flies do not receive the same memo. She is working on this.',
}

import type { UniqueHeroDefinition } from './_types'

/** The great sea beast. On land now. She finds it dry. Progress on adjusting is moderate. */
export const levi: UniqueHeroDefinition = {
  id: 'levi',
  name: 'Levi',
  species: 'devil',
  heroRarity: 'epic',
  level: 4,
  classId: 'warrior',
  statBonuses: [
    { stat: 'maxHp', value: 30 },
    { stat: 'attack', value: 10 },
    { stat: 'defense', value: 8 },
  ],
  hireCostOverride: 2300,
  lore: 'She is the great sea beast of scripture. She is on land now. She finds it dry. She finds most of it remarkably underwhelming. Progress on adjusting is moderate but consistent.',
}

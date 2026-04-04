import type { UniqueHeroDefinition } from './_types'

/** A celestine exile who traded her divine purpose for the liberty of the open road. */
export const lirael: UniqueHeroDefinition = {
  id: 'lirael',
  name: 'Lirael the Wandering Light',
  species: 'celestine',
  heroRarity: 'epic',
  level: 4,
  classId: 'cleric',
  statBonuses: [
    { stat: 'wisdom', value: 8 },
    { stat: 'charisma', value: 5 },
    { stat: 'maxHp', value: 15 },
  ],
  hireCostOverride: 1800,
  lore: 'She was cast out for asking too many questions. She has not stopped asking.',
}

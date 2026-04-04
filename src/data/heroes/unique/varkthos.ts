import type { UniqueHeroDefinition } from './_types'

/** The last survivor of a draconic bloodline, seeking worthy companions for a final reckoning. */
export const varkthos: UniqueHeroDefinition = {
  id: 'varkthos',
  name: 'Varkthos Ashscale',
  species: 'drakin',
  heroRarity: 'legendary',
  level: 5,
  classId: 'warrior',
  statBonuses: [
    { stat: 'attack', value: 12 },
    { stat: 'defense', value: 6 },
    { stat: 'maxHp', value: 30 },
  ],
  hireCostOverride: 3500,
  lore: 'He does not speak of the war. He does not need to. The scars do it for him.',
}

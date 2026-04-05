import type { UniqueHeroDefinition } from './_types'

/** A nine-tailed fox spirit of immense age, wandering the mortal world for amusement. */
export const yomikiri: UniqueHeroDefinition = {
  id: 'yomikiri',
  name: 'Yomikiri the Nine-Tailed',
  species: 'kitsune',
  heroRarity: 'legendary',
  level: 5,
  classId: 'trickster',
  statBonuses: [
    { stat: 'luck', value: 10 },
    { stat: 'wisdom', value: 8 },
    { stat: 'speed', value: 5 },
  ],
  hireCostOverride: 3000,
  lore: 'She has watched kingdoms rise and fall with the same bemused detachment. You are, at worst, mildly interesting.',
}

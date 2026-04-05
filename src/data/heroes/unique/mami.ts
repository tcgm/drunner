import type { UniqueHeroDefinition } from './_types'

/** Demon of greed. She had your wallet before you walked in the door. She prefers it this way. */
export const mami: UniqueHeroDefinition = {
  id: 'mami',
  name: 'Mami',
  species: 'devil',
  heroRarity: 'veryRare',
  level: 3,
  classId: 'rogue',
  statBonuses: [
    { stat: 'luck', value: 9 },
    { stat: 'speed', value: 7 },
    { stat: 'charisma', value: 5 },
  ],
  hireCostOverride: 1400,
  lore: '"I want your money," she says. "All of it. Over time. Through legitimate channels — I prefer earned wealth, the texture is better." The disclaimer makes it somehow worse.',
}

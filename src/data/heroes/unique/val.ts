import type { UniqueHeroDefinition } from './_types'

/** She commands serpents. She is the size of a large child and has the affect of a small god. The serpents listen. Everything else is catching up. */
export const val: UniqueHeroDefinition = {
  id: 'val',
  name: 'Val',
  species: 'devil',
  heroRarity: 'rare',
  level: 3,
  classId: 'mage',
  statBonuses: [
    { stat: 'luck', value: 7 },
    { stat: 'magicPower', value: 6 },
    { stat: 'wisdom', value: 4 },
  ],
  hireCostOverride: 900,
  lore: 'She commands serpents. She is approximately the size of a large child and has the affect of a small god. The serpents listen to her immediately. Everything else is still catching up.',
}

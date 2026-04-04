import type { UniqueHeroDefinition } from './_types'

/** A nekomata who is absolutely certain she can see the future. She cannot. Her luck, however, is genuinely absurd. */
export const clairevoyant: UniqueHeroDefinition = {
  id: 'clairevoyant',
  name: 'Claire Voyant',
  species: 'nekomata',
  heroRarity: 'rare',
  level: 3,
  classId: 'rogue',
  statBonuses: [
    { stat: 'luck', value: 12 },
    { stat: 'speed', value: 6 },
  ],
  hireCostOverride: 900,
  lore: '"I knew you\'d hire me," she says, every time, to everyone. Statistically she is incorrect more often than she should be by sheer random chance.',
}

import type { UniqueHeroDefinition } from './_types'

/** The first. She was here before the categories existed, and she will remind you, at her own pace, on her own schedule. */
export const lili: UniqueHeroDefinition = {
  id: 'lili',
  name: 'Lili',
  species: 'devil',
  heroRarity: 'legendary',
  level: 5,
  classId: 'mage',
  statBonuses: [
    { stat: 'magicPower', value: 14 },
    { stat: 'wisdom', value: 12 },
    { stat: 'luck', value: 6 },
  ],
  hireCostOverride: 3800,
  lore: 'She was here before Heaven and Hell finished sorting out the categories. Most of the rules that followed don\'t technically apply to her. She mentions this occasionally. Just occasionally.',
}

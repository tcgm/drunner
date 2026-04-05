import type { UniqueHeroDefinition } from './_types'

/** Demon of sloth. She did not want to come. She was carried. She contributes when she feels like it. The skeletons do most of the work. She considers this efficient management. */
export const belphy: UniqueHeroDefinition = {
  id: 'belphy',
  name: 'Belphy',
  species: 'devil',
  heroRarity: 'rare',
  level: 3,
  classId: 'necromancer',
  statBonuses: [
    { stat: 'wisdom', value: 6 },
    { stat: 'luck', value: 6 },
    { stat: 'maxHp', value: 15 },
  ],
  hireCostOverride: 900,
  lore: 'She did not want to come. Someone carried her. She raises skeletons because walking over there herself would involve getting up. She calls this "delegation." It works.',
}

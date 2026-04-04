import type { UniqueHeroDefinition } from './_types'

/** A kitsune who stumbled into adventuring and has been successfully failing upward ever since. */
export const jackielee: UniqueHeroDefinition = {
  id: 'jackielee',
  name: 'Jackie Lee',
  species: 'kitsune',
  heroRarity: 'uncommon',
  level: 2,
  classId: 'bard',
  statBonuses: [
    { stat: 'luck', value: 7 },
    { stat: 'charisma', value: 4 },
  ],
  hireCostOverride: 500,
  lore: '"Okay so I don\'t technically know what I\'m doing but I feel like that\'s kind of my thing at this point."',
}

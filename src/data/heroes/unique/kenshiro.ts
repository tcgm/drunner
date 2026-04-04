import type { UniqueHeroDefinition } from './_types'

/** An elderly tengu blade master who teaches by cutting first and explaining second. */
export const kenshiro: UniqueHeroDefinition = {
  id: 'kenshiro',
  name: 'Kenshiro of the Broken Wing',
  species: 'tengu',
  heroRarity: 'epic',
  level: 4,
  classId: 'rogue',
  statBonuses: [
    { stat: 'speed', value: 9 },
    { stat: 'attack', value: 6 },
    { stat: 'luck', value: 3 },
  ],
  hireCostOverride: 1600,
  lore: 'One wing broken in battle. Moves faster than any hero with two.',
}

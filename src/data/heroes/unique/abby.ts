import type { UniqueHeroDefinition } from './_types'

/** The Destroyer. The Bottomless Pit. The Angel of the Abyss. Everyone calls her Abby. She has stopped correcting them. She has not stopped finding it funny. */
export const abby: UniqueHeroDefinition = {
  id: 'abby',
  name: 'Abby',
  species: 'devil',
  heroRarity: 'mythic',
  level: 6,
    classId: 'archdevil',
  statBonuses: [
    { stat: 'attack', value: 16 },
    { stat: 'maxHp', value: 40 },
    { stat: 'defense', value: 10 },
  ],
  hireCostOverride: 6000,
  lore: 'She is the Destroyer. The Bottomless Pit. The Angel of the Abyss. Her name means ruin. Everyone calls her Abby. She has stopped correcting them. She has not stopped finding it funny.',
}

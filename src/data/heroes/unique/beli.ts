import type { UniqueHeroDefinition } from './_types'

/** Demon of worthlessness and lies. She is extraordinary at exactly one of those things. She is, she says, working on the other. She may or may not be lying about that too. */
export const beli: UniqueHeroDefinition = {
  id: 'beli',
  name: 'Beli',
  species: 'devil',
  heroRarity: 'veryRare',
  level: 3,
  classId: 'rogue',
  statBonuses: [
    { stat: 'speed', value: 8 },
    { stat: 'luck', value: 8 },
    { stat: 'charisma', value: 4 },
  ],
  hireCostOverride: 1350,
  lore: 'Demon of worthlessness and lies. She is extraordinary at exactly one of those things. She is working on the other, she says. She may or may not be lying about working on it.',
}

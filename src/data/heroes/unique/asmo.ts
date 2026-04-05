import type { UniqueHeroDefinition } from './_types'

/** Demon of passion and frankly impeccable taste in absolutely everything. She will tell you exactly how impeccable in great and unnecessary detail. */
export const asmo: UniqueHeroDefinition = {
  id: 'asmo',
  name: 'Asmo',
  species: 'devil',
  heroRarity: 'legendary',
  level: 5,
    classId: 'archdevil',
  statBonuses: [
    { stat: 'charisma', value: 14 },
    { stat: 'luck', value: 10 },
    { stat: 'speed', value: 6 },
  ],
  hireCostOverride: 3300,
  lore: 'She has impeccable taste in everything. Music. Food. People. She will tell you exactly how impeccable, at length, with specific examples. You will agree with most of it.',
}

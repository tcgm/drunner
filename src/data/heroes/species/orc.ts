import type { SpeciesDefinition } from './_types'

export const orc: SpeciesDefinition = {
  id: 'orc',
  name: 'Orc',
  description: 'Ferocious and powerful, orcs hit harder than any other race.',
  statBonuses: [
    { stat: 'attack', value: 4 },
    { stat: 'defense', value: 1 },
  ],
  nameStyle: 'orcish',
  spawnRarity: 'common',
}

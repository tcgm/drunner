import type { SpeciesDefinition } from './_types'

export const human: SpeciesDefinition = {
  id: 'human',
  name: 'Human',
  description: 'Adaptable and resilient, humans excel in no single area but are limited in none.',
  statBonuses: [
    { stat: 'charisma', value: 2 },
    { stat: 'luck', value: 1 },
  ],
  nameStyle: 'common',
  spawnRarity: 'common',
}

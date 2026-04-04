import type { SpeciesDefinition } from './_types'

export const fae: SpeciesDefinition = {
  id: 'fae',
  name: 'Fae',
  description: 'Born of wild magic, fae slip between worlds with preternatural speed and uncanny fortune.',
  statBonuses: [
    { stat: 'luck', value: 4 },
    { stat: 'speed', value: 3 },
    { stat: 'wisdom', value: 2 },
  ],
  nameStyle: 'sylvan',
  spawnRarity: 'uncommon',
}

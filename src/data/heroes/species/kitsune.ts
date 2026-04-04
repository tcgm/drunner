import type { SpeciesDefinition } from './_types'

export const kitsune: SpeciesDefinition = {
  id: 'kitsune',
  name: 'Kitsune',
  description: 'Ancient fox spirits of shifting magic, wielding illusion and fortune as effortlessly as breath.',
  statBonuses: [
    { stat: 'luck', value: 4 },
    { stat: 'wisdom', value: 3 },
    { stat: 'speed', value: 2 },
  ],
  nameStyle: 'yokai',
  spawnRarity: 'uncommon',
}

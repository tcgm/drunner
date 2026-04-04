import type { SpeciesDefinition } from './_types'

export const tengu: SpeciesDefinition = {
  id: 'tengu',
  name: 'Tengu',
  description: 'Proud mountain warriors of wind and blade, their mastery of combat and sky is unmatched.',
  statBonuses: [
    { stat: 'speed', value: 4 },
    { stat: 'wisdom', value: 3 },
    { stat: 'attack', value: 3 },
  ],
  nameStyle: 'yokai',
  spawnRarity: 'rare',
}

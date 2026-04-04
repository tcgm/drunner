import type { SpeciesDefinition } from './_types'

export const devil: SpeciesDefinition = {
  id: 'devil',
  name: 'Devil',
  description: 'Forged in the infernal courts, devils wield dark charisma and cruel cunning as weapons.',
  statBonuses: [
    { stat: 'charisma', value: 5 },
    { stat: 'attack', value: 4 },
    { stat: 'wisdom', value: 3 },
  ],
  nameStyle: 'infernal',
  spawnRarity: 'epic',
}

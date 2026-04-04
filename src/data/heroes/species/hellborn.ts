import type { SpeciesDefinition } from './_types'

export const hellborn: SpeciesDefinition = {
  id: 'hellborn',
  name: 'Hellborn',
  description: 'Touched by infernal heritage, hellborn channel dark power with unnerving charm.',
  statBonuses: [
    { stat: 'charisma', value: 3 },
    { stat: 'wisdom', value: 2 },
  ],
  nameStyle: 'infernal',
  spawnRarity: 'uncommon',
}

import type { SpeciesDefinition } from './_types'

export const gnome: SpeciesDefinition = {
  id: 'gnome',
  name: 'Gnome',
  description: 'Clever and inventive, gnomes channel arcane energy with unusual efficiency.',
  statBonuses: [
    { stat: 'wisdom', value: 2 },
    { stat: 'luck', value: 2 },
  ],
  nameStyle: 'gnomish',
  spawnRarity: 'common',
}

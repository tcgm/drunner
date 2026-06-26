import foregroundImage from '@/assets/icons/species/foreground/gnome.svg'
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
  backgroundIcon: 'GiBadGnome',
  foregroundImage,
  foregroundOffset: { x: 0, y: -20.777765909830727, scale: 1 },
}

import type { SpeciesDefinition } from './_types'

export const celestine: SpeciesDefinition = {
  id: 'celestine',
  name: 'Celestine',
  description: 'Blessed by divine ancestry, celestial children radiate power and inspire allies around them.',
  statBonuses: [
    { stat: 'charisma', value: 2 },
    { stat: 'maxHp', value: 10 },
    { stat: 'wisdom', value: 1 },
  ],
  nameStyle: 'celestial',
  spawnRarity: 'uncommon',
}

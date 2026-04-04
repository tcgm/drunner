import type { SpeciesDefinition } from './_types'

export const angel: SpeciesDefinition = {
  id: 'angel',
  name: 'Angel',
  description: 'Emissaries of the divine, angels are beings of radiant power whose very presence inspires awe.',
  statBonuses: [
    { stat: 'wisdom', value: 6 },
    { stat: 'charisma', value: 5 },
    { stat: 'maxHp', value: 25 },
  ],
  nameStyle: 'celestial',
  spawnRarity: 'legendary',
}

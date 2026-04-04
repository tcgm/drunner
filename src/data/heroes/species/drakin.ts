import type { SpeciesDefinition } from './_types'

export const drakin: SpeciesDefinition = {
  id: 'drakin',
  name: 'Drakin',
  description: 'Descendants of ancient dragons, drakin carry draconic blood in their veins — along with its fury.',
  statBonuses: [
    { stat: 'attack', value: 5 },
    { stat: 'defense', value: 3 },
    { stat: 'maxHp', value: 10 },
  ],
  nameStyle: 'draconic',
  spawnRarity: 'rare',
}

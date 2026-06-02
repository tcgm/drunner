import type { SpeciesDefinition } from './_types'

export const construct: SpeciesDefinition = {
  id: 'construct',
  name: 'Construct',
  description: 'Animated by arcane engineering or forgotten rune-craft, constructs do not live — they persist. They feel no fear, no hunger, and no doubt.',
  statBonuses: [
    { stat: 'defense', value: 7 },
    { stat: 'maxHp', value: 25 },
    { stat: 'attack', value: 3 },
  ],
  nameStyle: 'gnomish',
  spawnRarity: 'epic',
}

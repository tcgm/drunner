import type { SpeciesDefinition } from './_types'

export const elf: SpeciesDefinition = {
  id: 'elf',
  name: 'Elf',
  description: 'Graceful and perceptive, elves have keen senses and affinity with magic.',
  statBonuses: [
    { stat: 'wisdom', value: 3 },
    { stat: 'speed', value: 2 },
  ],
  nameStyle: 'elven',
  spawnRarity: 'common',
}

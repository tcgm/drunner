import type { SpeciesDefinition } from './_types'

export const halfling: SpeciesDefinition = {
  id: 'halfling',
  name: 'Halfling',
  description: 'Small and surprisingly lucky, halflings have an uncanny knack for avoiding disaster.',
  statBonuses: [
    { stat: 'luck', value: 4 },
    { stat: 'speed', value: 2 },
  ],
  nameStyle: 'halfling',
  spawnRarity: 'common',
}

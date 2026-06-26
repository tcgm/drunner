import type { SpeciesDefinition } from './_types'
import backgroundImage from '@/assets/icons/species/background/halfling.svg'

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
  backgroundIcon: 'GiFootprint',
  backgroundImage,
  backgroundOffset: { x: 0, y: -25.55554707845052, scale: 1 },
}

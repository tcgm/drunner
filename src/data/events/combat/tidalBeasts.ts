import type { DungeonEvent } from '@/types'
import { GiBigWave } from 'react-icons/gi'

export const TIDAL_BEASTS: DungeonEvent = {
  id: 'tidal-beasts',
  type: 'combat',
  title: 'Tidal Beasts',
  description: 'Massive aquatic horrors surge with overwhelming force!',
  choices: [
    {
      text: 'Weather the tide',
      outcome: {
        text: 'The crushing waves batter you!',
        effects: [
          { type: 'damage', target: 'all', value: 36 },
          { type: 'xp', value: 149 },
          { type: 'gold', value: 93 },
        ],
      },
    },
    {
      text: 'Swim with the current (Speed check)',
      requirements: { stat: 'speed', minValue: 52 },
      outcome: {
        text: 'You ride the waves!',
        effects: [
          { type: 'damage', target: 'all', value: 27 },
          { type: 'xp', value: 164 },
          { type: 'gold', value: 104 },
        ],
      },
    },
  ],
  depth: 30,
  icon: GiBigWave,
}

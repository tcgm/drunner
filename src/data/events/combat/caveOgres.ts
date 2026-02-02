import type { DungeonEvent } from '@/types'
import { GiCaveman } from 'react-icons/gi'

export const CAVE_OGRES: DungeonEvent = {
  id: 'cave-ogres',
  type: 'combat',
  title: 'Cave Ogres',
  description: 'Massive brutes wielding crude clubs lumber toward you!',
  choices: [
    {
      text: 'Stand your ground',
      outcome: {
        text: 'You weather their crushing blows!',
        effects: [
          { type: 'damage', target: 'strongest', value: 24 },
          { type: 'xp', value: 88 },
          { type: 'gold', value: 52 },
        ],
      },
    },
    {
      text: 'Dodge and counter (Speed check)',
      requirements: { stat: 'speed', minValue: 28 },
      outcome: {
        text: 'You use their size against them!',
        effects: [
          { type: 'damage', target: 'strongest', value: 17 },
          { type: 'xp', value: 98 },
          { type: 'gold', value: 60 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiCaveman,
}

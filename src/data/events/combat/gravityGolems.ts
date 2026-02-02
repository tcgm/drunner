import type { DungeonEvent } from '@/types'
import { GiAnvilImpact } from 'react-icons/gi'

export const GRAVITY_GOLEMS: DungeonEvent = {
  id: 'gravity-golems',
  type: 'combat',
  title: 'Gravity Golems',
  description: 'Constructs that control gravitational forces crush you under immense weight!',
  choices: [
    {
      text: 'Fight under pressure',
      outcome: {
        text: 'Gravity pins you down!',
        effects: [
          { type: 'damage', target: 'strongest', value: 82 },
          { type: 'xp', value: 405 },
          { type: 'gold', value: 293 },
        ],
      },
    },
    {
      text: 'Strength endurance (Strength check)',
      requirements: { stat: 'attack', minValue: 145 },
      outcome: {
        text: 'You power through the pressure!',
        effects: [
          { type: 'damage', target: 'strongest', value: 71 },
          { type: 'xp', value: 425 },
          { type: 'gold', value: 300 },
        ],
      },
    },
  ],
  depth: 59,
  icon: GiAnvilImpact,
}

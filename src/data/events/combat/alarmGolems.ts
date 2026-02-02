import type { DungeonEvent } from '@/types'
import { GiBugleCall } from 'react-icons/gi'

export const ALARM_GOLEMS: DungeonEvent = {
  id: 'alarm-golems',
  type: 'combat',
  title: 'Alarm Golems',
  description: 'Constructs that alert others with piercing sounds!',
  choices: [
    {
      text: 'Silence them fast (Speed check)',
      requirements: { stat: 'speed', minValue: 28 },
      outcome: {
        text: 'You destroy them before the alarm!',
        effects: [
          { type: 'damage', target: 'strongest', value: 16 },
          { type: 'xp', value: 107 },
          { type: 'gold', value: 68 },
        ],
      },
    },
    {
      text: 'Let them call and fight',
      outcome: {
        text: 'Reinforcements arrive!',
        effects: [
          { type: 'damage', target: 'strongest', value: 27 },
          { type: 'xp', value: 92 },
          { type: 'gold', value: 58 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiBugleCall,
}

import type { DungeonEvent } from '@/types'
import { GiBoneGnawer } from 'react-icons/gi'

export const DUNGEON_SCAVENGERS: DungeonEvent = {
  id: 'dungeon-scavengers',
  type: 'combat',
  title: 'Dungeon Scavengers',
  description: 'Hooded figures wielding rusty knives emerge from the shadows!',
  choices: [
    {
      text: 'Engage them',
      outcome: {
        text: 'You fight off the desperate scavengers!',
        effects: [
          { type: 'damage', target: 'random', value: 13 },
          { type: 'xp', value: 42 },
          { type: 'gold', value: 25 },
        ],
      },
    },
    {
      text: 'Disarm them (Speed check)',
      requirements: { stat: 'speed', minValue: 13 },
      outcome: {
        text: 'You knock away their weapons!',
        effects: [
          { type: 'damage', target: 'random', value: 8 },
          { type: 'xp', value: 52 },
          { type: 'gold', value: 33 },
        ],
      },
    },
  ],
  depth: 6,
  icon: GiBoneGnawer,
}

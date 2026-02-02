import type { DungeonEvent } from '@/types'
import { GiWingedEmblem } from 'react-icons/gi'

export const STONE_ANGELS: DungeonEvent = {
  id: 'stone-angels',
  type: 'combat',
  title: 'Stone Angels',
  description: 'Corrupted statues with broken wings attack with stone fists!',
  choices: [
    {
      text: 'Fight the statues',
      outcome: {
        text: 'You chip away at their stone forms!',
        effects: [
          { type: 'damage', target: 'all', value: 16 },
          { type: 'xp', value: 70 },
          { type: 'gold', value: 42 },
        ],
      },
    },
    {
      text: 'Heavy blows (Strength check)',
      requirements: { stat: 'strength', minValue: 30 },
      outcome: {
        text: 'You shatter them with powerful strikes!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 85 },
          { type: 'gold', value: 52 },
        ],
      },
    },
  ],
  depth: 11,
  icon: GiWingedEmblem,
}

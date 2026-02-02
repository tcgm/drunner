import type { DungeonEvent } from '@/types'
import { GiWingedSword } from 'react-icons/gi'

export const ANIMATED_BLADES: DungeonEvent = {
  id: 'animated-blades',
  type: 'combat',
  title: 'Animated Blades',
  description: 'Enchanted swords float and spin through the air, attacking on their own!',
  choices: [
    {
      text: 'Deflect the blades',
      outcome: {
        text: 'You parry the magical weapons!',
        effects: [
          { type: 'damage', target: 'random', value: 14 },
          { type: 'xp', value: 50 },
          { type: 'gold', value: 26 },
        ],
      },
    },
    {
      text: 'Shield block (Defense check)',
      requirements: { stat: 'defense', minValue: 16 },
      outcome: {
        text: 'You block them until the magic fades!',
        effects: [
          { type: 'damage', target: 'random', value: 9 },
          { type: 'xp', value: 60 },
          { type: 'gold', value: 34 },
        ],
      },
    },
  ],
  depth: 7,
  icon: GiWingedSword,
}

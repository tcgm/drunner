import type { DungeonEvent } from '@/types'
import { GiEvilMoon } from 'react-icons/gi'

export const LUNAR_HORRORS: DungeonEvent = {
  id: 'lunar-horrors',
  type: 'combat',
  title: 'Lunar Horrors',
  description: 'Nightmare creatures from a dead moon phase in and out of sight!',
  choices: [
    {
      text: 'Hunt in the dark',
      outcome: {
        text: 'They ambush from shadows!',
        effects: [
          { type: 'damage', target: 'weakest', value: 77 },
          { type: 'xp', value: 380 },
          { type: 'gold', value: 275 },
        ],
      },
    },
    {
      text: 'Shadow step (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You move through darkness like them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 66 },
          { type: 'xp', value: 400 },
          { type: 'gold', value: 295 },
        ],
      },
    },
  ],
  depth: 55,
  icon: GiEvilMoon,
}

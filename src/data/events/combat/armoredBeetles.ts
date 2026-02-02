import type { DungeonEvent } from '@/types'
import { GiSpikedShell } from 'react-icons/gi'

export const ARMORED_BEETLES: DungeonEvent = {
  id: 'armored-beetles',
  type: 'combat',
  title: 'Armored Beetles',
  description: 'Giant beetles with hard shells scuttle aggressively toward you!',
  choices: [
    {
      text: 'Attack their shells',
      outcome: {
        text: 'You crack through their armor!',
        effects: [
          { type: 'damage', target: 'strongest', value: 13 },
          { type: 'xp', value: 44 },
          { type: 'gold', value: 23 },
        ],
      },
    },
    {
      text: 'Flip them over (Strength check)',
      requirements: { stat: 'strength', minValue: 14 },
      outcome: {
        text: 'You expose their vulnerable undersides!',
        effects: [
          { type: 'damage', target: 'strongest', value: 8 },
          { type: 'xp', value: 54 },
          { type: 'gold', value: 31 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiSpikedShell,
}

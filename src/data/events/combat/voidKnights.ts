import type { DungeonEvent } from '@/types'
import { GiBlackKnightHelm } from 'react-icons/gi'

export const VOID_KNIGHTS: DungeonEvent = {
  id: 'void-knights',
  type: 'combat',
  title: 'Void Knights',
  description: 'Warriors clad in living darkness swing weapons of pure void!',
  choices: [
    {
      text: 'Face them head-on',
      outcome: {
        text: 'Their void weapons drain your life!',
        effects: [
          { type: 'damage', target: 'strongest', value: 28 },
          { type: 'xp', value: 120 },
          { type: 'gold', value: 75 },
        ],
      },
    },
    {
      text: 'Defensive combat (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You outlast their assault!',
        effects: [
          { type: 'damage', target: 'strongest', value: 20 },
          { type: 'xp', value: 140 },
          { type: 'gold', value: 90 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiBlackKnightHelm,
}

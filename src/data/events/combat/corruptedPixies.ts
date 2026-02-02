import type { DungeonEvent } from '@/types'
import { GiFairyWand } from 'react-icons/gi'

export const CORRUPTED_PIXIES: DungeonEvent = {
  id: 'corrupted-pixies',
  type: 'combat',
  title: 'Corrupted Pixies',
  description: 'Dark fey creatures cast malicious spells and illusions!',
  choices: [
    {
      text: 'Chase them down',
      outcome: {
        text: 'Their illusions confuse you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 23 },
          { type: 'xp', value: 106 },
          { type: 'gold', value: 64 },
        ],
      },
    },
    {
      text: 'See through illusions (Speed check)',
      requirements: { stat: 'speed', minValue: 43 },
      outcome: {
        text: 'You track their true positions!',
        effects: [
          { type: 'damage', target: 'weakest', value: 16 },
          { type: 'xp', value: 126 },
          { type: 'gold', value: 79 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiFairyWand,
}

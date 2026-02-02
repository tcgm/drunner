import type { DungeonEvent } from '@/types'
import { GiMushrooms } from 'react-icons/gi'

export const SPORE_BLOOMS: DungeonEvent = {
  id: 'spore-blooms',
  type: 'combat',
  title: 'Spore Blooms',
  description: 'Massive fungi release clouds of hallucinogenic spores!',
  choices: [
    {
      text: 'Breathe and fight',
      outcome: {
        text: 'Hallucinations confuse you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 13 },
          { type: 'xp', value: 58 },
          { type: 'gold', value: 36 },
        ],
      },
    },
    {
      text: 'Cover your mouth (Defense check)',
      requirements: { stat: 'defense', minValue: 21 },
      outcome: {
        text: 'You resist the spores!',
        effects: [
          { type: 'damage', target: 'weakest', value: 8 },
          { type: 'xp', value: 68 },
          { type: 'gold', value: 42 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiMushrooms,
}

import type { DungeonEvent } from '@/types'
import { GiSlime } from 'react-icons/gi'

export const OOZE_BLOBS: DungeonEvent = {
  id: 'ooze-blobs',
  type: 'combat',
  title: 'Ooze Blobs',
  description: 'Acidic ooze puddles flow together, forming aggressive blobs!',
  choices: [
    {
      text: 'Attack with weapons',
      outcome: {
        text: 'Your weapons sizzle in the acidic slime!',
        effects: [
          { type: 'damage', target: 'strongest', value: 14 },
          { type: 'xp', value: 48 },
          { type: 'gold', value: 21 },
        ],
      },
    },
    {
      text: 'Use magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magical energy evaporates the ooze!',
        effects: [
          { type: 'damage', target: 'strongest', value: 7 },
          { type: 'xp', value: 58 },
          { type: 'gold', value: 29 },
        ],
      },
    },
  ],
  depth: 7,
  icon: GiSlime,
}

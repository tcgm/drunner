import type { DungeonEvent } from '@/types'
import { GiSplitCross } from 'react-icons/gi'

export const HERETIC_MONKS: DungeonEvent = {
  id: 'heretic-monks',
  type: 'combat',
  title: 'Heretic Monks',
  description: 'Corrupted holy men channel dark miracles!',
  choices: [
    {
      text: 'Fight them',
      outcome: {
        text: 'Their twisted prayers weaken you!',
        effects: [
          { type: 'damage', target: 'random', value: 37 },
          { type: 'xp', value: 172 },
          { type: 'gold', value: 120 },
        ],
      },
    },
    {
      text: 'True faith (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Your belief overpowers theirs!',
        effects: [
          { type: 'damage', target: 'random', value: 27 },
          { type: 'xp', value: 192 },
          { type: 'gold', value: 140 },
        ],
      },
    },
  ],
  depth: 27,
  icon: GiSplitCross,
}

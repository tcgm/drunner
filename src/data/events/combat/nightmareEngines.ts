import type { DungeonEvent } from '@/types'
import { GiAbstract034 } from 'react-icons/gi'

export const NIGHTMARE_ENGINES: DungeonEvent = {
  id: 'nightmare-engines',
  type: 'combat',
  title: 'Nightmare Engines',
  description: 'Mechanical constructs powered by fear and nightmares!',
  choices: [
    {
      text: 'Destroy the engines',
      outcome: {
        text: 'Nightmare fuel leaks everywhere!',
        effects: [
          { type: 'damage', target: 'strongest', value: 125 },
          { type: 'xp', value: 670 },
          { type: 'gold', value: 545 },
        ],
      },
    },
    {
      text: 'Dismantle carefully (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You shut down their systems!',
        effects: [
          { type: 'damage', target: 'strongest', value: 114 },
          { type: 'xp', value: 690 },
          { type: 'gold', value: 565 },
        ],
      },
    },
  ],
  depth: 84,
  icon: GiAbstract034,
}

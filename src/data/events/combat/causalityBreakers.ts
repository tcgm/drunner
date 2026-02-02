import type { DungeonEvent } from '@/types'
import { GiAbstract046 } from 'react-icons/gi'

export const CAUSALITY_BREAKERS: DungeonEvent = {
  id: 'causality-breakers',
  type: 'combat',
  title: 'Causality Breakers',
  description: 'Beings that sever cause and effect!',
  choices: [
    {
      text: 'Accept broken causality',
      outcome: {
        text: 'Effects happen before causes!',
        effects: [
          { type: 'damage', target: 'strongest', value: 158 },
          { type: 'xp', value: 845 },
          { type: 'gold', value: 656 },
        ],
      },
    },
    {
      text: 'Restore logic (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your conviction repairs causality!',
        effects: [
          { type: 'damage', target: 'strongest', value: 147 },
          { type: 'xp', value: 865 },
          { type: 'gold', value: 676 },
        ],
      },
    },
  ],
  depth: 88,
  icon: GiAbstract046,
}

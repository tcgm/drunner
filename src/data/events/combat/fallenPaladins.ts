import type { DungeonEvent } from '@/types'
import { GiChainMail } from 'react-icons/gi'

export const FALLEN_PALADINS: DungeonEvent = {
  id: 'fallen-paladins',
  type: 'combat',
  title: 'Fallen Paladins',
  description: 'Once-holy warriors now serve darkness, wielding corrupted blades!',
  choices: [
    {
      text: 'Battle them',
      outcome: {
        text: 'You fight the corrupted champions!',
        effects: [
          { type: 'damage', target: 'strongest', value: 23 },
          { type: 'xp', value: 86 },
          { type: 'gold', value: 51 },
        ],
      },
    },
    {
      text: 'Power strikes (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'You match their combat prowess!',
        effects: [
          { type: 'damage', target: 'strongest', value: 16 },
          { type: 'xp', value: 96 },
          { type: 'gold', value: 59 },
        ],
      },
    },
  ],
  depth: 13,
  icon: GiChainMail,
}

import type { DungeonEvent } from '@/types'
import { GiAbstract053 } from 'react-icons/gi'

export const LOGIC_DESTROYERS: DungeonEvent = {
  id: 'logic-destroyers',
  type: 'combat',
  title: 'Logic Destroyers',
  description: 'Beings that break the laws of reason!',
  choices: [
    {
      text: 'Accept illogic',
      outcome: {
        text: 'Contradictions tear your mind!',
        effects: [
          { type: 'damage', target: 'strongest', value: 169 },
          { type: 'xp', value: 898 },
          { type: 'gold', value: 698 },
        ],
      },
    },
    {
      text: 'Enforce logic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You bind them with mathematics!',
        effects: [
          { type: 'damage', target: 'strongest', value: 158 },
          { type: 'xp', value: 918 },
          { type: 'gold', value: 718 },
        ],
      },
    },
  ],
  depth: 89,
  icon: GiAbstract053,
}

import type { DungeonEvent } from '@/types'
import { GiMagicLamp } from 'react-icons/gi'

export const CURSED_DJINN: DungeonEvent = {
  id: 'cursed-djinn',
  type: 'combat',
  title: 'Cursed Djinn',
  description: 'A twisted genie bound to evil grants only pain!',
  choices: [
    {
      text: 'Break their binding',
      outcome: {
        text: 'They lash out in rage!',
        effects: [
          { type: 'damage', target: 'strongest', value: 33 },
          { type: 'xp', value: 134 },
          { type: 'gold', value: 84 },
        ],
      },
    },
    {
      text: 'Magic contest (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You overpower their wishes!',
        effects: [
          { type: 'damage', target: 'strongest', value: 23 },
          { type: 'xp', value: 149 },
          { type: 'gold', value: 95 },
        ],
      },
    },
  ],
  depth: 22,
  icon: GiMagicLamp,
}

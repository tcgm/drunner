import type { DungeonEvent } from '@/types'
import { GiCobweb } from 'react-icons/gi'

export const WEB_HORRORS: DungeonEvent = {
  id: 'web-horrors',
  type: 'combat',
  title: 'Web Horrors',
  description: 'Massive arachnid aberrations trap you in sticky webs!',
  choices: [
    {
      text: 'Break free and fight',
      outcome: {
        text: 'The webs slow your movements!',
        effects: [
          { type: 'damage', target: 'strongest', value: 62 },
          { type: 'xp', value: 292 },
          { type: 'gold', value: 210 },
        ],
      },
    },
    {
      text: 'Burn the webs (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Flames consume the sticky trap!',
        effects: [
          { type: 'damage', target: 'strongest', value: 51 },
          { type: 'xp', value: 312 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 45,
  icon: GiCobweb,
}

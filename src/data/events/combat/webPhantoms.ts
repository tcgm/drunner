import type { DungeonEvent } from '@/types'
import { GiCobweb } from 'react-icons/gi'

export const WEB_PHANTOMS: DungeonEvent = {
  id: 'web-phantoms',
  type: 'combat',
  title: 'Web Phantoms',
  description: 'Ghosts trapped in ancient spider webs lash out!',
  choices: [
    {
      text: 'Tear through the webs',
      outcome: {
        text: 'The spirits drain your strength!',
        effects: [
          { type: 'damage', target: 'strongest', value: 48 },
          { type: 'xp', value: 242 },
          { type: 'gold', value: 165 },
        ],
      },
    },
    {
      text: 'Free their souls (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'They dissipate peacefully!',
        effects: [
          { type: 'damage', target: 'strongest', value: 37 },
          { type: 'xp', value: 262 },
          { type: 'gold', value: 185 },
        ],
      },
    },
  ],
  depth: 39,
  icon: GiCobweb,
}

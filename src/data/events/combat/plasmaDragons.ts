import type { DungeonEvent } from '@/types'
import { GiFireBreath } from 'react-icons/gi'

export const PLASMA_DRAGONS: DungeonEvent = {
  id: 'plasma-dragons',
  type: 'combat',
  title: 'Plasma Dragons',
  description: 'Dragons that breathe superheated plasma incinerate everything!',
  choices: [
    {
      text: 'Face the plasma',
      outcome: {
        text: 'Extreme heat vaporizes flesh!',
        effects: [
          { type: 'damage', target: 'strongest', value: 98 },
          { type: 'xp', value: 500 },
          { type: 'gold', value: 378 },
        ],
      },
    },
    {
      text: 'Cooling field (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic tempers the heat!',
        effects: [
          { type: 'damage', target: 'strongest', value: 87 },
          { type: 'xp', value: 520 },
          { type: 'gold', value: 398 },
        ],
      },
    },
  ],
  depth: 69,
  icon: GiFireBreath,
}

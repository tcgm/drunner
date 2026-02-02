import type { DungeonEvent } from '@/types'
import { GiLightningFrequency } from 'react-icons/gi'

export const PLASMA_BEINGS: DungeonEvent = {
  id: 'plasma-beings',
  type: 'combat',
  title: 'Plasma Beings',
  description: 'Creatures of superheated ionized gas crackle with energy!',
  choices: [
    {
      text: 'Engage them',
      outcome: {
        text: 'Extreme heat and electricity burn!',
        effects: [
          { type: 'damage', target: 'all', value: 66 },
          { type: 'xp', value: 345 },
          { type: 'gold', value: 248 },
        ],
      },
    },
    {
      text: 'Dissipate energy (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You cool the plasma!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 365 },
          { type: 'gold', value: 268 },
        ],
      },
    },
  ],
  depth: 49,
  icon: GiLightningFrequency,
}

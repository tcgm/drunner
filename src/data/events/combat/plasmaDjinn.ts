import type { DungeonEvent } from '@/types'
import { GiLightningStorm } from 'react-icons/gi'

export const PLASMA_DJINN: DungeonEvent = {
  id: 'plasma-djinn',
  type: 'combat',
  title: 'Plasma Djinn',
  description: 'Genies of superheated matter attack with burning plasma!',
  choices: [
    {
      text: 'Face the plasma',
      outcome: {
        text: 'Extreme heat melts everything!',
        effects: [
          { type: 'damage', target: 'random', value: 81 },
          { type: 'xp', value: 403 },
          { type: 'gold', value: 296 },
        ],
      },
    },
    {
      text: 'Magic shield (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Your barrier deflects plasma!',
        effects: [
          { type: 'damage', target: 'random', value: 70 },
          { type: 'xp', value: 423 },
          { type: 'gold', value: 316 },
        ],
      },
    },
  ],
  depth: 51,
  icon: GiLightningStorm,
}

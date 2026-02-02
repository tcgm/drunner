import type { DungeonEvent } from '@/types'
import { GiLaserWarning } from 'react-icons/gi'

export const BEAM_STALKERS: DungeonEvent = {
  id: 'beam-stalkers',
  type: 'combat',
  title: 'Beam Stalkers',
  description: 'Creatures that fire concentrated energy beams!',
  choices: [
    {
      text: 'Take cover and advance',
      outcome: {
        text: 'Beams pierce your shield!',
        effects: [
          { type: 'damage', target: 'strongest', value: 74 },
          { type: 'xp', value: 368 },
          { type: 'gold', value: 266 },
        ],
      },
    },
    {
      text: 'Reflect the beams (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic mirrors send beams back!',
        effects: [
          { type: 'damage', target: 'strongest', value: 63 },
          { type: 'xp', value: 388 },
          { type: 'gold', value: 286 },
        ],
      },
    },
  ],
  depth: 57,
  icon: GiLaserWarning,
}

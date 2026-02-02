import type { DungeonEvent } from '@/types'
import { GiSpottedArrowhead } from 'react-icons/gi'

export const ANTIMATTER_ELEMENTALS: DungeonEvent = {
  id: 'antimatter-elementals',
  type: 'combat',
  title: 'Antimatter Elementals',
  description: 'Beings of antimatter annihilate anything they touch!',
  choices: [
    {
      text: 'Avoid contact',
      outcome: {
        text: 'Matter-antimatter explosions devastate!',
        effects: [
          { type: 'damage', target: 'all', value: 91 },
          { type: 'xp', value: 475 },
          { type: 'gold', value: 355 },
        ],
      },
    },
    {
      text: 'Containment field (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic isolates the antimatter!',
        effects: [
          { type: 'damage', target: 'all', value: 80 },
          { type: 'xp', value: 495 },
          { type: 'gold', value: 375 },
        ],
      },
    },
  ],
  depth: 63,
  icon: GiSpottedArrowhead,
}

import type { DungeonEvent } from '@/types'
import { GiMagicPortal } from 'react-icons/gi'

export const VOID_PORTALS: DungeonEvent = {
  id: 'void-portals',
  type: 'combat',
  title: 'Void Portals',
  description: 'Living gateways to nothingness try to consume you!',
  choices: [
    {
      text: 'Resist the pull',
      outcome: {
        text: 'The void tears at your essence!',
        effects: [
          { type: 'damage', target: 'all', value: 122 },
          { type: 'xp', value: 650 },
          { type: 'gold', value: 502 },
        ],
      },
    },
    {
      text: 'Seal the portals (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Magic closes the gateways!',
        effects: [
          { type: 'damage', target: 'all', value: 111 },
          { type: 'xp', value: 670 },
          { type: 'gold', value: 522 },
        ],
      },
    },
  ],
  depth: 70,
  icon: GiMagicPortal,
}

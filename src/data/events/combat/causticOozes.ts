import type { DungeonEvent } from '@/types'
import { GiAcidBlob } from 'react-icons/gi'

export const CAUSTIC_OOZES: DungeonEvent = {
  id: 'caustic-oozes',
  type: 'combat',
  title: 'Caustic Oozes',
  description: 'Highly acidic slimes dissolve everything they touch!',
  choices: [
    {
      text: 'Attack with weapons',
      outcome: {
        text: 'Your weapons corrode in the acid!',
        effects: [
          { type: 'damage', target: 'all', value: 24 },
          { type: 'xp', value: 108 },
          { type: 'gold', value: 66 },
        ],
      },
    },
    {
      text: 'Freeze them (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'Ice magic solidifies the ooze!',
        effects: [
          { type: 'damage', target: 'all', value: 17 },
          { type: 'xp', value: 128 },
          { type: 'gold', value: 81 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiAcidBlob,
}

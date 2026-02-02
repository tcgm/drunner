import type { DungeonEvent } from '@/types'
import { GiSalamander } from 'react-icons/gi'

export const FLAME_NEWTS: DungeonEvent = {
  id: 'flame-newts',
  type: 'combat',
  title: 'Flame Newts',
  description: 'Small reptiles that spit fire scurry around your feet!',
  choices: [
    {
      text: 'Stomp them out',
      outcome: {
        text: 'They spray fire everywhere!',
        effects: [
          { type: 'damage', target: 'all', value: 9 },
          { type: 'xp', value: 33 },
          { type: 'gold', value: 16 },
        ],
      },
    },
    {
      text: 'Quick reflexes (Speed check)',
      requirements: { stat: 'speed', minValue: 11 },
      outcome: {
        text: 'You catch them before they ignite!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 43 },
          { type: 'gold', value: 24 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiSalamander,
}

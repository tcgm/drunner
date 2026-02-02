import type { DungeonEvent } from '@/types'
import { GiPoisonBottle } from 'react-icons/gi'

export const TOXIC_IMPS: DungeonEvent = {
  id: 'toxic-imps',
  type: 'combat',
  title: 'Toxic Imps',
  description: 'Small demons giggle as they hurl vials of poison!',
  choices: [
    {
      text: 'Rush them',
      outcome: {
        text: 'You close distance and attack!',
        effects: [
          { type: 'damage', target: 'weakest', value: 13, isTrueDamage: true },
          { type: 'xp', value: 45 },
          { type: 'gold', value: 22 },
        ],
      },
    },
    {
      text: 'Dodge vials (Speed check)',
      requirements: { stat: 'speed', minValue: 15 },
      outcome: {
        text: 'You avoid their projectiles!',
        effects: [
          { type: 'damage', target: 'weakest', value: 7, isTrueDamage: true },
          { type: 'xp', value: 55 },
          { type: 'gold', value: 30 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiPoisonBottle,
}

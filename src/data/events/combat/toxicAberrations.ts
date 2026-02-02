import type { DungeonEvent } from '@/types'
import { GiBrandyBottle } from 'react-icons/gi'

export const TOXIC_ABERRATIONS: DungeonEvent = {
  id: 'toxic-aberrations',
  type: 'combat',
  title: 'Toxic Aberrations',
  description: 'Mutated horrors ooze with lethal toxins!',
  choices: [
    {
      text: 'Cut them down',
      outcome: {
        text: 'Poison sprays everywhere!',
        effects: [
          { type: 'damage', target: 'all', value: 44, isTrueDamage: true },
          { type: 'xp', value: 232 },
          { type: 'gold', value: 157 },
        ],
      },
    },
    {
      text: 'Resist toxins (Defense check)',
      requirements: { stat: 'defense', minValue: 80 },
      outcome: {
        text: 'You shrug off the poison!',
        effects: [
          { type: 'damage', target: 'all', value: 33, isTrueDamage: true },
          { type: 'xp', value: 252 },
          { type: 'gold', value: 177 },
        ],
      },
    },
  ],
  depth: 34,
  icon: GiBrandyBottle,
}

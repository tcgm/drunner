import type { DungeonEvent } from '@/types'
import { GiChainsaw } from 'react-icons/gi'

export const BLADE_HORRORS: DungeonEvent = {
  id: 'blade-horrors',
  type: 'combat',
  title: 'Blade Horrors',
  description: 'Creatures with spinning razor appendages!',
  choices: [
    {
      text: 'Block the blades',
      outcome: {
        text: 'They slice through defenses!',
        effects: [
          { type: 'damage', target: 'strongest', value: 23 },
          { type: 'xp', value: 101 },
          { type: 'gold', value: 63 },
        ],
      },
    },
    {
      text: 'Avoid and counter (Speed check)',
      requirements: { stat: 'speed', minValue: 38 },
      outcome: {
        text: 'You strike their weak spots!',
        effects: [
          { type: 'damage', target: 'strongest', value: 18 },
          { type: 'xp', value: 116 },
          { type: 'gold', value: 73 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiChainsaw,
}

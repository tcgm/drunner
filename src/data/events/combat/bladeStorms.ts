import type { DungeonEvent } from '@/types'
import { GiSwordsPower } from 'react-icons/gi'

export const BLADE_STORMS: DungeonEvent = {
  id: 'blade-storms',
  type: 'combat',
  title: 'Blade Storms',
  description: 'Whirlwinds of razor-sharp steel slice through the air!',
  choices: [
    {
      text: 'Push through',
      outcome: {
        text: 'Countless cuts bleed you!',
        effects: [
          { type: 'damage', target: 'all', value: 43 },
          { type: 'xp', value: 181 },
          { type: 'gold', value: 127 },
        ],
      },
    },
    {
      text: 'Evasive maneuvers (Speed check)',
      requirements: { stat: 'speed', minValue: 70 },
      outcome: {
        text: 'You weave between the blades!',
        effects: [
          { type: 'damage', target: 'all', value: 33 },
          { type: 'xp', value: 201 },
          { type: 'gold', value: 147 },
        ],
      },
    },
  ],
  depth: 29,
  icon: GiSwordsPower,
}

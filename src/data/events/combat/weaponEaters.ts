import type { DungeonEvent } from '@/types'
import { GiSwordBreak } from 'react-icons/gi'

export const WEAPON_EATERS: DungeonEvent = {
  id: 'weapon-eaters',
  type: 'combat',
  title: 'Weapon Eaters',
  description: 'Rust monsters that devour metal equipment!',
  choices: [
    {
      text: 'Fight them anyway',
      outcome: {
        text: 'Your weapons corrode!',
        effects: [
          { type: 'damage', target: 'random', value: 30 },
          { type: 'xp', value: 122 },
          { type: 'gold', value: 76 },
        ],
      },
    },
    {
      text: 'Use bare hands (Strength check)',
      requirements: { stat: 'strength', minValue: 45 },
      outcome: {
        text: 'You beat them down!',
        effects: [
          { type: 'damage', target: 'random', value: 23 },
          { type: 'xp', value: 137 },
          { type: 'gold', value: 86 },
        ],
      },
    },
  ],
  depth: 32,
  icon: GiSwordBreak,
}

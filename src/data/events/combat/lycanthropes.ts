import type { DungeonEvent } from '@/types'
import { GiWerewolf } from 'react-icons/gi'

export const LYCANTHROPES: DungeonEvent = {
  id: 'lycanthropes',
  type: 'combat',
  title: 'Lycanthropes',
  description: 'Cursed shapeshifters in beast form attack with savage fury!',
  choices: [
    {
      text: 'Battle the beasts',
      outcome: {
        text: 'Their regeneration makes them tough!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 115 },
          { type: 'gold', value: 70 },
        ],
      },
    },
    {
      text: 'Silver weapons (Speed check)',
      requirements: { stat: 'speed', minValue: 45 },
      outcome: {
        text: 'Silver bypasses their regeneration!',
        effects: [
          { type: 'damage', target: 'random', value: 18 },
          { type: 'xp', value: 135 },
          { type: 'gold', value: 85 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiWerewolf,
}

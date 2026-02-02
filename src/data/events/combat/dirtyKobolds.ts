import type { DungeonEvent } from '@/types'
import { GiLizardman } from 'react-icons/gi'

export const DIRTY_KOBOLDS: DungeonEvent = {
  id: 'dirty-kobolds',
  type: 'combat',
  title: 'Dirty Kobolds',
  description: 'Small reptilian creatures emerge from cracks, wielding crude weapons!',
  choices: [
    {
      text: 'Attack directly',
      outcome: {
        text: 'You fight off the scurrying kobolds!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 35 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Intimidate them (Strength check)',
      requirements: { stat: 'strength', minValue: 12 },
      outcome: {
        text: 'The kobolds scatter in fear!',
        effects: [
          { type: 'damage', target: 'random', value: 5 },
          { type: 'xp', value: 45 },
          { type: 'gold', value: 25 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiLizardman,
}

import type { DungeonEvent } from '@/types'
import { GiVampireDracula } from 'react-icons/gi'

export const BLOOD_DRINKERS: DungeonEvent = {
  id: 'blood-drinkers',
  type: 'combat',
  title: 'Blood Drinkers',
  description: 'Pale creatures with fangs hiss and lunge for your throat!',
  choices: [
    {
      text: 'Fight defensively',
      outcome: {
        text: 'You fend off their blood-draining attacks!',
        effects: [
          { type: 'damage', target: 'weakest', value: 20 },
          { type: 'xp', value: 80 },
          { type: 'gold', value: 48 },
        ],
      },
    },
    {
      text: 'Quick strikes (Speed check)',
      requirements: { stat: 'speed', minValue: 25 },
      outcome: {
        text: 'You strike before they can feed!',
        effects: [
          { type: 'damage', target: 'weakest', value: 14 },
          { type: 'xp', value: 95 },
          { type: 'gold', value: 58 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiVampireDracula,
}

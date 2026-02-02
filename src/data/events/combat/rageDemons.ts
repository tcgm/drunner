import type { DungeonEvent } from '@/types'
import { GiBurningPassion } from 'react-icons/gi'

export const RAGE_DEMONS: DungeonEvent = {
  id: 'rage-demons',
  type: 'combat',
  title: 'Rage Demons',
  description: 'Infernal beings driven by endless fury attack relentlessly!',
  choices: [
    {
      text: 'Match their rage',
      outcome: {
        text: 'Their fury knows no bounds!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 275 },
          { type: 'gold', value: 197 },
        ],
      },
    },
    {
      text: 'Calm resolve (Defense check)',
      requirements: { stat: 'defense', minValue: 98 },
      outcome: {
        text: 'Your composure frustrates them!',
        effects: [
          { type: 'damage', target: 'all', value: 44 },
          { type: 'xp', value: 295 },
          { type: 'gold', value: 213 },
        ],
      },
    },
  ],
  depth: 41,
  icon: GiBurningPassion,
}

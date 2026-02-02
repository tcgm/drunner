import type { DungeonEvent } from '@/types'
import { GiPunchBlast } from 'react-icons/gi'

export const FORCE_ELEMENTALS: DungeonEvent = {
  id: 'force-elementals',
  type: 'combat',
  title: 'Force Elementals',
  description: 'Beings of pure kinetic energy slam into you!',
  choices: [
    {
      text: 'Brace for impact',
      outcome: {
        text: 'The force breaks bones!',
        effects: [
          { type: 'damage', target: 'strongest', value: 69 },
          { type: 'xp', value: 343 },
          { type: 'gold', value: 248 },
        ],
      },
    },
    {
      text: 'Redirect the force (Strength check)',
      requirements: { stat: 'strength', minValue: 106 },
      outcome: {
        text: 'You turn their power aside!',
        effects: [
          { type: 'damage', target: 'strongest', value: 58 },
          { type: 'xp', value: 363 },
          { type: 'gold', value: 268 },
        ],
      },
    },
  ],
  depth: 47,
  icon: GiPunchBlast,
}

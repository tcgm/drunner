import type { DungeonEvent } from '@/types'
import { GiFire } from 'react-icons/gi'

export const WILDFIRE_SPIRITS: DungeonEvent = {
  id: 'wildfire-spirits',
  type: 'combat',
  title: 'Wildfire Spirits',
  description: 'Elemental flames burn with wild, unpredictable fury!',
  choices: [
    {
      text: 'Douse them',
      outcome: {
        text: 'The flames spread wildly!',
        effects: [
          { type: 'damage', target: 'all', value: 58 },
          { type: 'xp', value: 289 },
          { type: 'gold', value: 210 },
        ],
      },
    },
    {
      text: 'Control the fire (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You contain the wildfire!',
        effects: [
          { type: 'damage', target: 'all', value: 47 },
          { type: 'xp', value: 309 },
          { type: 'gold', value: 230 },
        ],
      },
    },
  ],
  depth: 43,
  icon: GiFire,
}

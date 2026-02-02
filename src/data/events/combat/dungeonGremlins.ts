import type { DungeonEvent } from '@/types'
import { GiImp } from 'react-icons/gi'

export const DUNGEON_GREMLINS: DungeonEvent = {
  id: 'dungeon-gremlins',
  type: 'combat',
  title: 'Dungeon Gremlins',
  description: 'Mischievous creatures throw rocks and screech loudly!',
  choices: [
    {
      text: 'Chase them down',
      outcome: {
        text: 'You catch and defeat the gremlins!',
        effects: [
          { type: 'damage', target: 'weakest', value: 9 },
          { type: 'xp', value: 35 },
          { type: 'gold', value: 17 },
        ],
      },
    },
    {
      text: 'Ranged attack (Speed check)',
      requirements: { stat: 'speed', minValue: 12 },
      outcome: {
        text: 'You strike them before they flee!',
        effects: [
          { type: 'damage', target: 'weakest', value: 5 },
          { type: 'xp', value: 45 },
          { type: 'gold', value: 25 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiImp,
}

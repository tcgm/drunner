import type { DungeonEvent } from '@/types'
import { GiAbstract075 } from 'react-icons/gi'

export const ETERNITY_BEASTS: DungeonEvent = {
  id: 'eternity-beasts',
  type: 'combat',
  title: 'Eternity Beasts',
  description: 'Creatures that exist across all of time simultaneously!',
  choices: [
    {
      text: 'Fight eternal beings',
      outcome: {
        text: 'They attack from past and future!',
        effects: [
          { type: 'damage', target: 'random', value: 168 },
          { type: 'xp', value: 865 },
          { type: 'gold', value: 730 },
        ],
      },
    },
    {
      text: 'Temporal isolation (Speed check)',
      requirements: { stat: 'speed', minValue: 195 },
      outcome: {
        text: 'You trap them in one moment!',
        effects: [
          { type: 'damage', target: 'random', value: 157 },
          { type: 'xp', value: 885 },
          { type: 'gold', value: 750 },
        ],
      },
    },
  ],
  depth: 96,
  icon: GiAbstract075,
}

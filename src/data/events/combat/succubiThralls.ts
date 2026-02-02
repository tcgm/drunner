import type { DungeonEvent } from '@/types'
import { GiEvilLove } from 'react-icons/gi'

export const SUCCUBI_THRALLS: DungeonEvent = {
  id: 'succubi-thralls',
  type: 'combat',
  title: 'Succubi Thralls',
  description: 'Charmed servants of succubi attack with desperate devotion!',
  choices: [
    {
      text: 'Break the charm',
      outcome: {
        text: 'They fight with unnatural fervor!',
        effects: [
          { type: 'damage', target: 'weakest', value: 51 },
          { type: 'xp', value: 250 },
          { type: 'gold', value: 172 },
        ],
      },
    },
    {
      text: 'Mental resistance (Defense check)',
      requirements: { stat: 'defense', minValue: 84 },
      outcome: {
        text: 'You free them from thralldom!',
        effects: [
          { type: 'damage', target: 'weakest', value: 40 },
          { type: 'xp', value: 270 },
          { type: 'gold', value: 192 },
        ],
      },
    },
  ],
  depth: 40,
  icon: GiEvilLove,
}

import type { DungeonEvent } from '@/types'
import { GiBurningBook } from 'react-icons/gi'

export const KNOWLEDGE_DEVOURERS: DungeonEvent = {
  id: 'knowledge-devourers',
  type: 'combat',
  title: 'Knowledge Devourers',
  description: 'Beings that consume memories and knowledge attack your mind!',
  choices: [
    {
      text: 'Guard your thoughts',
      outcome: {
        text: 'They steal precious memories!',
        effects: [
          { type: 'damage', target: 'weakest', value: 84 },
          { type: 'xp', value: 430 },
          { type: 'gold', value: 315 },
        ],
      },
    },
    {
      text: 'Mental fortress (Defense check)',
      requirements: { stat: 'defense', minValue: 125 },
      outcome: {
        text: 'Your mind remains secure!',
        effects: [
          { type: 'damage', target: 'weakest', value: 73 },
          { type: 'xp', value: 450 },
          { type: 'gold', value: 335 },
        ],
      },
    },
  ],
  depth: 57,
  icon: GiBurningBook,
}

import type { DungeonEvent } from '@/types'
import { GiWalkieTalkie } from 'react-icons/gi'
import { TAGS } from '@data/tags'

export const ECHO_WARRIORS: DungeonEvent = {
  id: 'echo-warriors',
  type: 'combat',
  tags: [TAGS.SPIRIT, TAGS.ETHEREAL, TAGS.ARCANE],
  title: 'Echo Warriors',
  description: 'Sound-based entities that attack with sonic blasts!',
  choices: [
    {
      text: 'Cover your ears',
      outcome: {
        text: 'Sonic waves shake your bones!',
        effects: [
          { type: 'damage', target: 'all', value: 63 },
          { type: 'xp', value: 322 },
          { type: 'gold', value: 235 },
        ],
      },
    },
    {
      text: 'Silence magic (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You mute their sonic attacks!',
        effects: [
          { type: 'damage', target: 'all', value: 52 },
          { type: 'xp', value: 342 },
          { type: 'gold', value: 255 },
        ],
      },
    },
  ],
  depth: 48,
  icon: GiWalkieTalkie,
}

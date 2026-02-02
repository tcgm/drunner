import type { DungeonEvent } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

export const MANA_WORMS: DungeonEvent = {
  id: 'mana-worms',
  type: 'combat',
  title: 'Mana Worms',
  description: 'Parasites that feed on magical energy!',
  choices: [
    {
      text: 'Fight without magic',
      outcome: {
        text: 'They swarm to drain you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 66 },
          { type: 'xp', value: 327 },
          { type: 'gold', value: 236 },
        ],
      },
    },
    {
      text: 'Overload them (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'They burst from excess mana!',
        effects: [
          { type: 'damage', target: 'weakest', value: 55 },
          { type: 'xp', value: 347 },
          { type: 'gold', value: 256 },
        ],
      },
    },
  ],
  depth: 49,
  icon: GiMagicSwirl,
}

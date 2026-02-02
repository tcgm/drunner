import type { DungeonEvent } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

export const MANA_EATERS: DungeonEvent = {
  id: 'mana-eaters',
  type: 'combat',
  title: 'Mana Eaters',
  description: 'Creatures that feed on magical energy swarm around you!',
  choices: [
    {
      text: 'Fight physically',
      outcome: {
        text: 'They drain your vitality!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 112 },
          { type: 'gold', value: 68 },
        ],
      },
    },
    {
      text: 'Quick strikes (Speed check)',
      requirements: { stat: 'speed', minValue: 46 },
      outcome: {
        text: 'You outpace their draining!',
        effects: [
          { type: 'damage', target: 'random', value: 18 },
          { type: 'xp', value: 132 },
          { type: 'gold', value: 83 },
        ],
      },
    },
  ],
  depth: 16,
  icon: GiMagicSwirl,
}

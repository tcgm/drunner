import type { DungeonEvent } from '@/types'
import { GiChainedHeart } from 'react-icons/gi'

export const SOUL_CHAINS: DungeonEvent = {
  id: 'soul-chains',
  type: 'combat',
  title: 'Soul Chains',
  description: 'Living chains that bind and drain life energy!',
  choices: [
    {
      text: 'Break the chains',
      outcome: {
        text: 'They constrict tighter!',
        effects: [
          { type: 'damage', target: 'random', value: 61 },
          { type: 'xp', value: 302 },
          { type: 'gold', value: 219 },
        ],
      },
    },
    {
      text: 'Slip free (Speed check)',
      requirements: { stat: 'speed', minValue: 98 },
      outcome: {
        text: 'You escape before they bind you!',
        effects: [
          { type: 'damage', target: 'random', value: 50 },
          { type: 'xp', value: 322 },
          { type: 'gold', value: 239 },
        ],
      },
    },
  ],
  depth: 45,
  icon: GiChainedHeart,
}

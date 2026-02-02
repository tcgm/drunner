import type { DungeonEvent } from '@/types'
import { GiTentacleHeart } from 'react-icons/gi'

export const HEART_EATERS: DungeonEvent = {
  id: 'heart-eaters',
  type: 'combat',
  title: 'Heart Eaters',
  description: 'Parasitic creatures that consume courage and willpower!',
  choices: [
    {
      text: 'Fight the fear',
      outcome: {
        text: 'Terror grips your heart!',
        effects: [
          { type: 'damage', target: 'weakest', value: 52 },
          { type: 'xp', value: 260 },
          { type: 'gold', value: 182 },
        ],
      },
    },
    {
      text: 'Stand firm (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your courage is unshakeable!',
        effects: [
          { type: 'damage', target: 'weakest', value: 41 },
          { type: 'xp', value: 280 },
          { type: 'gold', value: 202 },
        ],
      },
    },
  ],
  depth: 33,
  icon: GiTentacleHeart,
}

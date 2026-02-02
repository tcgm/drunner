import type { DungeonEvent } from '@/types'
import { GiTentacleHeart } from 'react-icons/gi'

export const CRYPT_TENDRILS: DungeonEvent = {
  id: 'crypt-tendrils',
  type: 'combat',
  title: 'Crypt Tendrils',
  description: 'Writhing tentacles burst from a sealed tomb!',
  choices: [
    {
      text: 'Slash at them',
      outcome: {
        text: 'You cut through the grasping limbs!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 37 },
          { type: 'gold', value: 18 },
        ],
      },
    },
    {
      text: 'Avoid and strike (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You dodge between strikes!',
        effects: [
          { type: 'damage', target: 'random', value: 5 },
          { type: 'xp', value: 47 },
          { type: 'gold', value: 26 },
        ],
      },
    },
  ],
  depth: 2,
  icon: GiTentacleHeart,
}

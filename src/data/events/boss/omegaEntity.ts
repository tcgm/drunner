import type { DungeonEvent } from '@/types'
import { GiCrownedExplosion } from 'react-icons/gi'

export const OMEGA_ENTITY: DungeonEvent = {
  id: 'omega-entity',
  type: 'boss',
  title: 'Omega Entity',
  description: 'The final boss. The ultimate challenge. The last thing standing between you and complete victory. This is everything.',
  choices: [
    {
      text: 'Give everything',
      outcome: {
        text: 'The ultimate power! Every ability, every strength, pushed to absolute limits!',
        effects: [
          { type: 'damage', target: 'all', value: 678 },
          { type: 'xp', value: 2800 },
          { type: 'gold', value: 4200 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 56 },
        ],
      },
    },
    {
      text: 'Transcend limits (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 90,
      },
      outcome: {
        text: 'You exceed the omega! There is always something beyond!',
        effects: [
          { type: 'damage', target: 'strongest', value: 652 },
          { type: 'xp', value: 2975 },
          { type: 'gold', value: 4463 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 79 },
        ],
      },
    },
    {
      text: 'Achieve omega (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 95,
      },
      outcome: {
        text: 'You become omega! The final form is yours!',
        effects: [
          { type: 'damage', target: 'all', value: 665 },
          { type: 'xp', value: 3000 },
          { type: 'gold', value: 4500 },
          { type: 'item', itemType: 'armor', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 80 },
        ],
      },
    },
  ],
  depth: 99,
  icon: GiCrownedExplosion,
}

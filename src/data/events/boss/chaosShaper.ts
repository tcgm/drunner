import type { DungeonEvent } from '@/types'
import { GiGlowingHands } from 'react-icons/gi'

export const CHAOS_SHAPER: DungeonEvent = {
  id: 'chaos-shaper',
  type: 'boss',
  title: 'Chaos Shaper',
  description: 'A sorcerer who has embraced pure chaos magic. Reality warps unpredictably around them. Anything could happen.',
  choices: [
    {
      text: 'Face the chaos',
      outcome: {
        text: 'Random effects rain down! You\'re polymorphed, then frozen, then hurled through space!',
        effects: [
          { type: 'damage', target: 'random', value: 392 },
          { type: 'xp', value: 1600 },
          { type: 'gold', value: 2400 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Stabilize reality (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 67,
      },
      outcome: {
        text: 'You impose order on chaos! The shaper\'s power turns inward!',
        effects: [
          { type: 'damage', target: 'all', value: 315 },
          { type: 'xp', value: 1715 },
          { type: 'gold', value: 2573 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Embrace chaos too (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You surf the chaos waves! Your wild magic overwhelms theirs!',
        effects: [
          { type: 'damage', target: 'weakest', value: 328 },
          { type: 'xp', value: 1735 },
          { type: 'gold', value: 2603 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
  ],
  depth: 54,
  icon: GiGlowingHands,
}

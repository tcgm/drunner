import type { DungeonEvent } from '@/types'
import { GiCyborgFace } from 'react-icons/gi'

export const MECH_OVERLORD: DungeonEvent = {
  id: 'mech-overlord',
  type: 'boss',
  title: 'Mech Overlord',
  description: 'An ancient automated war machine. Its original purpose forgotten, it continues to optimize for destruction.',
  choices: [
    {
      text: 'Fight optimal tactics',
      outcome: {
        text: 'Every weakness exploited! Every mistake punished! Perfect combat calculation!',
        effects: [
          { type: 'damage', target: 'all', value: 455 },
          { type: 'xp', value: 1880 },
          { type: 'gold', value: 2820 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Be unpredictable (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 73,
      },
      outcome: {
        text: 'You act in ways it cannot compute! The overlord cannot adapt!',
        effects: [
          { type: 'damage', target: 'random', value: 388 },
          { type: 'xp', value: 2010 },
          { type: 'gold', value: 3015 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
    {
      text: 'Overload systems (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Magic overwhelms its logic circuits! The overlord self-destructs!',
        effects: [
          { type: 'damage', target: 'all', value: 402 },
          { type: 'xp', value: 2035 },
          { type: 'gold', value: 3053 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
  ],
  depth: 65,
  icon: GiCyborgFace,
}

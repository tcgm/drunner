import type { DungeonEvent } from '@/types'
import { GiStoneSphere } from 'react-icons/gi'

export const REALITY_ANCHOR: DungeonEvent = {
  id: 'reality-anchor',
  type: 'boss',
  title: 'Reality Anchor',
  description: 'A construct that holds reality together in this region. Destroying it risks unraveling existence itself.',
  choices: [
    {
      text: 'Risk everything',
      outcome: {
        text: 'Reality fractures as you strike! Existence tears at the seams!',
        effects: [
          { type: 'damage', target: 'random', value: 598 },
          { type: 'xp', value: 2505 },
          { type: 'gold', value: 3758 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
    {
      text: 'Carefully dismantle (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 88,
      },
      outcome: {
        text: 'You understand its structure! You take it apart without breaking reality!',
        effects: [
          { type: 'damage', target: 'all', value: 545 },
          { type: 'xp', value: 2665 },
          { type: 'gold', value: 3998 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 67 },
        ],
      },
    },
    {
      text: 'Smash through consequences (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You destroy it utterly! Reality holds because you will it!',
        effects: [
          { type: 'damage', target: 'strongest', value: 558 },
          { type: 'xp', value: 2695 },
          { type: 'gold', value: 4043 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 68 },
        ],
      },
    },
  ],
  depth: 86,
  icon: GiStoneSphere,
}

import type { DungeonEvent } from '@/types'
import { GiBrainTentacle } from 'react-icons/gi'

export const THOUGHT_EATER: DungeonEvent = {
  id: 'thought-eater',
  type: 'boss',
  title: 'Thought Eater',
  description: 'An aberration that consumes thoughts and memories. It grows stronger with every idea it devours from your mind.',
  choices: [
    {
      text: 'Think your way out',
      outcome: {
        text: 'Every thought feeds it! Your own intelligence becomes a weapon against you!',
        effects: [
          { type: 'damage', target: 'all', value: 498 },
          { type: 'xp', value: 1995 },
          { type: 'gold', value: 2993 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Empty your mind (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 77,
      },
      outcome: {
        text: 'You achieve perfect mental void! It starves without thoughts to eat!',
        effects: [
          { type: 'damage', target: 'all', value: 435 },
          { type: 'xp', value: 2135 },
          { type: 'gold', value: 3203 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 54 },
        ],
      },
    },
    {
      text: 'Act on pure instinct (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'No thought, only action! You destroy it before thinking!',
        effects: [
          { type: 'damage', target: 'strongest', value: 448 },
          { type: 'xp', value: 2160 },
          { type: 'gold', value: 3240 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 55 },
        ],
      },
    },
  ],
  depth: 70,
  icon: GiBrainTentacle,
}

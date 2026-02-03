import type { DungeonEvent } from '@/types'
import { GiPoisonGas } from 'react-icons/gi'

export const TOXIC_OVERLORD: DungeonEvent = {
  id: 'toxic-overlord',
  type: 'boss',
  title: 'Toxic Overlord',
  description: 'A demon prince of poison and corruption. The very air around it is lethal. Each breath burns your lungs.',
  choices: [
    {
      text: 'Hold your breath',
      outcome: {
        text: 'You can\'t hold it forever! The toxic fumes seep through your skin!',
        effects: [
          { type: 'damage', target: 'all', value: 408 },
          { type: 'xp', value: 1645 },
          { type: 'gold', value: 2468 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Purge the toxins (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine light cleanses all poison! The overlord withers without its power!',
        effects: [
          { type: 'damage', target: 'all', value: 342 },
          { type: 'xp', value: 1765 },
          { type: 'gold', value: 2648 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 41 },
        ],
      },
    },
    {
      text: 'Become immune (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 63,
      },
      outcome: {
        text: 'Your fortitude is too strong! No poison can harm you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 352 },
          { type: 'xp', value: 1790 },
          { type: 'gold', value: 2685 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 42 },
        ],
      },
    },
  ],
  depth: 56,
  icon: GiPoisonGas,
}

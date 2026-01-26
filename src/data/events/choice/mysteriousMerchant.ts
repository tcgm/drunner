import type { DungeonEvent } from '@/types'

export const MYSTERIOUS_MERCHANT_CHOICE: DungeonEvent = {
  id: 'mysterious-merchant',
  type: 'choice',
  title: 'Mysterious Merchant',
  description: 'A hooded figure offers to sell you "special" items at a steep price.',
  choices: [
    {
      text: 'Buy the special item',
      requirements: {
        gold: 150,
      },
      outcome: {
        text: 'The item seems powerful... but cursed?',
        effects: [
          { type: 'gold', value: -150 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Haggle for a better price',
      requirements: {
        gold: 100,
      },
      outcome: {
        text: 'He laughs and lowers the price slightly.',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Try to rob him',
      outcome: {
        text: 'He vanishes in smoke, leaving behind cursed gold!',
        effects: [
          { type: 'gold', value: 50 },
          { type: 'damage', target: 'all', value: 10 },
        ],
      },
    },
    {
      text: 'Decline and move on',
      outcome: {
        text: 'You politely refuse and continue.',
        effects: [],
      },
    },
  ],
  depth: 4,
}

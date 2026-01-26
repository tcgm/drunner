import type { DungeonEvent } from '@/types'

export const HIDDEN_CACHE: DungeonEvent = {
  id: 'hidden-cache',
  type: 'treasure',
  title: 'Hidden Cache',
  description: 'You notice a loose stone in the wall. Something glitters behind it.',
  choices: [
    {
      text: 'Investigate carefully',
      outcome: {
        text: 'You find a small stash of valuables!',
        effects: [
          { type: 'gold', value: 75 },
          { type: 'item', itemType: 'random', minRarity: 'common', maxRarity: 'uncommon' },
        ],
      },
    },
    {
      text: 'Search thoroughly (requires Luck > 7)',
      requirements: {
        stat: 'luck',
        minValue: 7,
      },
      outcome: {
        text: 'Your keen eye spots additional treasure!',
        effects: [
          { type: 'gold', value: 120 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Pull the stone quickly',
      outcome: {
        text: 'A trap triggers! But you still get some gold.',
        effects: [
          { type: 'gold', value: 50 },
          { type: 'damage', target: 'random', value: 15 },
        ],
      },
    },
  ],
  depth: 1,
}

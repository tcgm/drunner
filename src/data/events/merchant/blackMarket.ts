import type { DungeonEvent} from '@/types'

export const BLACK_MARKET: DungeonEvent = {
  id: 'black-market',
  type: 'merchant',
  title: 'Black Market Dealer',
  description: 'A shady figure offers powerful items at steep prices. Some look... cursed.',
  choices: [
    {
      text: 'Buy cursed item',
      requirements: {
        gold: 200,
      },
      outcome: {
        text: 'You acquire a powerful but cursed weapon!',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'xp', value: 50 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Buy rare artifact',
      requirements: {
        gold: 300,
      },
      outcome: {
        text: 'You purchase an incredibly rare artifact!',
        effects: [
          { type: 'gold', value: -300 },
          { type: 'xp', value: 100 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Try to rob the dealer',
      outcome: {
        text: 'The dealer was expecting this! Guards attack!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Leave immediately',
      outcome: {
        text: 'You wisely decide to avoid this dealer.',
        effects: [],
      },
    },
  ],
  depth: 4,
}

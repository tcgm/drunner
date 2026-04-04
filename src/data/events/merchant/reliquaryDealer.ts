import type { DungeonEvent } from '@/types'
import { GiGemPendant } from 'react-icons/gi'

export const RELIQUARY_DEALER: DungeonEvent = {
  id: 'reliquary-dealer',
  type: 'merchant',
  title: 'Reliquary Dealer',
  description: 'A well-dressed collector deals exclusively in rare artefacts and relics. Everything in his cabinet looks like it belongs in a museum.',
  choices: [
    {
      text: 'Browse his collection (high cost)',
      requirements: { gold: 200 },
      outcome: {
        text: 'You part with a small fortune, but what you receive is unlike anything you\'ve seen.',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Commission a specific type of relic',
      requirements: { gold: 150 },
      outcome: {
        text: 'He produces exactly what you need from a locked back case.',
        effects: [
          { type: 'gold', value: -150 },
          {
            type: 'item',
            itemChoices: [
              { weight: 40, itemType: 'weapon', minRarity: 'rare', rarityBoost: 10 },
              { weight: 40, itemType: 'armor', minRarity: 'rare', rarityBoost: 10 },
              { weight: 20, itemType: 'accessory1', minRarity: 'rare', rarityBoost: 15 },
            ],
          },
        ],
      },
    },
    {
      text: 'Sell something from your inventory',
      outcome: {
        text: 'He examines your item with a jeweller\'s loupe and names a fair price.',
        effects: [
          { type: 'gold', value: 150 },
        ],
      },
    },
    {
      text: 'Just look — nothing on offer',
      outcome: {
        text: '"Come back when your purse is heavier," he says pleasantly.',
        effects: [],
      },
    },
  ],
  depth: 8,
  icon: GiGemPendant,
}

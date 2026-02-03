import type { DungeonEvent } from '@/types'
import { GiSpiderMask } from 'react-icons/gi'

export const ARACHNID_MATRON: DungeonEvent = {
  id: 'arachnid-matron',
  type: 'boss',
  title: 'Arachnid Matron',
  description: 'A colossal spider-demon hybrid. She births lesser spiders constantly while wrapping you in unbreakable webs.',
  choices: [
    {
      text: 'Fight in the webs',
      outcome: {
        text: 'Trapped! Spiders swarm while you struggle in the sticky threads!',
        effects: [
          { type: 'damage', target: 'all', value: 385 },
          { type: 'xp', value: 1580 },
          { type: 'gold', value: 2370 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Burn the webs (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Fire consumes web and spawn! The matron burns with her brood!',
        effects: [
          { type: 'damage', target: 'all', value: 308 },
          { type: 'xp', value: 1700 },
          { type: 'gold', value: 2550 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Cut free and strike (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 61,
      },
      outcome: {
        text: 'You slice through webs faster than she can spin! Victory!',
        effects: [
          { type: 'damage', target: 'strongest', value: 320 },
          { type: 'xp', value: 1720 },
          { type: 'gold', value: 2580 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 38 },
        ],
      },
    },
  ],
  depth: 55,
  icon: GiSpiderMask,
}

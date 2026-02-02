import type { DungeonEvent } from '@/types'
import { GiCrackedBallDunk } from 'react-icons/gi'

export const CHAOS_HERALD: DungeonEvent = {
  id: 'chaos-herald',
  type: 'boss',
  title: 'Chaos Herald',
  description: 'An avatar of pure chaos. Its form constantly shifts, and reality warps unpredictably around it. Order means nothing here.',
  choices: [
    {
      text: 'Fight chaos with order',
      outcome: {
        text: 'Unpredictable attacks from impossible angles! Nothing makes sense!',
        effects: [
          { type: 'damage', target: 'random', value: 345 },
          { type: 'xp', value: 1270 },
          { type: 'gold', value: 1905 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Embrace chaos (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 54,
      },
      outcome: {
        text: 'You become unpredictable! Chaos cannot fight chaos effectively!',
        effects: [
          { type: 'damage', target: 'all', value: 280 },
          { type: 'xp', value: 1370 },
          { type: 'gold', value: 2055 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Impose order (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your magic enforces natural laws! The herald cannot exist in order!',
        effects: [
          { type: 'damage', target: 'all', value: 248 },
          { type: 'xp', value: 1390 },
          { type: 'gold', value: 2085 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
  ],
  depth: 45,
  icon: GiCrackedBallDunk,
}

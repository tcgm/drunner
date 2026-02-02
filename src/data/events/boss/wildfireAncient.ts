import type { DungeonEvent } from '@/types'
import { GiBurningTree } from 'react-icons/gi'

export const WILDFIRE_ANCIENT: DungeonEvent = {
  id: 'wildfire-ancient',
  type: 'boss',
  title: 'Wildfire Ancient',
  description: 'An ancient treant consumed by eternal flame. It spreads fire with every step, burning everything in a growing inferno.',
  choices: [
    {
      text: 'Brave the flames',
      outcome: {
        text: 'The inferno is all-consuming! You burn alongside the forest!',
        effects: [
          { type: 'damage', target: 'all', value: 445 },
          { type: 'xp', value: 1850 },
          { type: 'gold', value: 2775 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 36 },
        ],
      },
    },
    {
      text: 'Free it from flame (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You reach the ancient\'s core! It thanks you for ending its torment!',
        effects: [
          { type: 'damage', target: 'all', value: 378 },
          { type: 'xp', value: 1980 },
          { type: 'gold', value: 2970 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 46 },
        ],
      },
    },
    {
      text: 'Quench with water (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Torrential magic drowns the flames! The ancient finally rests!',
        effects: [
          { type: 'damage', target: 'all', value: 392 },
          { type: 'xp', value: 2005 },
          { type: 'gold', value: 3008 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 47 },
        ],
      },
    },
  ],
  depth: 67,
  icon: GiBurningTree,
}

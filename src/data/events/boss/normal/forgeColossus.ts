import type { DungeonEvent } from '@/types'
import { GiSmokingOrb } from 'react-icons/gi'

export const FORGE_COLOSSUS: DungeonEvent = {
  id: 'forge-colossus',
  type: 'boss',
  title: 'Forge Colossus',
  description: 'A living foundry that shapes metal with its bare hands. It reforges itself constantly, adapting to counter every attack.',
  choices: [
    {
      text: 'Attack relentlessly',
      outcome: {
        text: 'It adapts to every strike! Your weapons become useless against its evolved form!',
        effects: [
          { type: 'damage', target: 'all', value: 485 },
          { type: 'xp', value: 1970 },
          { type: 'gold', value: 2955 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Prevent adaptation (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 75,
      },
      outcome: {
        text: 'You strike too varied to counter! It cannot adapt to unpredictability!',
        effects: [
          { type: 'damage', target: 'random', value: 418 },
          { type: 'xp', value: 2100 },
          { type: 'gold', value: 3150 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 52 },
        ],
      },
    },
    {
      text: 'Melt it down (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Extreme heat liquefies its body! The colossus becomes slag!',
        effects: [
          { type: 'damage', target: 'all', value: 432 },
          { type: 'xp', value: 2125 },
          { type: 'gold', value: 3188 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 53 },
        ],
      },
    },
  ],
  depth: 69,
  icon: GiSmokingOrb,
}

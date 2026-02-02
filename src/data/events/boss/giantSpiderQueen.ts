import type { DungeonEvent } from '@/types'
import { GiSpiderBot } from 'react-icons/gi'

export const GIANT_SPIDER_QUEEN: DungeonEvent = {
  id: 'giant-spider-queen',
  type: 'boss',
  title: 'Giant Spider Queen',
  description: 'An enormous arachnid descends from the ceiling, her chitinous body gleaming in the dim light. Webs cover every surface.',
  choices: [
    {
      text: 'Hack through the webs',
      outcome: {
        text: 'You struggle through the sticky webs while the queen strikes from above!',
        effects: [
          { type: 'damage', target: 'all', value: 33 },
          { type: 'xp', value: 185 },
          { type: 'gold', value: 275 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Burn the webs (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Flames consume the webbing! The queen falls and you finish her off!',
        effects: [
          { type: 'damage', target: 'all', value: 21 },
          { type: 'xp', value: 225 },
          { type: 'gold', value: 325 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Target the abdomen (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 8,
      },
      outcome: {
        text: 'You spot her weak point! Your strike pierces through the chitin!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
          { type: 'xp', value: 215 },
          { type: 'gold', value: 315 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
  ],
  depth: 8,
  icon: GiSpiderBot,
}

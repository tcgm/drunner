import type { DungeonEvent } from '@/types'
import { GiGooSkull } from 'react-icons/gi'

export const PLAGUE_LICH: DungeonEvent = {
  id: 'plague-lich',
  type: 'boss',
  title: 'Plague Lich',
  description: 'A lich who specialized in disease magic. Its phylactery is a festering infection that spreads through all living things.',
  choices: [
    {
      text: 'Combat the plague',
      outcome: {
        text: 'Disease magic withers you! The infection spreads with every breath!',
        effects: [
          { type: 'damage', target: 'all', value: 462 },
          { type: 'xp', value: 1900 },
          { type: 'gold', value: 2850 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 37 },
        ],
      },
    },
    {
      text: 'Purify the infection (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Divine light cleanses all disease! The phylactery is destroyed!',
        effects: [
          { type: 'damage', target: 'all', value: 395 },
          { type: 'xp', value: 2030 },
          { type: 'gold', value: 3045 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 49 },
        ],
      },
    },
    {
      text: 'Resist through vigor (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 69,
      },
      outcome: {
        text: 'Your fortitude cannot be infected! The lich\'s power fails!',
        effects: [
          { type: 'damage', target: 'strongest', value: 408 },
          { type: 'xp', value: 2055 },
          { type: 'gold', value: 3083 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
  ],
  depth: 66,
  icon: GiGooSkull,
}

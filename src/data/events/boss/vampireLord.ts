import type { DungeonEvent } from '@/types'
import { GiBatWing } from 'react-icons/gi'

export const VAMPIRE_LORD: DungeonEvent = {
  id: 'vampire-lord',
  type: 'boss',
  title: 'Vampire Lord',
  description: 'An elegant figure in crimson robes watches you with ancient eyes. His fangs glint as he smiles coldly, confident in his immortality.',
  choices: [
    {
      text: 'Engage in combat',
      outcome: {
        text: 'The vampire moves with supernatural speed! He drains your blood as you fight!',
        effects: [
          { type: 'damage', target: 'all', value: 38 },
          { type: 'xp', value: 205 },
          { type: 'gold', value: 295 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Use holy water (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'The blessed water burns like acid! The vampire shrieks and crumbles to ash!',
        effects: [
          { type: 'damage', target: 'all', value: 24 },
          { type: 'xp', value: 245 },
          { type: 'gold', value: 345 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Stake through the heart (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 12,
      },
      outcome: {
        text: 'In one perfect strike, you pierce his heart! He dissolves into mist!',
        effects: [
          { type: 'damage', target: 'strongest', value: 28 },
          { type: 'xp', value: 235 },
          { type: 'gold', value: 335 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 13 },
        ],
      },
    },
  ],
  depth: 9,
  icon: GiBatWing,
}

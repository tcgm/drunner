import type { DungeonEvent } from '@/types'
import { GiBlackKnightHelm } from 'react-icons/gi'

export const OBSIDIAN_KNIGHT: DungeonEvent = {
  id: 'obsidian-knight',
  type: 'boss',
  title: 'Obsidian Knight',
  description: 'A warrior encased in living volcanic glass. Their armor is razor-sharp, and lava seeps through the cracks with each movement.',
  choices: [
    {
      text: 'Face the knight',
      outcome: {
        text: 'The obsidian cuts like razors and burns like lava! Every strike wounds you!',
        effects: [
          { type: 'damage', target: 'all', value: 176 },
          { type: 'xp', value: 698 },
          { type: 'gold', value: 1008 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Shatter the glass (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 37,
      },
      outcome: {
        text: 'You strike with precision! The obsidian cracks and explodes!',
        effects: [
          { type: 'damage', target: 'strongest', value: 148 },
          { type: 'xp', value: 763 },
          { type: 'gold', value: 1088 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Cool the lava (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Ice magic solidifies the lava! The knight becomes brittle and shatters!',
        effects: [
          { type: 'damage', target: 'all', value: 138 },
          { type: 'xp', value: 783 },
          { type: 'gold', value: 1113 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 34,
  icon: GiBlackKnightHelm,
}

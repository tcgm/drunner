import type { DungeonEvent } from '@/types'
import { GiMountainCave } from 'react-icons/gi'

export const CAVE_TROLL_KING: DungeonEvent = {
  id: 'cave-troll-king',
  type: 'boss',
  title: 'Cave Troll King',
  description: 'An enormous troll covered in stone-like hide rules this deep cavern. His massive club is a stalagmite torn from the floor, and his roar shakes loose rocks from above.',
  choices: [
    {
      text: 'Trade blows',
      outcome: {
        text: 'The troll\'s strength is monstrous! Each swing of his club creates shockwaves!',
        effects: [
          { type: 'damage', target: 'all', value: 180 },
          { type: 'xp', value: 705 },
          { type: 'gold', value: 1020 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 21 },
        ],
      },
    },
    {
      text: 'Use the cave against him (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 36,
      },
      outcome: {
        text: 'You trigger a collapse! Tons of rock bury the troll!',
        effects: [
          { type: 'damage', target: 'weakest', value: 138 },
          { type: 'xp', value: 768 },
          { type: 'gold', value: 1098 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Overwhelm with fury (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You match his savagery blow for blow! The king falls to a greater warrior!',
        effects: [
          { type: 'damage', target: 'strongest', value: 155 },
          { type: 'xp', value: 788 },
          { type: 'gold', value: 1118 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 31,
  icon: GiMountainCave,
}

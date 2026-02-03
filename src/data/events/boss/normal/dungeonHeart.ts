import type { DungeonEvent } from '@/types'
import { GiCrown } from 'react-icons/gi'

export const DUNGEON_HEART: DungeonEvent = {
  id: 'dungeon-heart',
  type: 'boss',
  title: 'Dungeon Heart',
  description: 'The living core of the dungeon itself. It is every trap, every monster, every floor. To destroy it is to end the dungeon.',
  choices: [
    {
      text: 'Fight the dungeon',
      outcome: {
        text: 'The entire dungeon attacks! Walls, floor, ceiling - everything is against you!',
        effects: [
          { type: 'damage', target: 'all', value: 638 },
          { type: 'xp', value: 2640 },
          { type: 'gold', value: 3960 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 52 },
        ],
      },
    },
    {
      text: 'Strike the heart (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 88,
      },
      outcome: {
        text: 'You pierce through to the core! The dungeon crumbles!',
        effects: [
          { type: 'damage', target: 'strongest', value: 598 },
          { type: 'xp', value: 2800 },
          { type: 'gold', value: 4200 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 72 },
        ],
      },
    },
    {
      text: 'Become the dungeon (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 92,
      },
      outcome: {
        text: 'You merge with the heart! You now control the dungeon itself!',
        effects: [
          { type: 'damage', target: 'all', value: 612 },
          { type: 'xp', value: 2830 },
          { type: 'gold', value: 4245 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 73 },
        ],
      },
    },
  ],
  depth: 94,
  icon: GiCrown,
}

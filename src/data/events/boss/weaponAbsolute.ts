import type { DungeonEvent } from '@/types'
import { GiAnvilImpact } from 'react-icons/gi'

export const WEAPON_ABSOLUTE: DungeonEvent = {
  id: 'weapon-absolute',
  type: 'boss',
  title: 'Weapon Absolute',
  description: 'The perfect weapon given life. It was forged to end all things and knows only destruction. It cannot be stopped.',
  choices: [
    {
      text: 'Try to block it',
      outcome: {
        text: 'The perfect weapon cuts through everything! Nothing can withstand it!',
        effects: [
          { type: 'damage', target: 'all', value: 565 },
          { type: 'xp', value: 2310 },
          { type: 'gold', value: 3465 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 46 },
        ],
      },
    },
    {
      text: 'Dodge perfectly (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'The best offense is not being there! You evade and counter!',
        effects: [
          { type: 'damage', target: 'weakest', value: 505 },
          { type: 'xp', value: 2440 },
          { type: 'gold', value: 3660 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 63 },
        ],
      },
    },
    {
      text: 'Become stronger than absolute (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 80,
      },
      outcome: {
        text: 'You surpass perfection! Your power exceeds even the absolute!',
        effects: [
          { type: 'damage', target: 'strongest', value: 518 },
          { type: 'xp', value: 2470 },
          { type: 'gold', value: 3705 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 64 },
        ],
      },
    },
  ],
  depth: 80,
  icon: GiAnvilImpact,
}

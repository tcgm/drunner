import type { DungeonEvent } from '@/types'
import { GiNightSky } from 'react-icons/gi'

export const STARBORN_HORROR: DungeonEvent = {
  id: 'starborn-horror',
  type: 'boss',
  title: 'Starborn Horror',
  description: 'A creature from beyond the stars, its form defies comprehension. It radiates cosmic energy and gravity warps around it unnaturally.',
  choices: [
    {
      text: 'Confront the alien',
      outcome: {
        text: 'Cosmic forces assault you! Gravity crushes as starlight burns!',
        effects: [
          { type: 'damage', target: 'all', value: 192 },
          { type: 'xp', value: 735 },
          { type: 'gold', value: 1065 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Banish it beyond (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You cast it back into the void between stars! It screams as it\'s pulled away!',
        effects: [
          { type: 'damage', target: 'all', value: 150 },
          { type: 'xp', value: 810 },
          { type: 'gold', value: 1160 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Resist cosmic forces (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 40,
      },
      outcome: {
        text: 'You stand firm against impossible forces! It exhausts its power!',
        effects: [
          { type: 'damage', target: 'all', value: 162 },
          { type: 'xp', value: 830 },
          { type: 'gold', value: 1185 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 29 },
        ],
      },
    },
  ],
  depth: 39,
  icon: GiNightSky,
}

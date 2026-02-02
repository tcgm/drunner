import type { DungeonEvent } from '@/types'
import { GiSwordClash } from 'react-icons/gi'

export const ULTIMATE_WARRIOR: DungeonEvent = {
  id: 'ultimate-warrior',
  type: 'boss',
  title: 'Ultimate Warrior',
  description: 'The greatest fighter who ever lived. Every combat technique perfected. Every weakness eliminated. Pure martial perfection.',
  choices: [
    {
      text: 'Test your skills',
      outcome: {
        text: 'Outmatched in every way! Perfect form, perfect technique, perfect execution!',
        effects: [
          { type: 'damage', target: 'strongest', value: 645 },
          { type: 'xp', value: 2665 },
          { type: 'gold', value: 3998 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 53 },
        ],
      },
    },
    {
      text: 'Surpass perfection (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You go beyond ultimate! Your passion exceeds cold perfection!',
        effects: [
          { type: 'damage', target: 'strongest', value: 605 },
          { type: 'xp', value: 2825 },
          { type: 'gold', value: 4238 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 73 },
        ],
      },
    },
    {
      text: 'Find the flaw (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 91,
      },
      outcome: {
        text: 'Nothing is perfect! You see what no one else could see!',
        effects: [
          { type: 'damage', target: 'all', value: 618 },
          { type: 'xp', value: 2855 },
          { type: 'gold', value: 4283 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 74 },
        ],
      },
    },
  ],
  depth: 93,
  icon: GiSwordClash,
}

import type { DungeonEvent } from '@/types'
import { GiSundial } from 'react-icons/gi'

export const CHRONOS_PRIME: DungeonEvent = {
  id: 'chronos-prime',
  type: 'boss',
  title: 'Chronos Prime',
  description: 'The master of all time. Past, present, and future bend to its will. It has already defeated you in the future. Or has it?',
  choices: [
    {
      text: 'Fight linearly',
      outcome: {
        text: 'It attacks from past and future simultaneously! Time itself is weaponized!',
        effects: [
          { type: 'damage', target: 'all', value: 658 },
          { type: 'xp', value: 2730 },
          { type: 'gold', value: 4095 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 54 },
        ],
      },
    },
    {
      text: 'Exist outside time (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 93,
      },
      outcome: {
        text: 'You step beyond the timeline! Chronos has no power over the eternal!',
        effects: [
          { type: 'damage', target: 'all', value: 638 },
          { type: 'xp', value: 2890 },
          { type: 'gold', value: 4335 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 76 },
        ],
      },
    },
    {
      text: 'Rewrite the timeline (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You alter causality! In the new timeline, you always win!',
        effects: [
          { type: 'damage', target: 'all', value: 652 },
          { type: 'xp', value: 2920 },
          { type: 'gold', value: 4380 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 77 },
        ],
      },
    },
  ],
  depth: 95,
  icon: GiSundial,
}

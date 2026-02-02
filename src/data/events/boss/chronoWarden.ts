import type { DungeonEvent } from '@/types'
import { GiHourglass } from 'react-icons/gi'

export const CHRONO_WARDEN: DungeonEvent = {
  id: 'chrono-warden',
  type: 'boss',
  title: 'Chrono Warden',
  description: 'A guardian that exists in multiple time streams simultaneously. It attacks from past, present, and future all at once. Time itself seems to bend and fracture around its form.',
  choices: [
    {
      text: 'Fight across time',
      outcome: {
        text: 'You battle its past, present, and future selves simultaneously! The temporal strain is immense, but you prevail!',
        effects: [
          { type: 'damage', target: 'all', value: 510 },
          { type: 'xp', value: 2000 },
          { type: 'gold', value: 2900 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 33 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Anchor it to the present (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 110,
      },
      outcome: {
        text: 'You create a temporal anchor that binds it to this moment! Unable to shift through time, it falls quickly!',
        effects: [
          { type: 'damage', target: 'all', value: 390 },
          { type: 'xp', value: 2300 },
          { type: 'gold', value: 3200 },
          { type: 'item', itemType: 'accessory2', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Move faster than time (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'Your legendary reflexes allow you to strike between moments! The Warden cannot defend against attacks that exist outside time!',
        effects: [
          { type: 'damage', target: 'all', value: 420 },
          { type: 'xp', value: 2200 },
          { type: 'gold', value: 3100 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
  ],
  depth: 75,
  icon: GiHourglass,
}

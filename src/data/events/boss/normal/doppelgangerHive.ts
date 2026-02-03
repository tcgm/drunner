import type { DungeonEvent } from '@/types'
import { GiShadowFollower } from 'react-icons/gi'

export const DOPPELGANGER_HIVE: DungeonEvent = {
  id: 'doppelganger-hive',
  type: 'boss',
  title: 'Doppelganger Hive',
  description: 'A colony of shape-shifters that mirror your entire party. Fighting yourself is disconcerting, to say the least.',
  choices: [
    {
      text: 'Fight your copies',
      outcome: {
        text: 'They know all your moves! Fighting yourself is impossible!',
        effects: [
          { type: 'damage', target: 'all', value: 412 },
          { type: 'xp', value: 1650 },
          { type: 'gold', value: 2475 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Expose the fakes (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 67,
      },
      outcome: {
        text: 'You spot the tells! They can\'t perfectly copy your soul!',
        effects: [
          { type: 'damage', target: 'random', value: 345 },
          { type: 'xp', value: 1775 },
          { type: 'gold', value: 2663 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 41 },
        ],
      },
    },
    {
      text: 'Do the unexpected (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You improvise wildly! They can only copy what they\'ve seen!',
        effects: [
          { type: 'damage', target: 'weakest', value: 355 },
          { type: 'xp', value: 1795 },
          { type: 'gold', value: 2693 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 42 },
        ],
      },
    },
  ],
  depth: 58,
  icon: GiShadowFollower,
}

import type { DungeonEvent} from '@/types'
import { GiSpikedDragonHead } from 'react-icons/gi'

export const VOID_WYRM: DungeonEvent = {
  id: 'void-wyrm',
  type: 'boss',
  title: 'Void Wyrm',
  description: 'A dragon that has become one with the abyss. Its breath doesn\'t burn - it erases, removing things from existence entirely.',
  choices: [
    {
      text: 'Face erasure',
      outcome: {
        text: 'Parts of you cease to exist! The void breath unmakes reality!',
        effects: [
          { type: 'damage', target: 'random', value: 448 },
          { type: 'xp', value: 1860 },
          { type: 'gold', value: 2790 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 36 },
        ],
      },
    },
    {
      text: 'Assert existence (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 72,
      },
      outcome: {
        text: 'Your sense of self is too strong to erase! The wyrm cannot unmake you!',
        effects: [
          { type: 'damage', target: 'all', value: 382 },
          { type: 'xp', value: 1990 },
          { type: 'gold', value: 2985 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 47 },
        ],
      },
    },
    {
      text: 'Strike before it breathes (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You interrupt the breath! The wyrm chokes on its own void!',
        effects: [
          { type: 'damage', target: 'weakest', value: 395 },
          { type: 'xp', value: 2015 },
          { type: 'gold', value: 3023 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 48 },
        ],
      },
    },
  ],
  depth: 63,
  icon: GiSpikedDragonHead,
}

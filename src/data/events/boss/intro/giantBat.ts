import type { DungeonEvent } from '@/types'
import { GiBat } from 'react-icons/gi'

export const GIANT_BAT: DungeonEvent = {
  id: 'giant-bat-intro',
  type: 'boss',
  title: 'Giant Bat',
  description: 'A huge bat swoops down from the ceiling, screeching loudly. Its wingspan fills the corridor.',
  choices: [
    {
      text: 'Strike as it dives',
      outcome: {
        text: 'You time your attack perfectly and wound the bat as it swoops past!',
        effects: [
          { type: 'damage', target: 'all', value: 17 },
          { type: 'xp', value: 125 },
          { type: 'gold', value: 155 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 6 },
        ],
      },
    },
    {
      text: 'Quick dodge and counter (High Speed)',
      requirements: {
        stat: 'speed',
        minValue: 9,
      },
      outcome: {
        text: 'You weave past its attacks and land critical strikes! The bat falls!',
        effects: [
          { type: 'damage', target: 'fastest', value: 11 },
          { type: 'xp', value: 155 },
          { type: 'gold', value: 185 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Lure it into sunlight (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You cleverly guide the bat toward a crack of light! It flees in fear!',
        effects: [
          { type: 'damage', target: 'all', value: 7 },
          { type: 'xp', value: 165 },
          { type: 'gold', value: 205 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 10 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiBat,
  isIntroBoss: true,
}

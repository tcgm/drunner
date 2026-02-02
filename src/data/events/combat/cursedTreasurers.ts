import type { DungeonEvent } from '@/types'
import { GiTwoCoins } from 'react-icons/gi'

export const CURSED_TREASURERS: DungeonEvent = {
  id: 'cursed-treasurers',
  type: 'combat',
  title: 'Cursed Treasurers',
  description: 'Undead guardians of wealth attack with coin-studded flails!',
  choices: [
    {
      text: 'Fight them',
      outcome: {
        text: 'Cursed gold saps your strength!',
        effects: [
          { type: 'damage', target: 'random', value: 60 },
          { type: 'xp', value: 285 },
          { type: 'gold', value: 205 },
        ],
      },
    },
    {
      text: 'Break the curse (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy power frees them!',
        effects: [
          { type: 'damage', target: 'random', value: 49 },
          { type: 'xp', value: 305 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 44,
  icon: GiTwoCoins,
}

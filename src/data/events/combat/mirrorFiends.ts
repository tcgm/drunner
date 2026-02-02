import type { DungeonEvent } from '@/types'
import { GiShatteredGlass } from 'react-icons/gi'

export const MIRROR_FIENDS: DungeonEvent = {
  id: 'mirror-fiends',
  type: 'combat',
  title: 'Mirror Fiends',
  description: 'Demons trapped in mirrors attack with reflections!',
  choices: [
    {
      text: 'Shatter the mirrors',
      outcome: {
        text: 'Glass shards fly everywhere!',
        effects: [
          { type: 'damage', target: 'all', value: 76 },
          { type: 'xp', value: 378 },
          { type: 'gold', value: 273 },
        ],
      },
    },
    {
      text: 'Banish reflections (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy power sends them back!',
        effects: [
          { type: 'damage', target: 'all', value: 65 },
          { type: 'xp', value: 398 },
          { type: 'gold', value: 293 },
        ],
      },
    },
  ],
  depth: 55,
  icon: GiShatteredGlass,
}

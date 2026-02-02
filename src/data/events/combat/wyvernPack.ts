import type { DungeonEvent } from '@/types'
import { GiSpikedDragon } from 'react-icons/gi'

export const WYVERN_PACK: DungeonEvent = {
  id: 'wyvern-pack',
  type: 'combat',
  title: 'Wyvern Pack',
  description: 'Lesser dragons circle above, diving with venomous stingers!',
  choices: [
    {
      text: 'Ground them',
      outcome: {
        text: 'You fight the aerial predators!',
        effects: [
          { type: 'damage', target: 'random', value: 29 },
          { type: 'xp', value: 122 },
          { type: 'gold', value: 76 },
        ],
      },
    },
    {
      text: 'Precise shots (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike their wings mid-flight!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 142 },
          { type: 'gold', value: 91 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiSpikedDragon,
}

import type { DungeonEvent } from '@/types'
import { GiSpikedMace } from 'react-icons/gi'

export const IRON_REAVERS: DungeonEvent = {
  id: 'iron-reavers',
  type: 'combat',
  title: 'Iron Reavers',
  description: 'Armored warriors wielding massive spiked weapons!',
  choices: [
    {
      text: 'Meet them head-on',
      outcome: {
        text: 'Their maces crush armor!',
        effects: [
          { type: 'damage', target: 'strongest', value: 64 },
          { type: 'xp', value: 318 },
          { type: 'gold', value: 230 },
        ],
      },
    },
    {
      text: 'Exploit armor gaps (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'Precise strikes bring them down!',
        effects: [
          { type: 'damage', target: 'strongest', value: 53 },
          { type: 'xp', value: 338 },
          { type: 'gold', value: 250 },
        ],
      },
    },
  ],
  depth: 46,
  icon: GiSpikedMace,
}

import type { DungeonEvent } from '@/types'
import { GiBrutalHelm } from 'react-icons/gi'

export const ARMORED_COLOSSI: DungeonEvent = {
  id: 'armored-colossi',
  type: 'combat',
  title: 'Armored Colossi',
  description: 'Enormous warriors in impenetrable armor advance steadily!',
  choices: [
    {
      text: 'Strike the armor',
      outcome: {
        text: 'Your weapons barely dent it!',
        effects: [
          { type: 'damage', target: 'all', value: 59 },
          { type: 'xp', value: 283 },
          { type: 'gold', value: 203 },
        ],
      },
    },
    {
      text: 'Exploit gaps (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You find weaknesses!',
        effects: [
          { type: 'damage', target: 'all', value: 48 },
          { type: 'xp', value: 303 },
          { type: 'gold', value: 219 },
        ],
      },
    },
  ],
  depth: 44,
  icon: GiBrutalHelm,
}

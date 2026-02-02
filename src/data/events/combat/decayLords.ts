import type { DungeonEvent } from '@/types'
import { GiNuclearWaste } from 'react-icons/gi'

export const DECAY_LORDS: DungeonEvent = {
  id: 'decay-lords',
  type: 'combat',
  title: 'Decay Lords',
  description: 'Masters of entropy accelerate the death of all things!',
  choices: [
    {
      text: 'Fight entropy',
      outcome: {
        text: 'Everything rots away!',
        effects: [
          { type: 'damage', target: 'random', value: 96 },
          { type: 'xp', value: 490 },
          { type: 'gold', value: 370 },
        ],
      },
    },
    {
      text: 'Life affirmation (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine vitality counters decay!',
        effects: [
          { type: 'damage', target: 'random', value: 85 },
          { type: 'xp', value: 510 },
          { type: 'gold', value: 390 },
        ],
      },
    },
  ],
  depth: 65,
  icon: GiNuclearWaste,
}

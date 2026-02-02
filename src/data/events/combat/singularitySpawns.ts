import type { DungeonEvent } from '@/types'
import { GiBlackHoleBolas } from 'react-icons/gi'

export const SINGULARITY_SPAWNS: DungeonEvent = {
  id: 'singularity-spawns',
  type: 'combat',
  title: 'Singularity Spawns',
  description: 'Entities born from black holes pull you into oblivion!',
  choices: [
    {
      text: 'Resist the pull',
      outcome: {
        text: 'You are drawn toward annihilation!',
        effects: [
          { type: 'damage', target: 'random', value: 97 },
          { type: 'xp', value: 515 },
          { type: 'gold', value: 394 },
        ],
      },
    },
    {
      text: 'Use momentum against them (Strength check)',
      requirements: { stat: 'strength', minValue: 149 },
      outcome: {
        text: 'You turn their gravity against them!',
        effects: [
          { type: 'damage', target: 'random', value: 86 },
          { type: 'xp', value: 535 },
          { type: 'gold', value: 414 },
        ],
      },
    },
  ],
  depth: 65,
  icon: GiBlackHoleBolas,
}

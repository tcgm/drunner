import type { DungeonEvent } from '@/types'
import { GiVortex } from 'react-icons/gi'

export const VOID_SPAWNS: DungeonEvent = {
  id: 'void-spawns',
  type: 'combat',
  title: 'Void Spawns',
  description: 'Creatures born of absolute nothingness attack with reality-warping claws!',
  choices: [
    {
      text: 'Strike them down',
      outcome: {
        text: 'Their touch erases parts of you!',
        effects: [
          { type: 'damage', target: 'strongest', value: 52 },
          { type: 'xp', value: 255 },
          { type: 'gold', value: 175 },
        ],
      },
    },
    {
      text: 'Existential resistance (Defense check)',
      requirements: { stat: 'defense', minValue: 82 },
      outcome: {
        text: 'You maintain your existence!',
        effects: [
          { type: 'damage', target: 'strongest', value: 41 },
          { type: 'xp', value: 275 },
          { type: 'gold', value: 195 },
        ],
      },
    },
  ],
  depth: 39,
  icon: GiVortex,
}

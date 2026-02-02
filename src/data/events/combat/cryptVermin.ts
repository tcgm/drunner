import type { DungeonEvent } from '@/types'
import { GiRat } from 'react-icons/gi'

export const CRYPT_VERMIN: DungeonEvent = {
  id: 'crypt-vermin',
  type: 'combat',
  title: 'Crypt Vermin',
  description: 'Diseased rats pour from burial alcoves, their eyes glowing red!',
  choices: [
    {
      text: 'Fight the swarm',
      outcome: {
        text: 'You kick and slash at the writhing mass!',
        effects: [
          { type: 'damage', target: 'all', value: 9 },
          { type: 'xp', value: 32 },
          { type: 'gold', value: 16 },
        ],
      },
    },
    {
      text: 'Area attack (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your sweeping strikes devastate the swarm!',
        effects: [
          { type: 'damage', target: 'all', value: 5 },
          { type: 'xp', value: 42 },
          { type: 'gold', value: 24 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiRat,
}

import type { DungeonEvent } from '@/types'
import { GiSkullCrack } from 'react-icons/gi'

export const MADNESS_SPREADERS: DungeonEvent = {
  id: 'madness-spreaders',
  type: 'combat',
  title: 'Madness Spreaders',
  description: 'Beings that infect minds with insanity!',
  choices: [
    {
      text: 'Resist the madness',
      outcome: {
        text: 'Your sanity slips away!',
        effects: [
          { type: 'damage', target: 'all', value: 59 },
          { type: 'xp', value: 295 },
          { type: 'gold', value: 214 },
        ],
      },
    },
    {
      text: 'Shield your mind (Defense check)',
      requirements: { stat: 'defense', minValue: 99 },
      outcome: {
        text: 'Mental barriers hold firm!',
        effects: [
          { type: 'damage', target: 'all', value: 48 },
          { type: 'xp', value: 315 },
          { type: 'gold', value: 234 },
        ],
      },
    },
  ],
  depth: 44,
  icon: GiSkullCrack,
}

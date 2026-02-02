import type { DungeonEvent } from '@/types'
import { GiAbstract087 } from 'react-icons/gi'

export const COSMIC_ABERRATIONS: DungeonEvent = {
  id: 'cosmic-aberrations',
  type: 'combat',
  title: 'Cosmic Aberrations',
  description: 'Beings from beyond space attack with incomprehensible powers!',
  choices: [
    {
      text: 'Comprehend the incomprehensible',
      outcome: {
        text: 'Your mind reels from their alien nature!',
        effects: [
          { type: 'damage', target: 'weakest', value: 78 },
          { type: 'xp', value: 385 },
          { type: 'gold', value: 278 },
        ],
      },
    },
    {
      text: 'Divine clarity (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Faith shields your mind!',
        effects: [
          { type: 'damage', target: 'weakest', value: 67 },
          { type: 'xp', value: 405 },
          { type: 'gold', value: 298 },
        ],
      },
    },
  ],
  depth: 56,
  icon: GiAbstract087,
}

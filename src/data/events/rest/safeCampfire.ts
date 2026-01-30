import type { DungeonEvent } from '@/types'
import { GiCampfire } from 'react-icons/gi'

export const SAFE_CAMPFIRE: DungeonEvent = {
  id: 'safe-campfire',
  type: 'rest',
  title: 'Safe Campfire',
  description: 'A warm campfire flickers in a secure alcove. This seems like a good place to rest.',
  choices: [
    {
      text: 'Rest fully (restore all HP)',
      outcome: {
        text: 'Your party rests peacefully and recovers completely.',
        effects: [
          { type: 'heal', target: 'all', value: 999 }, // Full heal
        ],
      },
    },
    {
      text: 'Quick rest (restore 50 HP)',
      outcome: {
        text: 'You take a brief rest and recover some strength.',
        effects: [
          { type: 'heal', target: 'all', value: 50 },
          { type: 'xp', value: 10 },
        ],
      },
    },
    {
      text: 'Skip rest and continue',
      outcome: {
        text: 'You press on without resting.',
        effects: [],
      },
    },
  ],
  depth: 1,
  icon: GiCampfire,
}

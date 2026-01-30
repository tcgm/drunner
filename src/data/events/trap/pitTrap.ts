import type { DungeonEvent } from '@/types'
import { GiMantrap } from 'react-icons/gi'

export const PIT_TRAP: DungeonEvent = {
  id: 'pit-trap',
  type: 'trap',
  title: 'Hidden Pit Trap',
  description: 'The floor ahead looks suspicious. Cracks suggest a hidden pit.',
  choices: [
    {
      text: 'Search for the trigger (Luck check)',
      requirements: {
        stat: 'luck',
        minValue: 8,
      },
      outcome: {
        text: 'You find and mark the pit trap safely!',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Jump across the pit (Speed check)',
      successChance: 0.45,
      statModifier: 'speed',
      successOutcome: {
        text: 'Everyone makes the jump successfully!',
        effects: [
          { type: 'xp', value: 40 },
        ],
      },
      failureOutcome: {
        text: 'Most of you make it, but one falls into the pit!',
        effects: [
          { type: 'damage', target: 'random', value: 35 },
          { type: 'xp', value: 20 },
        ],
      },
    },
    {
      text: 'Find another route',
      outcome: {
        text: 'You backtrack and find a safer path.',
        effects: [
          { type: 'xp', value: 15 },
        ],
      },
    },
    {
      text: 'Walk carefully',
      outcome: {
        text: 'The floor collapses! Everyone falls into the pit!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiMantrap,
}

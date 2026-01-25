import type { DungeonEvent } from '@/types'

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
        value: 8,
      },
      outcome: {
        text: 'You find and mark the pit trap safely!',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Jump across the pit',
      outcome: {
        text: 'Most of you make it, but one falls!',
        effects: [
          { type: 'damage', target: 'random', value: 30 },
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
}

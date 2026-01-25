import type { DungeonEvent } from '@/types'

export const PRISONERS_DILEMMA: DungeonEvent = {
  id: 'prisoners-dilemma',
  type: 'choice',
  title: 'Caged Prisoners',
  description: 'Two prisoners beg for freedom. One claims the other is a monster in disguise.',
  choices: [
    {
      text: 'Free both of them',
      outcome: {
        text: 'They both run off. One attacks you from behind!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Free the first prisoner',
      outcome: {
        text: 'He thanks you and gives you information.',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Free the second prisoner',
      outcome: {
        text: 'She rewards you with a valuable item.',
        effects: [
          { type: 'gold', value: 75 },
        ],
      },
    },
    {
      text: 'Leave them both',
      outcome: {
        text: 'You walk away from the moral quandary.',
        effects: [],
      },
    },
  ],
  depth: 3,
}

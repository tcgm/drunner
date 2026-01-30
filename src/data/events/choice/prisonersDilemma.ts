import type { DungeonEvent } from '@/types'
import { GiPrisoner } from 'react-icons/gi'

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
      possibleOutcomes: [
        {
          weight: 60,
          outcome: {
            text: 'He thanks you sincerely and shares valuable information!',
            effects: [
              { type: 'xp', value: 70 },
            ],
          },
        },
        {
          weight: 40,
          outcome: {
            text: 'He transforms into a monster and attacks!',
            effects: [
              { type: 'damage', target: 'all', value: 35 },
              { type: 'xp', value: 30 },
            ],
          },
        },
      ],
    },
    {
      text: 'Free the second prisoner',
      possibleOutcomes: [
        {
          weight: 60,
          outcome: {
            text: 'She rewards you generously with gold and gratitude!',
            effects: [
              { type: 'gold', value: 100 },
              { type: 'xp', value: 40 },
            ],
          },
        },
        {
          weight: 40,
          outcome: {
            text: 'She was the monster! She attacks viciously!',
            effects: [
              { type: 'damage', target: 'all', value: 35 },
              { type: 'xp', value: 30 },
            ],
          },
        },
      ],
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
  icon: GiPrisoner,
}

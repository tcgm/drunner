import type { DungeonEvent } from '@/types'

export const GIANT_RAT_SWARM: DungeonEvent = {
  id: 'giant-rat-swarm',
  type: 'combat',
  title: 'Rat Swarm!',
  description: 'A swarm of giant rats pours from the darkness!',
  choices: [
    {
      text: 'Fight the swarm',
      outcome: {
        text: 'You battle the chittering horde!',
        effects: [
          { type: 'damage', target: 'all', value: 10 },
          { type: 'xp', value: 40 },
          { type: 'gold', value: 15 },
        ],
      },
    },
    {
      text: 'Use area magic (requires Mage)',
      requirements: {
        class: 'mage',
      },
      outcome: {
        text: 'Your fireball incinerates the swarm!',
        effects: [
          { type: 'damage', target: 'random', value: 3 },
          { type: 'xp', value: 55 },
          { type: 'gold', value: 20 },
        ],
      },
    },
    {
      text: 'Run through them',
      outcome: {
        text: 'The rats bite at your heels as you flee!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 20 },
        ],
      },
    },
  ],
  depth: 1,
}

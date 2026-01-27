import type { DungeonEvent } from '@/types'

export const GIANT_RAT_SWARM: DungeonEvent = {
  id: 'giant-rat-swarm',
  type: 'combat',
  title: 'Rat Swarm!',
  description: [
    { weight: 3, text: 'A swarm of giant rats pours from the darkness!' },
    { weight: 2, text: 'Squeaking fills the air as dozens of rats emerge!' },
    { weight: 2, text: 'The floor writhes with a tide of furry bodies!' },
    { weight: 1, text: 'Glowing red eyes appear by the hundreds in the shadows!' },
  ],
  choices: [
    {
      text: 'Fight the swarm',
      outcome: {
        text: [
          { weight: 3, text: 'You battle the chittering horde!' },
          { weight: 2, text: 'You swing wildly at the sea of rats!' },
          { weight: 1, text: 'The swarm overwhelms you with sheer numbers!' },
        ],
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
        text: [
          { weight: 2, text: 'Your fireball incinerates the swarm!' },
          { weight: 2, text: 'Arcane flames sweep through the rat horde!' },
          { weight: 1, text: 'The rats squeal as magic engulfs them!' },
        ],
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
        text: [
          { weight: 2, text: 'The rats bite at your heels as you flee!' },
          { weight: 2, text: 'You dash through the swarm, taking countless bites!' },
          { weight: 1, text: 'Tiny teeth tear at you as you escape!' },
        ],
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 20 },
        ],
      },
    },
  ],
  depth: 1,
}

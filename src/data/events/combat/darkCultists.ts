import type { DungeonEvent } from '@/types'

export const DARK_CULTISTS: DungeonEvent = {
  id: 'dark-cultists',
  type: 'combat',
  title: 'Dark Cultists',
  description: 'Hooded figures surround you, chanting in an ancient tongue!',
  choices: [
    {
      text: 'Attack the cultists',
      outcome: {
        text: 'You disrupt their ritual with violence!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 70 },
          { type: 'gold', value: 40 },
        ],
      },
    },
    {
      text: 'Counter their magic (requires Mage or Necromancer)',
      requirements: {
        class: 'mage',
      },
      outcome: {
        text: 'You turn their dark magic against them!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 90 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Join their chant to confuse them',
      outcome: {
        text: 'They hesitate, confused, before attacking!',
        effects: [
          { type: 'damage', target: 'all', value: 12 },
          { type: 'xp', value: 60 },
          { type: 'gold', value: 35 },
        ],
      },
    },
  ],
  depth: 4,
}

import type { DungeonEvent } from '@/types'

export const RIVAL_ADVENTURERS: DungeonEvent = {
  id: 'rival-adventurers',
  type: 'choice',
  title: 'Rival Adventurers',
  description: 'Another party of adventurers blocks your path. They look hostile.',
  choices: [
    {
      text: 'Challenge them to combat',
      outcome: {
        text: 'You fight them for passage rights!',
        effects: [
          { type: 'damage', target: 'all', value: 15 },
          { type: 'xp', value: 80 },
          { type: 'gold', value: 120 },
        ],
      },
    },
    {
      text: 'Negotiate passage',
      outcome: {
        text: 'You agree to split any treasure found on this floor.',
        effects: [
          { type: 'gold', value: -50 },
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Join forces temporarily',
      outcome: {
        text: 'Together you\'re stronger! They share their loot.',
        effects: [
          { type: 'heal', target: 'all', value: 20 },
          { type: 'gold', value: 80 },
        ],
      },
    },
    {
      text: 'Sneak past them',
      outcome: {
        text: 'They spot you and attack from behind!',
        effects: [
          { type: 'damage', target: 'weakest', value: 30 },
          { type: 'xp', value: 40 },
        ],
      },
    },
  ],
  depth: 2,
}

import type { DungeonEvent } from '@/types'

export const COLLAPSING_CEILING: DungeonEvent = {
  id: 'collapsing-ceiling',
  type: 'trap',
  title: 'Collapsing Ceiling',
  description: 'The ceiling rumbles ominously. Stones begin to fall!',
  choices: [
    {
      text: 'Run for cover!',
      outcome: {
        text: 'You dive for safety as rocks crash down!',
        effects: [
          { type: 'damage', target: 'random', value: 20 },
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Shield the weakest member',
      outcome: {
        text: 'You protect the vulnerable but take damage yourself!',
        effects: [
          { type: 'damage', target: 'random', value: 35 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Support the ceiling (Defense check)',
      requirements: {
        stat: 'defense',
        value: 12,
      },
      outcome: {
        text: 'Your strength holds back the collapse!',
        effects: [
          { type: 'damage', target: 'random', value: 10 },
          { type: 'xp', value: 70 },
        ],
      },
    },
    {
      text: 'Rush through',
      outcome: {
        text: 'Stones rain down on your entire party!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
        ],
      },
    },
  ],
  depth: 3,
}

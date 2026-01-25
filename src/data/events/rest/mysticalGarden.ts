import type { DungeonEvent } from '@/types'

export const MYSTICAL_GARDEN: DungeonEvent = {
  id: 'mystical-garden',
  type: 'rest',
  title: 'Mystical Garden',
  description: 'An underground garden thrives here with glowing plants and strange fruits.',
  choices: [
    {
      text: 'Eat the fruit',
      outcome: {
        text: 'The fruit is delicious and healing!',
        effects: [
          { type: 'heal', target: 'all', value: 60 },
        ],
      },
    },
    {
      text: 'Rest among the plants',
      outcome: {
        text: 'The garden\'s magic rejuvenates you completely.',
        effects: [
          { type: 'heal', target: 'all', value: 999 }, // Full heal
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Lay among the plants and... explore',
      outcome: {
        text: 'As you relax among the vegetation, some vines begin to move of their own accord. They wrap gently around you in ways that are surprisingly... pleasant. You emerge feeling oddly invigorated.',
        effects: [
          { type: 'heal', target: 'all', value: 80 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Study the plants (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You identify valuable herbs and medicinal plants!',
        effects: [
          { type: 'heal', target: 'all', value: 70 },
          { type: 'xp', value: 70 },
        ],
      },
    },
    {
      text: 'Don\'t trust it',
      outcome: {
        text: 'You avoid the strange garden and move on.',
        effects: [],
      },
    },
  ],
  depth: 4,
}

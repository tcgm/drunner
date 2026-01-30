import type { DungeonEvent } from '@/types'
import { GiStoneStack } from 'react-icons/gi'

export const COLLAPSING_CEILING: DungeonEvent = {
  id: 'collapsing-ceiling',
  type: 'trap',
  title: 'Collapsing Ceiling',
  description: 'The ceiling rumbles ominously. Stones begin to fall!',
  choices: [
    {
      text: 'Run for cover! (Speed check)',
      successChance: 0.5,
      statModifier: 'speed',
      successOutcome: {
        text: 'Your quick reflexes save you! Everyone escapes unharmed!',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
      failureOutcome: {
        text: 'You dive for safety but rocks crash down on some of you!',
        effects: [
          { type: 'damage', target: 'random', value: 25 },
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
        minValue: 12,
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
  icon: GiStoneStack,
}

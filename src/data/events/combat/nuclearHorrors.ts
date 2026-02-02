import type { DungeonEvent } from '@/types'
import { GiRadioactive } from 'react-icons/gi'

export const NUCLEAR_HORRORS: DungeonEvent = {
  id: 'nuclear-horrors',
  type: 'combat',
  title: 'Nuclear Horrors',
  description: 'Mutated abominations leak deadly radiation!',
  choices: [
    {
      text: 'Fight through radiation',
      outcome: {
        text: 'Radiation sickness weakens you!',
        effects: [
          { type: 'damage', target: 'all', value: 88 },
          { type: 'xp', value: 455 },
          { type: 'gold', value: 335 },
        ],
      },
    },
    {
      text: 'Radiation shield (Defense check)',
      requirements: { stat: 'defense', minValue: 140 },
      outcome: {
        text: 'You protect yourself from exposure!',
        effects: [
          { type: 'damage', target: 'all', value: 77 },
          { type: 'xp', value: 475 },
          { type: 'gold', value: 355 },
        ],
      },
    },
  ],
  depth: 62,
  icon: GiRadioactive,
}

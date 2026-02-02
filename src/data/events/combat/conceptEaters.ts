import type { DungeonEvent } from '@/types'
import { GiAbstract062 } from 'react-icons/gi'

export const CONCEPT_EATERS: DungeonEvent = {
  id: 'concept-eaters',
  type: 'combat',
  title: 'Concept Eaters',
  description: 'Beings that devour abstract concepts attack your very identity!',
  choices: [
    {
      text: 'Maintain identity',
      outcome: {
        text: 'They consume what makes you real!',
        effects: [
          { type: 'damage', target: 'random', value: 120 },
          { type: 'xp', value: 625 },
          { type: 'gold', value: 505 },
        ],
      },
    },
    {
      text: 'Philosophical defense (Defense check)',
      requirements: { stat: 'defense', minValue: 168 },
      outcome: {
        text: 'Your self-certainty is unshakeable!',
        effects: [
          { type: 'damage', target: 'random', value: 109 },
          { type: 'xp', value: 645 },
          { type: 'gold', value: 520 },
        ],
      },
    },
  ],
  depth: 80,
  icon: GiAbstract062,
}

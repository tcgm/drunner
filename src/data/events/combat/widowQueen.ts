import type { DungeonEvent } from '@/types'
import { GiSpiderMask } from 'react-icons/gi'

export const WIDOW_QUEEN: DungeonEvent = {
  id: 'widow-queen',
  type: 'combat',
  title: 'Widow Queen',
  description: 'A massive spider matriarch defends her territory!',
  choices: [
    {
      text: 'Attack directly',
      outcome: {
        text: 'Her fangs inject deadly venom!',
        effects: [
          { type: 'damage', target: 'strongest', value: 37 },
          { type: 'xp', value: 152 },
          { type: 'gold', value: 97 },
        ],
      },
    },
    {
      text: 'Cut the webs (Strength check)',
      requirements: { stat: 'strength', minValue: 56 },
      outcome: {
        text: 'You trap her in her own web!',
        effects: [
          { type: 'damage', target: 'strongest', value: 28 },
          { type: 'xp', value: 167 },
          { type: 'gold', value: 108 },
        ],
      },
    },
  ],
  depth: 27,
  icon: GiSpiderMask,
}

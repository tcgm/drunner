import type { DungeonEvent } from '@/types'
import { GiFlamingClaw } from 'react-icons/gi'

export const MAGMA_BEASTS: DungeonEvent = {
  id: 'magma-beasts',
  type: 'combat',
  title: 'Magma Beasts',
  description: 'Creatures of molten rock attack with burning claws!',
  choices: [
    {
      text: 'Endure the heat',
      outcome: {
        text: 'Your skin blisters badly!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 276 },
          { type: 'gold', value: 200 },
        ],
      },
    },
    {
      text: 'Protect yourself (Defense check)',
      requirements: { stat: 'defense', minValue: 92 },
      outcome: {
        text: 'You resist the searing heat!',
        effects: [
          { type: 'damage', target: 'all', value: 44 },
          { type: 'xp', value: 296 },
          { type: 'gold', value: 220 },
        ],
      },
    },
  ],
  depth: 41,
  icon: GiFlamingClaw,
}

import type { DungeonEvent } from '@/types'
import { GiCrownedSkull } from 'react-icons/gi'

export const LICH_APPRENTICES: DungeonEvent = {
  id: 'lich-apprentices',
  type: 'combat',
  title: 'Lich Apprentices',
  description: 'Aspiring necromancers practice dark magic!',
  choices: [
    {
      text: 'Disrupt their spells',
      outcome: {
        text: 'Necrotic energy lashes out!',
        effects: [
          { type: 'damage', target: 'strongest', value: 25 },
          { type: 'xp', value: 111 },
          { type: 'gold', value: 70 },
        ],
      },
    },
    {
      text: 'Counter with holy power (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine energy banishes them!',
        effects: [
          { type: 'damage', target: 'strongest', value: 20 },
          { type: 'xp', value: 126 },
          { type: 'gold', value: 80 },
        ],
      },
    },
  ],
  depth: 21,
  icon: GiCrownedSkull,
}

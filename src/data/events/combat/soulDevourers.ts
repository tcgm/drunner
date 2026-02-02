import type { DungeonEvent } from '@/types'
import { GiSoulVessel } from 'react-icons/gi'

export const SOUL_DEVOURERS: DungeonEvent = {
  id: 'soul-devourers',
  type: 'combat',
  title: 'Soul Devourers',
  description: 'Ethereal predators that consume the essence of living beings!',
  choices: [
    {
      text: 'Fight them off',
      outcome: {
        text: 'They drain your very spirit!',
        effects: [
          { type: 'damage', target: 'weakest', value: 47 },
          { type: 'xp', value: 242 },
          { type: 'gold', value: 167 },
        ],
      },
    },
    {
      text: 'Divine protection (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Holy wards shield your soul!',
        effects: [
          { type: 'damage', target: 'weakest', value: 36 },
          { type: 'xp', value: 262 },
          { type: 'gold', value: 187 },
        ],
      },
    },
  ],
  depth: 36,
  icon: GiSoulVessel,
}

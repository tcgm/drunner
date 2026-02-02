import type { DungeonEvent } from '@/types'
import { GiDemonSkull } from 'react-icons/gi'

export const LESSER_DEMONS: DungeonEvent = {
  id: 'lesser-demons',
  type: 'combat',
  title: 'Lesser Demons',
  description: 'Infernal creatures crawl from smoking rifts!',
  choices: [
    {
      text: 'Fight the demons',
      outcome: {
        text: 'Their claws and fire sear you!',
        effects: [
          { type: 'damage', target: 'weakest', value: 27 },
          { type: 'xp', value: 118 },
          { type: 'gold', value: 73 },
        ],
      },
    },
    {
      text: 'Holy wards (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine power repels them!',
        effects: [
          { type: 'damage', target: 'weakest', value: 19 },
          { type: 'xp', value: 138 },
          { type: 'gold', value: 88 },
        ],
      },
    },
  ],
  depth: 19,
  icon: GiDemonSkull,
}

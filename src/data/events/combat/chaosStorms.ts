import type { DungeonEvent } from '@/types'
import { GiAbstract034 } from 'react-icons/gi'

export const CHAOS_STORMS: DungeonEvent = {
  id: 'chaos-storms',
  type: 'combat',
  title: 'Chaos Storms',
  description: 'Storms of pure entropy assault reality itself!',
  choices: [
    {
      text: 'Weather entropy',
      outcome: {
        text: 'Chaos corrupts your form!',
        effects: [
          { type: 'damage', target: 'random', value: 189 },
          { type: 'xp', value: 995 },
          { type: 'gold', value: 792 },
        ],
      },
    },
    {
      text: 'Anchor to reality (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine order sustains you!',
        effects: [
          { type: 'damage', target: 'random', value: 178 },
          { type: 'xp', value: 1015 },
          { type: 'gold', value: 812 },
        ],
      },
    },
  ],
  depth: 98,
  icon: GiAbstract034,
}

import type { DungeonEvent } from '@/types'
import { GiDeadHead } from 'react-icons/gi'

export const LICH_SPAWN: DungeonEvent = {
  id: 'lich-spawn',
  type: 'combat',
  title: 'Lich Spawn',
  description: 'Lesser undead mages cast necrotic spells!',
  choices: [
    {
      text: 'Interrupt their magic',
      outcome: {
        text: 'Deathly energy drains you!',
        effects: [
          { type: 'damage', target: 'random', value: 45 },
          { type: 'xp', value: 238 },
          { type: 'gold', value: 163 },
        ],
      },
    },
    {
      text: 'Holy purge (Cleric bonus)',
      requirements: { class: 'Cleric' },
      outcome: {
        text: 'Divine light destroys the undead!',
        effects: [
          { type: 'damage', target: 'random', value: 34 },
          { type: 'xp', value: 258 },
          { type: 'gold', value: 183 },
        ],
      },
    },
  ],
  depth: 35,
  icon: GiDeadHead,
}

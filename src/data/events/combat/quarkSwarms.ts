import type { DungeonEvent } from '@/types'
import { GiMaterialsScience } from 'react-icons/gi'

export const QUARK_SWARMS: DungeonEvent = {
  id: 'quark-swarms',
  type: 'combat',
  title: 'Quark Swarms',
  description: 'Subatomic particles form living clouds of destruction!',
  choices: [
    {
      text: 'Phase through them',
      outcome: {
        text: 'They tear your atoms apart!',
        effects: [
          { type: 'damage', target: 'strongest', value: 145 },
          { type: 'xp', value: 776 },
          { type: 'gold', value: 600 },
        ],
      },
    },
    {
      text: 'Stabilize particles (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You force them to cohere!',
        effects: [
          { type: 'damage', target: 'strongest', value: 134 },
          { type: 'xp', value: 796 },
          { type: 'gold', value: 620 },
        ],
      },
    },
  ],
  depth: 79,
  icon: GiMaterialsScience,
}

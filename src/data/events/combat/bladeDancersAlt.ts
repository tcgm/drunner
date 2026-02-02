import type { DungeonEvent } from '@/types'
import { GiSwordsPower } from 'react-icons/gi'

export const BLADE_DANCERS: DungeonEvent = {
  id: 'blade-dancers-alt',
  type: 'combat',
  title: 'Blade Dancers',
  description: 'Graceful warriors wield whirling swords in combat!',
  choices: [
    {
      text: 'Match their speed',
      outcome: {
        text: 'Their blades cut deep!',
        effects: [
          { type: 'damage', target: 'strongest', value: 34 },
          { type: 'xp', value: 145 },
          { type: 'gold', value: 90 },
        ],
      },
    },
    {
      text: 'Disrupt their rhythm (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'They stumble and fall!',
        effects: [
          { type: 'damage', target: 'strongest', value: 26 },
          { type: 'xp', value: 160 },
          { type: 'gold', value: 101 },
        ],
      },
    },
  ],
  depth: 26,
  icon: GiSwordsPower,
}

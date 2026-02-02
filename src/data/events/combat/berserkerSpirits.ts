import type { DungeonEvent } from '@/types'
import { GiMagicAxe } from 'react-icons/gi'

export const BERSERKER_SPIRITS: DungeonEvent = {
  id: 'berserker-spirits',
  type: 'combat',
  title: 'Berserker Spirits',
  description: 'Ethereal warriors fight with endless rage!',
  choices: [
    {
      text: 'Match their fury',
      outcome: {
        text: 'You fight with equal ferocity!',
        effects: [
          { type: 'damage', target: 'strongest', value: 32 },
          { type: 'xp', value: 130 },
          { type: 'gold', value: 81 },
        ],
      },
    },
    {
      text: 'Warrior spirit (Warrior bonus)',
      requirements: { class: 'Warrior' },
      outcome: {
        text: 'Your battle prowess overwhelms them!',
        effects: [
          { type: 'damage', target: 'strongest', value: 23 },
          { type: 'xp', value: 150 },
          { type: 'gold', value: 96 },
        ],
      },
    },
  ],
  depth: 20,
  icon: GiMagicAxe,
}

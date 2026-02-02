import type { DungeonEvent } from '@/types'
import { GiAtom } from 'react-icons/gi'

export const QUANTUM_STALKERS: DungeonEvent = {
  id: 'quantum-stalkers',
  type: 'combat',
  title: 'Quantum Stalkers',
  description: 'Beings existing in quantum superposition strike from multiple states!',
  choices: [
    {
      text: 'Collapse the waveform',
      outcome: {
        text: 'They exist in all possibilities!',
        effects: [
          { type: 'damage', target: 'random', value: 92 },
          { type: 'xp', value: 470 },
          { type: 'gold', value: 350 },
        ],
      },
    },
    {
      text: 'Probability control (Mage bonus)',
      requirements: { class: 'Mage' },
      outcome: {
        text: 'You fix them in one state!',
        effects: [
          { type: 'damage', target: 'random', value: 81 },
          { type: 'xp', value: 490 },
          { type: 'gold', value: 370 },
        ],
      },
    },
  ],
  depth: 64,
  icon: GiAtom,
}

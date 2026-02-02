import type { DungeonEvent } from '@/types'
import { GiSpikedTentacle } from 'react-icons/gi'

export const ABERRANT_TENTACLES: DungeonEvent = {
  id: 'aberrant-tentacles',
  type: 'combat',
  title: 'Aberrant Tentacles',
  description: 'Monstrous appendages from an unseen horror lash out!',
  choices: [
    {
      text: 'Sever them',
      outcome: {
        text: 'More tentacles emerge!',
        effects: [
          { type: 'damage', target: 'weakest', value: 40 },
          { type: 'xp', value: 175 },
          { type: 'gold', value: 122 },
        ],
      },
    },
    {
      text: 'Target the source (Rogue bonus)',
      requirements: { class: 'Rogue' },
      outcome: {
        text: 'You strike the hidden creature!',
        effects: [
          { type: 'damage', target: 'weakest', value: 30 },
          { type: 'xp', value: 195 },
          { type: 'gold', value: 142 },
        ],
      },
    },
  ],
  depth: 28,
  icon: GiSpikedTentacle,
}

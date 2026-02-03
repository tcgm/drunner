import type { DungeonEvent } from '@/types'
import { GiSpectreM4 } from 'react-icons/gi'

export const SPECTRAL_LORD: DungeonEvent = {
  id: 'spectral-lord',
  type: 'boss',
  title: 'Spectral Lord',
  description: 'The ghost of a tyrant king, still clinging to power. His ethereal form phases through your weapons, and his touch chills the soul.',
  choices: [
    {
      text: 'Strike the ghost',
      outcome: {
        text: 'Your weapons pass through! His life-draining touch ages you with each strike!',
        effects: [
          { type: 'damage', target: 'all', value: 168 },
          { type: 'xp', value: 680 },
          { type: 'gold', value: 985 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 19 },
        ],
      },
    },
    {
      text: 'Lay him to rest (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Sacred rites finally give him the peace death denied! He fades gratefully!',
        effects: [
          { type: 'damage', target: 'all', value: 128 },
          { type: 'xp', value: 745 },
          { type: 'gold', value: 1065 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Use magic weapons (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 40,
      },
      outcome: {
        text: 'Enchanted blades can harm ghosts! You destroy his spectral form!',
        effects: [
          { type: 'damage', target: 'random', value: 142 },
          { type: 'xp', value: 765 },
          { type: 'gold', value: 1090 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 24 },
        ],
      },
    },
  ],
  depth: 33,
  icon: GiSpectreM4,
}

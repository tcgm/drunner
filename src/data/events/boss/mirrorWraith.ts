import type { DungeonEvent } from '@/types'
import { GiMirrorMirror } from 'react-icons/gi'

export const MIRROR_WRAITH: DungeonEvent = {
  id: 'mirror-wraith',
  type: 'boss',
  title: 'Mirror Wraith',
  description: 'A spectral figure emerges from a cracked mirror, wearing your own face. It mimics your every move perfectly.',
  choices: [
    {
      text: 'Attack your reflection',
      outcome: {
        text: 'You strike at the wraith, but it mirrors your attacks perfectly!',
        effects: [
          { type: 'damage', target: 'all', value: 36 },
          { type: 'xp', value: 195 },
          { type: 'gold', value: 285 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Shatter the mirror (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 11,
      },
      outcome: {
        text: 'You destroy the source! The wraith screams and dissipates!',
        effects: [
          { type: 'damage', target: 'random', value: 26 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 340 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Dispel the illusion (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your magical sight pierces the deception! The wraith has no power over you!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 250 },
          { type: 'gold', value: 350 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 15 },
        ],
      },
    },
  ],
  depth: 10,
  icon: GiMirrorMirror,
}

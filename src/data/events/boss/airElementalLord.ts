import type { DungeonEvent } from '@/types'
import { GiWindsock } from 'react-icons/gi'

export const AIR_ELEMENTAL_LORD: DungeonEvent = {
  id: 'air-elemental-lord',
  type: 'boss',
  title: 'Air Elemental Lord',
  description: 'A massive vortex of sentient wind fills the chamber. Lightning crackles through its form, and the howling winds threaten to tear you apart.',
  choices: [
    {
      text: 'Fight the storm',
      outcome: {
        text: 'You\'re buffeted by hurricane-force winds! Lightning strikes relentlessly!',
        effects: [
          { type: 'damage', target: 'all', value: 118 },
          { type: 'xp', value: 460 },
          { type: 'gold', value: 610 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Disperse the winds (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your counter-magic scatters the elemental! It dissipates harmlessly!',
        effects: [
          { type: 'damage', target: 'all', value: 75 },
          { type: 'xp', value: 503 },
          { type: 'gold', value: 663 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Anchor yourself (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 27,
      },
      outcome: {
        text: 'You stand firm against the gale! Unable to move you, it exhausts itself!',
        effects: [
          { type: 'damage', target: 'weakest', value: 84 },
          { type: 'xp', value: 498 },
          { type: 'gold', value: 658 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
  ],
  depth: 22,
  icon: GiWindsock,
}

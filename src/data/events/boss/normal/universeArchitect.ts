import type { DungeonEvent } from '@/types'
import { GiGalaxy } from 'react-icons/gi'

export const UNIVERSE_ARCHITECT: DungeonEvent = {
  id: 'universe-architect',
  type: 'boss',
  title: 'Universe Architect',
  description: 'A being that designs realities. It built this universe and countless others. You are but one atom in its grand design.',
  choices: [
    {
      text: 'Defy your creator',
      outcome: {
        text: 'It unmakes you with a thought! You were designed to lose!',
        effects: [
          { type: 'damage', target: 'all', value: 652 },
          { type: 'xp', value: 2710 },
          { type: 'gold', value: 4065 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 54 },
        ],
      },
    },
    {
      text: 'Redesign yourself (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 94,
      },
      outcome: {
        text: 'You transcend your design! Free will defeats determinism!',
        effects: [
          { type: 'damage', target: 'all', value: 625 },
          { type: 'xp', value: 2900 },
          { type: 'gold', value: 4350 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 76 },
        ],
      },
    },
    {
      text: 'Become an architect (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You learn to create! The student surpasses the master!',
        effects: [
          { type: 'damage', target: 'all', value: 638 },
          { type: 'xp', value: 2930 },
          { type: 'gold', value: 4395 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 77 },
        ],
      },
    },
  ],
  depth: 97,
  icon: GiGalaxy,
}

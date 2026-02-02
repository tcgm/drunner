import type { DungeonEvent } from '@/types'
import { GiCrackedGlass } from 'react-icons/gi'

export const REALITY_RIPPER: DungeonEvent = {
  id: 'reality-ripper',
  type: 'boss',
  title: 'Reality Ripper',
  description: 'An aberration that exists between dimensions. It tears holes in space itself, and looking at it causes vertigo as perspectives shift impossibly.',
  choices: [
    {
      text: 'Navigate the tears',
      outcome: {
        text: 'Reality fractures around you! You\'re caught in dimensional rifts!',
        effects: [
          { type: 'damage', target: 'all', value: 178 },
          { type: 'xp', value: 700 },
          { type: 'gold', value: 1015 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Stabilize reality (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your spells seal the rifts! Trapped in one reality, it\'s vulnerable!',
        effects: [
          { type: 'damage', target: 'all', value: 140 },
          { type: 'xp', value: 760 },
          { type: 'gold', value: 1085 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Perceive true form (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 37,
      },
      outcome: {
        text: 'You see past the illusions! Its true form is weak and defenseless!',
        effects: [
          { type: 'damage', target: 'weakest', value: 150 },
          { type: 'xp', value: 785 },
          { type: 'gold', value: 1115 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
  ],
  depth: 35,
  icon: GiCrackedGlass,
}

import type { DungeonEvent } from '@/types'
import { GiEvilEyes } from 'react-icons/gi'

export const BEHOLDER_SPAWN: DungeonEvent = {
  id: 'beholder-spawn',
  type: 'boss',
  title: 'Beholder Spawn',
  description: 'A floating orb covered in eyes hovers before you. Each eye glows with a different magical energy, ready to unleash devastating rays.',
  choices: [
    {
      text: 'Charge directly',
      outcome: {
        text: 'Multiple eye rays blast you from all angles! The magic is overwhelming!',
        effects: [
          { type: 'damage', target: 'all', value: 73 },
          { type: 'xp', value: 325 },
          { type: 'gold', value: 430 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Counterspell (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You disrupt its magic! Without its eyes, the beholder is helpless!',
        effects: [
          { type: 'damage', target: 'all', value: 52 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 480 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Blind the central eye (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 19,
      },
      outcome: {
        text: 'You destroy its main eye! The other eyes go dark and it falls!',
        effects: [
          { type: 'damage', target: 'strongest', value: 58 },
          { type: 'xp', value: 365 },
          { type: 'gold', value: 475 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 18,
  icon: GiEvilEyes,
}

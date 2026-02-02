import type { DungeonEvent } from '@/types'
import { GiSevenPointedStar } from 'react-icons/gi'

export const ASTRAL_DREADNOUGHT: DungeonEvent = {
  id: 'astral-dreadnought',
  type: 'boss',
  title: 'Astral Dreadnought',
  description: 'A cosmic beast that devours planes of existence. Its maw can consume anything, and it exists partially outside reality.',
  choices: [
    {
      text: 'Fight the dreadnought',
      outcome: {
        text: 'It tries to swallow you whole! Reality bends as you resist!',
        effects: [
          { type: 'damage', target: 'all', value: 300 },
          { type: 'xp', value: 1140 },
          { type: 'gold', value: 1710 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 23 },
        ],
      },
    },
    {
      text: 'Escape to another plane (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You teleport repeatedly! The dreadnought exhausts itself chasing!',
        effects: [
          { type: 'damage', target: 'all', value: 225 },
          { type: 'xp', value: 1255 },
          { type: 'gold', value: 1883 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 27 },
        ],
      },
    },
    {
      text: 'Strike from within (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 51,
      },
      outcome: {
        text: 'Let it swallow you, then tear your way out from inside!',
        effects: [
          { type: 'damage', target: 'strongest', value: 252 },
          { type: 'xp', value: 1280 },
          { type: 'gold', value: 1920 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 42,
  icon: GiSevenPointedStar,
}

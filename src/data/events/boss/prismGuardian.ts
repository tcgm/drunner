import type { DungeonEvent } from '@/types'
import { GiLaserWarning } from 'react-icons/gi'

export const PRISM_GUARDIAN: DungeonEvent = {
  id: 'prism-guardian',
  type: 'boss',
  title: 'Prism Guardian',
  description: 'A being of pure light refracted through countless crystals. It can split into duplicates and attack with focused light beams.',
  choices: [
    {
      text: 'Fight all reflections',
      outcome: {
        text: 'Dozens of copies attack! Laser beams crisscross the chamber!',
        effects: [
          { type: 'damage', target: 'all', value: 325 },
          { type: 'xp', value: 1210 },
          { type: 'gold', value: 1815 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 25 },
        ],
      },
    },
    {
      text: 'Find the true one (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 55,
      },
      outcome: {
        text: 'You identify the real guardian! Destroy it and the copies vanish!',
        effects: [
          { type: 'damage', target: 'random', value: 272 },
          { type: 'xp', value: 1355 },
          { type: 'gold', value: 2033 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Shatter the prisms (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You destroy every crystal! Without reflections, it\'s powerless!',
        effects: [
          { type: 'damage', target: 'strongest', value: 265 },
          { type: 'xp', value: 1375 },
          { type: 'gold', value: 2063 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
  ],
  depth: 45,
  icon: GiLaserWarning,
}

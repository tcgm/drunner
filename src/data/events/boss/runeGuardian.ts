import type { DungeonEvent } from '@/types'
import { GiBoltShield } from 'react-icons/gi'

export const RUNE_GUARDIAN: DungeonEvent = {
  id: 'rune-guardian',
  type: 'boss',
  title: 'Rune Guardian',
  description: 'An ancient protector covered in glowing runes. Each symbol grants different powers, and destroying one activates another.',
  choices: [
    {
      text: 'Attack the runes',
      outcome: {
        text: 'Each destroyed rune triggers magical explosions! The guardian adapts!',
        effects: [
          { type: 'damage', target: 'all', value: 352 },
          { type: 'xp', value: 1295 },
          { type: 'gold', value: 1943 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Decode the runes (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 58,
      },
      outcome: {
        text: 'You understand the runic language! You deactivate them safely!',
        effects: [
          { type: 'damage', target: 'all', value: 288 },
          { type: 'xp', value: 1400 },
          { type: 'gold', value: 2100 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 34 },
        ],
      },
    },
    {
      text: 'Overload the runes (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You pump too much magic into the system! The guardian explodes!',
        effects: [
          { type: 'damage', target: 'random', value: 298 },
          { type: 'xp', value: 1415 },
          { type: 'gold', value: 2123 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
  ],
  depth: 49,
  icon: GiBoltShield,
}

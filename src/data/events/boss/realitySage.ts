import type { DungeonEvent } from '@/types'
import { GiEyeOfHorus } from 'react-icons/gi'

export const REALITY_SAGE: DungeonEvent = {
  id: 'reality-sage',
  type: 'boss',
  title: 'Reality Sage',
  description: 'An enlightened being who has transcended understanding of reality. It rewrites the rules of existence with mere thoughts.',
  choices: [
    {
      text: 'Fight in shifting reality',
      outcome: {
        text: 'Reality bends around you! Up is down, pain is pleasure, death might be life!',
        effects: [
          { type: 'damage', target: 'random', value: 392 },
          { type: 'xp', value: 1590 },
          { type: 'gold', value: 2385 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Anchor reality (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 66,
      },
      outcome: {
        text: 'You impose stable reality through sheer understanding! The sage is trapped!',
        effects: [
          { type: 'damage', target: 'all', value: 322 },
          { type: 'xp', value: 1710 },
          { type: 'gold', value: 2565 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Embrace the chaos (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You channel the warped reality! The sage\'s own power destroys it!',
        effects: [
          { type: 'damage', target: 'weakest', value: 335 },
          { type: 'xp', value: 1735 },
          { type: 'gold', value: 2603 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
  ],
  depth: 53,
  icon: GiEyeOfHorus,
}

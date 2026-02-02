import type { DungeonEvent } from '@/types'
import { GiBleedingEye } from 'react-icons/gi'

export const NIGHTMARE_WEAVER: DungeonEvent = {
  id: 'nightmare-weaver',
  type: 'boss',
  title: 'Nightmare Weaver',
  description: 'An entity that pulls your worst fears from your mind and makes them real. Fighting your nightmares is never easy.',
  choices: [
    {
      text: 'Face your fears',
      outcome: {
        text: 'Your deepest terrors made flesh! Rational thought abandons you!',
        effects: [
          { type: 'damage', target: 'all', value: 482 },
          { type: 'xp', value: 1960 },
          { type: 'gold', value: 2940 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Master your mind (High Wisdom)',
      requirements: {
        stat: 'wisdom',
        minValue: 76,
      },
      outcome: {
        text: 'You face your fears without flinching! The weaver has no power!',
        effects: [
          { type: 'damage', target: 'all', value: 418 },
          { type: 'xp', value: 2090 },
          { type: 'gold', value: 3135 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 52 },
        ],
      },
    },
    {
      text: 'Embrace the nightmare (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Fear becomes fuel! The weaver created the weapon of its own demise!',
        effects: [
          { type: 'damage', target: 'strongest', value: 432 },
          { type: 'xp', value: 2115 },
          { type: 'gold', value: 3173 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 53 },
        ],
      },
    },
  ],
  depth: 70,
  icon: GiBleedingEye,
}

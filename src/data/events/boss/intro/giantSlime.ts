import type { DungeonEvent } from '@/types'
import { GiSlime } from 'react-icons/gi'

export const GIANT_SLIME: DungeonEvent = {
  id: 'giant-slime-intro',
  type: 'boss',
  title: 'Giant Slime',
  description: 'A massive blob of acidic ooze blocks the corridor. It jiggles menacingly as you approach.',
  choices: [
    {
      text: 'Slash through it',
      outcome: {
        text: 'Your weapons cut through the slime, but it reforms slowly. Victory is yours!',
        effects: [
          { type: 'damage', target: 'all', value: 14 },
          { type: 'xp', value: 115 },
          { type: 'gold', value: 145 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Freeze it with magic (High Luck)',
      requirements: {
        stat: 'luck',
        minValue: 8,
      },
      outcome: {
        text: 'You find a weak spot! The slime freezes and shatters into pieces!',
        effects: [
          { type: 'damage', target: 'random', value: 9 },
          { type: 'xp', value: 145 },
          { type: 'gold', value: 175 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 7 },
        ],
      },
    },
    {
      text: 'Blast it with fire (Wizard bonus)',
      requirements: {
        class: 'Wizard',
      },
      outcome: {
        text: 'Your flames evaporate the slime instantly! Nothing but steam remains!',
        effects: [
          { type: 'damage', target: 'all', value: 6 },
          { type: 'xp', value: 155 },
          { type: 'gold', value: 195 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiSlime,
  isIntroBoss: true,
}

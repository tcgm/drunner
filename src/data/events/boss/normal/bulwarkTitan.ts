import type { DungeonEvent } from '@/types'
import { GiCrackedShield } from 'react-icons/gi'

export const BULWARK_TITAN: DungeonEvent = {
  id: 'bulwark-titan',
  type: 'boss',
  title: 'Bulwark Titan',
  description: 'An immense construct designed for absolute defense. Its shield has never been breached, its armor never dented.',
  choices: [
    {
      text: 'Attack the defense',
      outcome: {
        text: 'Your weapons bounce off harmlessly! It slowly grinds you down!',
        effects: [
          { type: 'damage', target: 'all', value: 375 },
          { type: 'xp', value: 1540 },
          { type: 'gold', value: 2310 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Find the weak point (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You spot the maintenance hatch! One precise strike brings it down!',
        effects: [
          { type: 'damage', target: 'all', value: 298 },
          { type: 'xp', value: 1650 },
          { type: 'gold', value: 2475 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
    {
      text: 'Bypass the armor (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 60,
      },
      outcome: {
        text: 'Your power penetrates even perfect defense! The titan falls!',
        effects: [
          { type: 'damage', target: 'strongest', value: 312 },
          { type: 'xp', value: 1675 },
          { type: 'gold', value: 2513 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 36 },
        ],
      },
    },
  ],
  depth: 53,
  icon: GiCrackedShield,
}

import type { DungeonEvent } from '@/types'
import { GiWingedSword } from 'react-icons/gi'

export const BLADE_SERAPH: DungeonEvent = {
  id: 'blade-seraph',
  type: 'boss',
  title: 'Blade Seraph',
  description: 'A celestial being of pure combat prowess. It has six arms, each wielding a different legendary weapon.',
  choices: [
    {
      text: 'Face all six blades',
      outcome: {
        text: 'Six legendary weapons strike as one! Celestial skill overwhelms you!',
        effects: [
          { type: 'damage', target: 'all', value: 468 },
          { type: 'xp', value: 1920 },
          { type: 'gold', value: 2880 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Match its skill (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 72,
      },
      outcome: {
        text: 'You match blade for blade! The seraph acknowledges your mastery!',
        effects: [
          { type: 'damage', target: 'strongest', value: 405 },
          { type: 'xp', value: 2050 },
          { type: 'gold', value: 3075 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
    {
      text: 'Disarm systematically (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You disarm one blade after another! The seraph is powerless!',
        effects: [
          { type: 'damage', target: 'weakest', value: 418 },
          { type: 'xp', value: 2075 },
          { type: 'gold', value: 3113 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 51 },
        ],
      },
    },
  ],
  depth: 68,
  icon: GiWingedSword,
}

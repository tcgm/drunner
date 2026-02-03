import type { DungeonEvent } from '@/types'
import { GiPunchBlast } from 'react-icons/gi'

export const TITAN_BREAKER: DungeonEvent = {
  id: 'titan-breaker',
  type: 'boss',
  title: 'Titan Breaker',
  description: 'A warrior who has slain gods. Its strength is legendary. Armor means nothing. Defense is futile. Only power matters.',
  choices: [
    {
      text: 'Defend yourself',
      outcome: {
        text: 'Its strength shatters all defense! Armor crumples like paper!',
        effects: [
          { type: 'damage', target: 'all', value: 532 },
          { type: 'xp', value: 2190 },
          { type: 'gold', value: 3285 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 42 },
        ],
      },
    },
    {
      text: 'Match strength with strength (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 78,
      },
      outcome: {
        text: 'You meet power with power! The titan breaker acknowledges an equal!',
        effects: [
          { type: 'damage', target: 'strongest', value: 472 },
          { type: 'xp', value: 2320 },
          { type: 'gold', value: 3480 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 58 },
        ],
      },
    },
    {
      text: 'Use technique over strength (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'Skill defeats brute force! You prove there\'s more to combat than strength!',
        effects: [
          { type: 'damage', target: 'strongest', value: 485 },
          { type: 'xp', value: 2345 },
          { type: 'gold', value: 3518 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 59 },
        ],
      },
    },
  ],
  depth: 74,
  icon: GiPunchBlast,
}

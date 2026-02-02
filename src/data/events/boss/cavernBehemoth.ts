import type { DungeonEvent } from '@/types'
import { GiMountainCave } from 'react-icons/gi'

export const CAVERN_BEHEMOTH: DungeonEvent = {
  id: 'cavern-behemoth',
  type: 'boss',
  title: 'Cavern Behemoth',
  description: 'A creature so massive it has become one with the dungeon itself. Fighting it means fighting the very walls around you.',
  choices: [
    {
      text: 'Fight the dungeon',
      outcome: {
        text: 'Walls close in! The floor erupts! The ceiling collapses! The dungeon attacks!',
        effects: [
          { type: 'damage', target: 'all', value: 410 },
          { type: 'xp', value: 1640 },
          { type: 'gold', value: 2460 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 32 },
        ],
      },
    },
    {
      text: 'Find the core (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 69,
      },
      outcome: {
        text: 'You sense its true body hidden within! You strike the vulnerable core!',
        effects: [
          { type: 'damage', target: 'all', value: 342 },
          { type: 'xp', value: 1760 },
          { type: 'gold', value: 2640 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 41 },
        ],
      },
    },
    {
      text: 'Destroy everything (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You smash through walls and floor! Somewhere in the rubble, it dies!',
        effects: [
          { type: 'damage', target: 'strongest', value: 355 },
          { type: 'xp', value: 1785 },
          { type: 'gold', value: 2678 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 42 },
        ],
      },
    },
  ],
  depth: 56,
  icon: GiMountainCave,
}

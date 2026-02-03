import type { DungeonEvent } from '@/types'
import { GiSteampunkGoggles } from 'react-icons/gi'

export const GEAR_TYRANT: DungeonEvent = {
  id: 'gear-tyrant',
  type: 'boss',
  title: 'Gear Tyrant',
  description: 'A clockwork despot powered by countless interlocking mechanisms. Its precision is matched only by its cruelty.',
  choices: [
    {
      text: 'Battle the machine',
      outcome: {
        text: 'Perfect mechanical precision! Every strike calculated, every movement optimized!',
        effects: [
          { type: 'damage', target: 'all', value: 368 },
          { type: 'xp', value: 1510 },
          { type: 'gold', value: 2265 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 29 },
        ],
      },
    },
    {
      text: 'Jam the gears (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You find the weak point! One thrown bolt and the whole system seizes!',
        effects: [
          { type: 'damage', target: 'all', value: 292 },
          { type: 'xp', value: 1625 },
          { type: 'gold', value: 2438 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 34 },
        ],
      },
    },
    {
      text: 'Overpower the machine (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 60,
      },
      outcome: {
        text: 'Brute force breaks precision! You smash through its defenses!',
        effects: [
          { type: 'damage', target: 'strongest', value: 305 },
          { type: 'xp', value: 1645 },
          { type: 'gold', value: 2468 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 35 },
        ],
      },
    },
  ],
  depth: 52,
  icon: GiSteampunkGoggles,
}

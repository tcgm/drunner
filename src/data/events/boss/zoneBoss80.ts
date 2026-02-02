import type { DungeonEvent } from '@/types'
import { GiEyeOfHorus } from 'react-icons/gi'

export const ZONE_BOSS_80: DungeonEvent = {
  id: 'zone-boss-80-fate-weaver',
  type: 'boss',
  title: 'The Fate Weaver',
  description: 'An incomprehensible being that exists outside time itself. It sees all possible futures and pasts simultaneously. To fight it is to battle probability and causality themselves.',
  depth: 80,
  isZoneBoss: true,
  zoneBossFloor: 80,
  icon: GiEyeOfHorus,
  choices: [
    {
      text: 'Create your own fate',
      outcome: {
        text: 'You refuse to be bound by destiny! Your will proves stronger than the threads of fate!',
        effects: [
          { type: 'damage', target: 'all', value: 563 },
          { type: 'xp', value: 2100 },
          { type: 'gold', value: 3200 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Embrace chaos (Bard bonus)',
      requirements: { class: 'Bard' },
      outcome: {
        text: 'You sing a song of pure randomness and impossibility! The Fate Weaver cannot predict what has no pattern!',
        effects: [
          { type: 'damage', target: 'all', value: 405 },
          { type: 'xp', value: 2500 },
          { type: 'gold', value: 3500 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 45 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Fight across all timelines',
      outcome: {
        text: 'You battle it in a thousand possible futures at once, winning in enough of them to force its defeat!',
        effects: [
          { type: 'damage', target: 'all', value: 630 },
          { type: 'xp', value: 2300 },
          { type: 'gold', value: 3300 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythic', rarityBoost: 40 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
        ],
      },
    },
  ],
}

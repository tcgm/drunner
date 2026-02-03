import type { DungeonEvent } from '@/types'
import { GiBearHead } from 'react-icons/gi'

export const CORRUPTED_BEAR: DungeonEvent = {
  id: 'corrupted-bear',
  type: 'boss',
  title: 'Corrupted Bear',
  description: 'A once-noble beast, now twisted by dark magic. Its eyes glow with unnatural purple light as it charges.',
  choices: [
    {
      text: 'Dodge and strike',
      outcome: {
        text: 'You narrowly avoid its claws and land several hits, but it\'s incredibly strong!',
        effects: [
          { type: 'damage', target: 'all', value: 28 },
          { type: 'xp', value: 170 },
          { type: 'gold', value: 240 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
    {
      text: 'Cleanse the corruption (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 8,
      },
      outcome: {
        text: 'You withstand its assault and purge the dark energy! The bear falls peacefully!',
        effects: [
          { type: 'damage', target: 'all', value: 20 },
          { type: 'xp', value: 210 },
          { type: 'gold', value: 300 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 11 },
        ],
      },
    },
    {
      text: 'Tame the beast (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You speak to the bear\'s true nature! It shakes off the corruption and retreats!',
        effects: [
          { type: 'damage', target: 'all', value: 10 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 340 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
  ],
  depth: 3,
  icon: GiBearHead,
}

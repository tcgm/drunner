import type { DungeonEvent } from '@/types'
import { GiSwapBag } from 'react-icons/gi'

export const DUNGEON_MIMIC: DungeonEvent = {
  id: 'dungeon-mimic',
  type: 'boss',
  title: 'Dungeon Mimic',
  description: 'What you thought was an ornate chest suddenly sprouts teeth and tentacles! This massive mimic has fooled countless adventurers.',
  choices: [
    {
      text: 'Pry it open by force',
      outcome: {
        text: 'The mimic\'s bite is vicious! Its acidic saliva burns your skin!',
        effects: [
          { type: 'damage', target: 'all', value: 62 },
          { type: 'xp', value: 305 },
          { type: 'gold', value: 405 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Burn it out (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 16,
      },
      outcome: {
        text: 'Flames force the mimic to release you! It tries to flee but you finish it!',
        effects: [
          { type: 'damage', target: 'weakest', value: 47 },
          { type: 'xp', value: 345 },
          { type: 'gold', value: 450 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Detect and avoid (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You spotted the trap! You kill it before it can react!',
        effects: [
          { type: 'damage', target: 'all', value: 38 },
          { type: 'xp', value: 370 },
          { type: 'gold', value: 485 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiSwapBag,
}

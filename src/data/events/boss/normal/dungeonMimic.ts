import type { DungeonEvent } from '@/types'
import { GiSwapBag } from 'react-icons/gi'

export const ANCIENT_MIMIC_LORD: DungeonEvent = {
  id: 'ancient-mimic-lord',
  type: 'boss',
  title: 'Ancient Mimic Lord',
  description: 'This is no ordinary mimic - it\'s the progenitor of all mimics, so ancient and cunning it has learned to mimic entire rooms. It has devoured thousands of adventurers over the centuries, growing to monstrous proportions with countless tentacles and maws.',
  choices: [
    {
      text: 'Pry it open by force',
      outcome: {
        text: 'The mimic\'s bite is vicious! Its acidic saliva burns your skin!',
        effects: [
          { type: 'damage', target: 'all', value: 62 },
          { type: 'xp', value: 305 },
          { type: 'gold', value: 405 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 12 },
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
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 16 },
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
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 19 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiSwapBag,
}

import type { DungeonEvent } from '@/types'
import { GiTrollSkull } from 'react-icons/gi'

export const ROTTEN_TROLL: DungeonEvent = {
  id: 'rotten-troll',
  type: 'boss',
  title: 'Rotten Troll',
  description: 'A massive troll covered in festering wounds blocks your path. The stench of decay fills the chamber as it roars with primal rage.',
  choices: [
    {
      text: 'Attack head-on',
      outcome: {
        text: 'You exchange brutal blows with the troll. Its regeneration keeps it fighting!',
        effects: [
          { type: 'damage', target: 'all', value: 25 },
          { type: 'xp', value: 180 },
          { type: 'gold', value: 250 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Use fire to stop regeneration (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 8,
      },
      outcome: {
        text: 'You ignite the troll\'s wounds! It burns to ash before it can regenerate!',
        effects: [
          { type: 'damage', target: 'all', value: 18 },
          { type: 'xp', value: 220 },
          { type: 'gold', value: 320 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 12 },
        ],
      },
    },
    {
      text: 'Target its legs (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You hamstring the beast! It crashes down, unable to stand!',
        effects: [
          { type: 'damage', target: 'strongest', value: 15 },
          { type: 'xp', value: 240 },
          { type: 'gold', value: 350 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'rare', rarityBoost: 14 },
        ],
      },
    },
  ],
  depth: 5,
  icon: GiTrollSkull,
}

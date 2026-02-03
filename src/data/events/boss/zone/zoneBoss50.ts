import type { DungeonEvent } from '@/types'
import { GiIceCube } from 'react-icons/gi'

export const ZONE_BOSS_50: DungeonEvent = {
  id: 'zone-boss-50-eternal-winter',
  type: 'boss',
  title: 'Avatar of Eternal Winter',
  description: 'An primordial force of nature given form. This being embodies the concept of absolute zero, where all motion ceases and entropy claims everything. The temperature plummets as ice forms on your weapons.',
  depth: 50,
  isZoneBoss: true,
  zoneBossFloor: 50,
  icon: GiIceCube,
  choices: [
    {
      text: 'Endure the freezing assault',
      outcome: {
        text: 'Your bodies scream in protest as the cold threatens to stop your hearts, but you persevere! The avatar shatters into a million frozen shards!',
        effects: [
          { type: 'damage', target: 'all', value: 340 },
          { type: 'xp', value: 1200 },
          { type: 'gold', value: 2000 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythicc', rarityBoost: 22 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'mythicc', rarityBoost: 15 },
        ],
      },
    },
    {
      text: 'Summon inner fire (Paladin bonus)',
      requirements: { class: 'Paladin' },
      outcome: {
        text: 'Your divine radiance blazes like the sun itself! The avatar melts before your righteous fury!',
        effects: [
          { type: 'damage', target: 'all', value: 240 },
          { type: 'heal', target: 'all', value: 50 },
          { type: 'xp', value: 1400 },
          { type: 'gold', value: 2200 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', maxRarity: 'artifact', rarityBoost: 30 },
        ],
      },
    },
    {
      text: 'Strike before frozen solid',
      outcome: {
        text: 'You rush forward in a desperate gambit! Your weapons find their mark just as the cold threatens to claim you!',
        effects: [
          { type: 'damage', target: 'all', value: 300 },
          { type: 'xp', value: 1300 },
          { type: 'gold', value: 2100 },
          { type: 'item', itemType: 'weapon', minRarity: 'mythic', maxRarity: 'mythicc', rarityBoost: 25 },
          { type: 'item', itemType: 'armor', minRarity: 'mythic', maxRarity: 'mythicc', rarityBoost: 25 },
        ],
      },
    },
  ],
}

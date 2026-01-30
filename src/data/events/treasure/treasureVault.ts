import type { DungeonEvent } from '@/types'
import { GiTwoCoins } from 'react-icons/gi'

export const TREASURE_VAULT: DungeonEvent = {
  id: 'treasure-vault',
  type: 'treasure',
  title: 'Ancient Treasure Vault',
  description: 'A sealed vault stands before you. The lock is complex but promising.',
  choices: [
    {
      text: 'Pick the lock expertly (Rogue)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'Your expertise pays off! The vault contains exceptional treasures!',
        effects: [
          { type: 'gold', value: 300 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'rare', // Guaranteed at least rare
            rarityBoost: 15 // Treat as if 15 floors deeper
          },
          { type: 'xp', value: 100 },
        ],
      },
    },
    {
      text: 'Break it open (Luck check)',
      successChance: 0.4,
      statModifier: 'luck',
      successOutcome: {
        text: 'Lucky! The vault breaks open without damaging the contents!',
        effects: [
          { type: 'gold', value: 250 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'uncommon',
            maxRarity: 'legendary',
            rarityBoost: 10
          },
        ],
      },
      failureOutcome: {
        text: 'You break it open but damage some of the treasure.',
        effects: [
          { type: 'gold', value: 150 },
          { 
            type: 'item', 
            itemType: 'random',
            maxRarity: 'rare' // Limited by damage
          },
        ],
      },
    },
    {
      text: 'Study the lock carefully (takes time)',
      outcome: {
        text: 'You eventually open it safely but some treasures have decayed.',
        effects: [
          { type: 'gold', value: 200 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'common',
            maxRarity: 'epic'
          },
          { type: 'xp', value: 60 },
        ],
      },
    },
    {
      text: 'Leave it (too risky)',
      outcome: {
        text: 'Better safe than sorry.',
        effects: [],
      },
    },
  ],
  depth: 6,
  icon: GiTwoCoins,
}

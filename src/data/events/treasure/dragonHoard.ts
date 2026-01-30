import type { DungeonEvent } from '@/types'
import { GiGoldBar } from 'react-icons/gi'

export const DRAGON_HOARD: DungeonEvent = {
  id: 'dragon-hoard',
  type: 'treasure',
  title: 'Dragon\'s Sleeping Hoard',
  description: 'A dragon sleeps atop a massive pile of treasure. Stealing from it is incredibly dangerous.',
  choices: [
    {
      text: 'Steal carefully (Speed check)',
      successChance: 0.35,
      statModifier: 'speed',
      successOutcome: {
        text: 'Your nimble hands secure legendary treasure without waking the beast!',
        effects: [
          { type: 'gold', value: 500 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'epic', // Dragon hoards are valuable
            rarityBoost: 20 // Best quality items
          },
          { type: 'xp', value: 200 },
        ],
      },
      failureOutcome: {
        text: 'The dragon wakes! You grab what you can and run!',
        effects: [
          { type: 'damage', target: 'all', value: 60 },
          { type: 'gold', value: 150 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'uncommon',
            maxRarity: 'rare'
          },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Take just one item (safer)',
      possibleOutcomes: [
        {
          weight: 70,
          outcome: {
            text: 'You grab a single treasure and escape undetected.',
            effects: [
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'rare',
                rarityBoost: 10
              },
              { type: 'xp', value: 100 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'Even that small movement wakes the dragon!',
            effects: [
              { type: 'damage', target: 'all', value: 50 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'uncommon'
              },
              { type: 'xp', value: 80 },
            ],
          },
        },
      ],
    },
    {
      text: 'Challenge the dragon',
      outcome: {
        text: 'The dragon wakes and fights! You barely survive but claim the hoard.',
        effects: [
          { type: 'damage', target: 'all', value: 80 },
          { type: 'gold', value: 600 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'legendary', // If you survive, legendary reward
            rarityBoost: 25
          },
          { type: 'xp', value: 300 },
        ],
      },
    },
    {
      text: 'Don\'t risk it',
      outcome: {
        text: 'Wisdom prevails. You leave the sleeping dragon alone.',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
    },
  ],
  depth: 15,
  icon: GiGoldBar,
}

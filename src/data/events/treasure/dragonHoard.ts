import type { DungeonEvent } from '@/types'
import { GiDrakkarDragon, GiGoldBar } from 'react-icons/gi'

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
      possibleOutcomes: [
        {
          weight: 92,
          outcome: {
            text: 'Your nimble hands secure legendary treasure without waking the beast!',
            effects: [
              { type: 'gold', value: 500 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'epic',
                rarityBoost: 20
              },
              { type: 'xp', value: 200 },
            ],
          },
        },
        {
          weight: 8,
          outcome: {
            text: 'Your nimble hands secure legendary treasure without waking the beast! You also find an ancient relic imbued with draconic power!',
            effects: [
              { type: 'gold', value: 500 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'random', minRarity: 'epic', rarityBoost: 20 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
              { type: 'xp', value: 200 },
            ],
          },
        },
      ],
      failureOutcome: {
        text: 'The dragon wakes! You grab what you can and run!',
        effects: [
          { type: 'damage', target: 'all', value: 60 },
          { type: 'gold', value: 150 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'uncommon'
          },
          { type: 'xp', value: 80 },
        ],
      },
    },
    {
      text: 'Take just one item (safer)',
      possibleOutcomes: [
        {
          weight: 65,
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
          weight: 5,
          outcome: {
            text: 'You grab a treasure forged by dragonfire and escape undetected!',
            effects: [
              { type: 'item', setId: 'draconic' },
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
      possibleOutcomes: [
        {
          weight: 90,
          outcome: {
            text: 'The dragon wakes and fights! You barely survive but claim the hoard.',
            effects: [
              { type: 'damage', target: 'all', value: 80 },
              { type: 'gold', value: 600 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'legendary',
                rarityBoost: 25
              },
              { type: 'xp', value: 300 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'The dragon wakes and fights! You barely survive but claim the hoard. Among the treasures, you find something forged by dragonfire itself!',
            effects: [
              { type: 'damage', target: 'all', value: 80 },
              { type: 'gold', value: 600 },
              { 
                type: 'item', 
                itemChoices: [
                  { weight: 80, itemType: 'random', minRarity: 'legendary', rarityBoost: 25 },
                  { weight: 20, setId: 'draconic' }
                ]
              },
              { type: 'xp', value: 300 },
            ],
          },
        },
      ],
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
  icon: GiDrakkarDragon,
}

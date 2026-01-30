import type { DungeonEvent } from '@/types'
import { GiBridge } from 'react-icons/gi'

export const RICKETY_BRIDGE: DungeonEvent = {
  id: 'rickety-bridge',
  type: 'choice',
  title: 'Rickety Bridge',
  description: 'A rope bridge spans a deep chasm. It looks unstable but crossable.',
  choices: [
    {
      text: 'Cross carefully (Speed check)',
      // Success/Failure with stat modifier
      successChance: 0.4, // 40% base chance
      statModifier: 'speed', // Each point of speed adds 0.2% success chance
      successOutcome: {
        text: 'Your party crosses the bridge safely with nimble footwork!',
        effects: [
          { type: 'xp', value: 50 },
        ],
      },
      failureOutcome: {
        text: 'The bridge collapses! Your party falls but survives the drop.',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
        ],
      },
    },
    {
      text: 'Cut the ropes (unpredictable)',
      // Multiple weighted outcomes
      possibleOutcomes: [
        {
          weight: 30,
          outcome: {
            text: 'The bridge falls perfectly, revealing a hidden treasure below!',
            effects: [
              { type: 'gold', value: 200 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'uncommon',
                rarityBoost: 8
              },
            ],
          },
        },
        {
          weight: 50,
          outcome: {
            text: 'The bridge crashes down. Nothing of value below.',
            effects: [
              { type: 'xp', value: 20 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'The bridge collapses on your party!',
            effects: [
              { type: 'damage', target: 'all', value: 40 },
            ],
          },
        },
      ],
    },
    {
      text: 'Find another way (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'Your Ranger spots a safer path around the chasm.',
        effects: [
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Go back',
      outcome: {
        text: 'You decide the risk isn\'t worth it.',
        effects: [],
      },
    },
  ],
  depth: 3,
  icon: GiBridge,
}

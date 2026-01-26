import type { DungeonEvent } from '@/types'

export const MYSTERIOUS_CHEST: DungeonEvent = {
  id: 'mysterious-chest',
  type: 'treasure',
  title: 'Mysterious Chest',
  description: 'A chest sits in the middle of the room. It could contain treasure... or danger.',
  choices: [
    {
      text: 'Open it carefully (Luck check)',
      successChance: 0.5, // 50% base
      statModifier: 'luck',
      successOutcome: {
        text: 'Your caution pays off! The chest contains valuables and no traps.',
        effects: [
          { type: 'gold', value: 150 },
          { 
            type: 'item', 
            itemType: 'random',
            minRarity: 'uncommon',
            maxRarity: 'rare',
            rarityBoost: 5
          },
        ],
      },
      failureOutcome: {
        text: 'A poison dart shoots out as you open it!',
        effects: [
          { type: 'damage', target: 'random', value: 35 },
          { type: 'gold', value: 50 },
        ],
      },
    },
    {
      text: 'Smash it open',
      possibleOutcomes: [
        {
          weight: 25,
          outcome: {
            text: 'You smash the chest revealing a mimic! It fights back!',
            effects: [
              { type: 'damage', target: 'all', value: 45 },
              { type: 'gold', value: 80 },
            ],
          },
        },
        {
          weight: 40,
          outcome: {
            text: 'The chest breaks open, but you damage some of the contents.',
            effects: [
              { type: 'gold', value: 75 },
            ],
          },
        },
        {
          weight: 35,
          outcome: {
            text: 'You smash it perfectly! Gold and items spill out.',
            effects: [
              { type: 'gold', value: 120 },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'common',
                maxRarity: 'rare'
              },
            ],
          },
        },
      ],
    },
    {
      text: 'Pick the lock (Rogue)',
      requirements: {
        class: 'rogue',
      },
      possibleOutcomes: [
        {
          weight: 65,
          outcome: {
            text: 'Your nimble fingers pick the lock expertly!',
            effects: [
              { type: 'gold', value: 180 },
              { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'rare', rarityBoost: 10 },
              { type: 'xp', value: 60 },
            ],
          },
        },
        {
          weight: 25,
          outcome: {
            text: 'Your Rogue senses danger - this is a mimic! You back away cautiously.',
            effects: [
              { type: 'xp', value: 90 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'Mimic detected! Your Rogue calls for backup and together you slay it!',
            effects: [
              { type: 'damage', target: 'random', value: 15 },
              { type: 'gold', value: 150 },
              { type: 'xp', value: 120 },
            ],
          },
        },
      ],
    },
    {
      text: 'Leave it alone',
      outcome: {
        text: 'Better safe than sorry.',
        effects: [],
      },
    },
  ],
  depth: 4,
}

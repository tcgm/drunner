import type { DungeonEvent } from '@/types'

export const ANCIENT_CHEST: DungeonEvent = {
  id: 'ancient-chest',
  type: 'treasure',
  title: 'Ancient Chest',
  description: 'You discover an ornate chest covered in strange runes.',
  choices: [
    {
      text: 'Force it open',
      possibleOutcomes: [
        {
          weight: 75,
          outcome: {
            text: 'The chest opens with a loud crack!',
            effects: [
              { type: 'gold', value: 100 },
              { type: 'damage', target: 'random', value: 10 },
              { type: 'item', itemType: 'random', minRarity: 'common', maxRarity: 'uncommon' }, // Forcing damages items
            ],
          },
        },
        {
          weight: 25,
          outcome: {
            text: 'It was a mimic! It snaps at you as you force it open!',
            effects: [
              { type: 'damage', target: 'random', value: 35 },
              { type: 'gold', value: 60 },
            ],
          },
        },
      ],
    },
    {
      text: 'Pick the lock carefully (requires Rogue)',
      requirements: {
        class: 'rogue',
      },
      possibleOutcomes: [
        {
          weight: 70,
          outcome: {
            text: 'The lock clicks open smoothly!',
            effects: [
              { type: 'gold', value: 150 },
              { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'Your trained eye spots the mimic before it attacks! You steer the party away safely.',
            effects: [
              { type: 'xp', value: 80 },
            ],
          },
        },
        {
          weight: 10,
          outcome: {
            text: 'You detect the mimic and alert the party! Your warriors strike it down before it can react!',
            effects: [
              { type: 'gold', value: 120 },
              { type: 'xp', value: 100 },
            ],
          },
        },
      ],
    },
    {
      text: 'Kick it aggressively',
      possibleOutcomes: [
        {
          weight: 30,
          outcome: {
            text: 'The lock breaks cleanly! The chest opens.',
            effects: [
              { type: 'gold', value: 120 },
              { type: 'item', itemType: 'random', minRarity: 'common', maxRarity: 'uncommon' }, // Kicking damages items
            ],
          },
        },
        {
          weight: 40,
          outcome: {
            text: 'You break the chest open, damaging some contents.',
            effects: [
              { type: 'gold', value: 60 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'It was a mimic! It bites you!',
            effects: [
              { type: 'damage', target: 'random', value: 30 },
              { type: 'gold', value: 40 },
            ],
          },
        },
      ],
    },
    {
      text: 'Leave it alone',
      outcome: {
        text: 'You decide it\'s not worth the risk.',
        effects: [],
      },
    },
  ],
  depth: 2,
}

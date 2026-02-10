import type { DungeonEvent } from '@/types'
import { GiRuneStone } from 'react-icons/gi'

export const ANCIENT_RUNE: DungeonEvent = {
  id: 'ancient-rune',
  type: 'choice',
  title: 'Ancient Rune Circle',
  description: 'A glowing rune circle pulses with arcane energy. Its power could be harnessed... or unleashed.',
  choices: [
    {
      text: 'Channel the magic carefully (Attack check)',
      successChance: 0.35,
      statModifier: 'attack',
      successOutcome: {
        text: 'Your combat prowess helps you control the raw energy! The rune empowers your party.',
        effects: [
          { type: 'heal', target: 'all', value: 40 },
          { type: 'xp', value: 80 },
        ],
      },
      failureOutcome: {
        text: 'The energy is too wild! It lashes out at your party.',
        effects: [
          { type: 'damage', target: 'all', value: 35 },
          { type: 'xp', value: 30 },
        ],
      },
    },
    {
      text: 'Absorb the power (Defense check)',
      successChance: 0.4,
      statModifier: 'defense',
      successOutcome: {
        text: 'Your fortitude allows you to safely absorb the rune\'s essence!',
        effects: [
          { type: 'xp', value: 120 },
          { type: 'gold', value: 100 },
        ],
      },
      failureOutcome: {
        text: 'The power overwhelms your defenses!',
        effects: [
          { type: 'damage', target: 'all', value: 45 },
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Touch the rune (pure chance)',
      possibleOutcomes: [
        {
          weight: 20,
          outcome: {
            text: 'The rune grants you a divine blessing and powerful artifact!',
            effects: [
              { type: 'heal', target: 'all', fullHeal: true },
              { 
                type: 'item', 
                itemType: 'random',
                minRarity: 'epic',
                rarityBoost: 15
              },
              { type: 'xp', value: 150 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'The rune crackles with energy, healing your wounds!',
            effects: [
              { type: 'heal', target: 'all', value: 60 },
              { type: 'xp', value: 50 },
            ],
          },
        },
        {
          weight: 30,
          outcome: {
            text: 'The rune fizzles and fades away.',
            effects: [
              { type: 'xp', value: 20 },
            ],
          },
        },
        {
          weight: 20,
          outcome: {
            text: 'The rune explodes violently!',
            effects: [
              { type: 'damage', target: 'all', value: 50 },
            ],
          },
        },
      ],
    },
    {
      text: 'Study it from a safe distance',
      outcome: {
        text: 'You learn about the rune\'s properties without risking harm.',
        effects: [
          { type: 'xp', value: 40 },
        ],
      },
    },
    {
      text: 'Destroy the rune',
      outcome: {
        text: 'The rune shatters, releasing a wave of chaotic energy!',
        effects: [
          { type: 'damage', target: 'all', value: 30 },
          { type: 'gold', value: 80 },
          { type: 'xp', value: 30 },
        ],
      },
    },
  ],
  depth: 5, icon: GiRuneStone,
}

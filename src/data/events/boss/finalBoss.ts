import type { DungeonEvent } from '@/types'
import { GiDragonHead } from 'react-icons/gi'

export const FINAL_BOSS: DungeonEvent = {
  id: 'final-boss',
  type: 'boss',
  title: 'The Dungeon Lord',
  isFinalBoss: true, // Only appears at Floor 100
  description: 'An ancient entity of unfathomable power stands before you. This is the dungeon\'s final defense - the master of all you\'ve faced. The very walls tremble with its dark presence.',
  choices: [
    {
      text: 'Attack with everything you have',
      outcome: {
        text: 'You unleash your full power in a desperate assault! The battle shakes the foundations of the dungeon itself!',
        effects: [
          { type: 'damage', target: 'all', value: 80 },
          { type: 'xp', value: 1000 },
          { type: 'gold', value: 1500 },
        ],
      },
    },
    {
      text: 'Strike at its core (High Attack required)',
      requirements: {
        stat: 'attack',
        value: 30,
      },
      outcome: {
        text: 'Your devastating blow pierces through its defenses and shatters its core! Victory is yours!',
        effects: [
          { type: 'damage', target: 'all', value: 60 },
          { type: 'xp', value: 1200 },
          { type: 'gold', value: 2000 },
        ],
      },
    },
    {
      text: 'Unravel its magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You weave counter-spells of incredible complexity, unmaking the entity\'s magical essence!',
        effects: [
          { type: 'damage', target: 'all', value: 55 },
          { type: 'xp', value: 1250 },
          { type: 'gold', value: 1800 },
        ],
      },
    },
    {
      text: 'Channel divine wrath (Cleric/Paladin bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Holy light floods the chamber as you call upon divine power to smite this evil!',
        effects: [
          { type: 'damage', target: 'all', value: 50 },
          { type: 'xp', value: 1300 },
          { type: 'gold', value: 1900 },
        ],
      },
    },
    {
      text: 'Find the perfect opening (Ranger/Rogue bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'Your patience pays off - you spot and exploit a critical weakness!',
        effects: [
          { type: 'damage', target: 'all', value: 58 },
          { type: 'xp', value: 1150 },
          { type: 'gold', value: 1750 },
        ],
      },
    },
  ],
  depth: 100,
  icon: GiDragonHead,
}

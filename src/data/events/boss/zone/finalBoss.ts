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
          { type: 'damage', target: 'all', value: 2000 },
          { type: 'xp', value: 5000 },
          { type: 'gold', value: 10000 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 50 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 50 },
          { type: 'item', itemType: 'random', minRarity: 'void', maxRarity: 'elder', rarityBoost: 40 },
        ],
      },
    },
    {
      text: 'Strike at its core (High Attack required)',
      requirements: {
        stat: 'attack',
        minValue: 30,
      },
      outcome: {
        text: 'Your devastating blow pierces through its defenses and shatters its core! Victory is yours!',
        effects: [
          { type: 'damage', target: 'all', value: 1500 },
          { type: 'xp', value: 6000 },
          { type: 'gold', value: 12000 },
          { type: 'item', itemType: 'weapon', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 60 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 55 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 55 },
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
          { type: 'damage', target: 'all', value: 1375 },
          { type: 'xp', value: 6500 },
          { type: 'gold', value: 13000 },
          { type: 'item', itemType: 'weapon', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 65 },
          { type: 'item', itemType: 'armor', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 60 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 55 },
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
          { type: 'damage', target: 'all', value: 1250 },
          { type: 'xp', value: 7000 },
          { type: 'gold', value: 14000 },
          { type: 'item', itemType: 'armor', minRarity: 'layer', maxRarity: 'author', rarityBoost: 70 },
          { type: 'item', itemType: 'weapon', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 65 },
          { type: 'item', itemType: 'accessory1', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 60 },
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
          { type: 'damage', target: 'all', value: 1450 },
          { type: 'xp', value: 6200 },
          { type: 'gold', value: 12500 },
          { type: 'item', itemType: 'weapon', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 62 },
          { type: 'item', itemType: 'accessory1', minRarity: 'layer', maxRarity: 'plane', rarityBoost: 58 },
          { type: 'item', itemType: 'random', minRarity: 'elder', maxRarity: 'layer', rarityBoost: 55 },
        ],
      },
    },
  ],
  depth: 100,
  icon: GiDragonHead,
}

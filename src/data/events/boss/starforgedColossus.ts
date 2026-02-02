import type { DungeonEvent } from '@/types'
import { GiMetalGolem } from 'react-icons/gi'

export const STARFORGED_COLOSSUS: DungeonEvent = {
  id: 'starforged-colossus',
  type: 'boss',
  title: 'Starforged Colossus',
  description: 'A towering construct forged from fallen stars. Its body radiates intense heat and light. This ancient war machine was built by a civilization long extinct, and it still carries out its final orders.',
  choices: [
    {
      text: 'Withstand its assault',
      outcome: {
        text: 'You endure blast after blast of stellar energy, slowly wearing down its power core!',
        effects: [
          { type: 'damage', target: 'all', value: 360 },
          { type: 'xp', value: 1400 },
          { type: 'gold', value: 2100 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
    {
      text: 'Overload its core (High Speed)',
      requirements: {
        stat: 'speed',
        minValue: 85,
      },
      outcome: {
        text: 'You move faster than its targeting systems! You reach the core and overload it from within!',
        effects: [
          { type: 'damage', target: 'all', value: 270 },
          { type: 'xp', value: 1650 },
          { type: 'gold', value: 2400 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 35 },
        ],
      },
    },
    {
      text: 'Tank the damage (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'You stand firm against its stellar fury, your armor glowing red-hot but holding! Eventually it exhausts its power!',
        effects: [
          { type: 'damage', target: 'strongest', value: 300 },
          { type: 'heal', target: 'strongest', value: 80 },
          { type: 'xp', value: 1550 },
          { type: 'gold', value: 2250 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 32 },
        ],
      },
    },
  ],
  depth: 55,
  icon: GiMetalGolem,
}

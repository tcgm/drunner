import type { DungeonEvent } from '@/types'
import { GiThorHammer } from 'react-icons/gi'

export const TITAN_FORGEMASTER: DungeonEvent = {
  id: 'titan-forgemaster',
  type: 'boss',
  title: 'Titan Forgemaster',
  description: 'A giant who shapes reality with hammer and anvil. Each swing of their cosmic hammer reshapes the battlefield.',
  choices: [
    {
      text: 'Weather the blows',
      outcome: {
        text: 'Each hammer strike levels mountains! The shockwaves devastate you!',
        effects: [
          { type: 'damage', target: 'all', value: 330 },
          { type: 'xp', value: 1220 },
          { type: 'gold', value: 1830 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Shatter the hammer (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 55,
      },
      outcome: {
        text: 'You destroy their weapon! Without the hammer, the titan falls!',
        effects: [
          { type: 'damage', target: 'random', value: 275 },
          { type: 'xp', value: 1360 },
          { type: 'gold', value: 2040 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Forge a truce (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'The titan respects strength! They forge you a gift and let you pass!',
        effects: [
          { type: 'damage', target: 'all', value: 180 },
          { type: 'xp', value: 1400 },
          { type: 'gold', value: 2100 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
  ],
  depth: 47,
  icon: GiThorHammer,
}

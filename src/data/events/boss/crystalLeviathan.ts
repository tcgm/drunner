import type { DungeonEvent } from '@/types'
import { GiMineralHeart } from 'react-icons/gi'

export const CRYSTAL_LEVIATHAN: DungeonEvent = {
  id: 'crystal-leviathan',
  type: 'boss',
  title: 'Crystal Leviathan',
  description: 'A colossal serpent made of living diamond. Light refracts through its body into devastating prismatic beams.',
  choices: [
    {
      text: 'Face the beams',
      outcome: {
        text: 'Rainbows of death! Each color burns differently!',
        effects: [
          { type: 'damage', target: 'random', value: 475 },
          { type: 'xp', value: 1940 },
          { type: 'gold', value: 2910 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Shatter the crystal (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 71,
      },
      outcome: {
        text: 'You strike the weak point! The leviathan shatters into a thousand shards!',
        effects: [
          { type: 'damage', target: 'strongest', value: 412 },
          { type: 'xp', value: 2070 },
          { type: 'gold', value: 3105 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 51 },
        ],
      },
    },
    {
      text: 'Bend the light (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You redirect the beams! The leviathan is destroyed by its own light!',
        effects: [
          { type: 'damage', target: 'all', value: 425 },
          { type: 'xp', value: 2095 },
          { type: 'gold', value: 3143 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 52 },
        ],
      },
    },
  ],
  depth: 69,
  icon: GiMineralHeart,
}

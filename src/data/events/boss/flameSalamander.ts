import type { DungeonEvent } from '@/types'
import { GiFireBreath } from 'react-icons/gi'

export const FLAME_SALAMANDER: DungeonEvent = {
  id: 'flame-salamander',
  type: 'boss',
  title: 'Flame Salamander',
  description: 'A serpentine creature of living fire slithers from a pool of lava. The heat is almost unbearable as it coils around the chamber.',
  choices: [
    {
      text: 'Withstand the heat',
      outcome: {
        text: 'You push through the scorching flames, but the burns are severe!',
        effects: [
          { type: 'damage', target: 'all', value: 65 },
          { type: 'xp', value: 320 },
          { type: 'gold', value: 420 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', maxRarity: 'epic', rarityBoost: 14 },
        ],
      },
    },
    {
      text: 'Douse with water magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Steam explodes as you extinguish the salamander! It solidifies and shatters!',
        effects: [
          { type: 'damage', target: 'all', value: 48 },
          { type: 'xp', value: 365 },
          { type: 'gold', value: 475 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Strike its core (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 18,
      },
      outcome: {
        text: 'You pierce through the flames to strike its heart! The fire dims and dies!',
        effects: [
          { type: 'damage', target: 'strongest', value: 52 },
          { type: 'xp', value: 355 },
          { type: 'gold', value: 465 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 17 },
        ],
      },
    },
  ],
  depth: 14,
  icon: GiFireBreath,
}

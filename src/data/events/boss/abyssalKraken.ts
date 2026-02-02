import type { DungeonEvent } from '@/types'
import { GiOctopus } from 'react-icons/gi'

export const ABYSSAL_KRAKEN: DungeonEvent = {
  id: 'abyssal-kraken',
  type: 'boss',
  title: 'Abyssal Kraken',
  description: 'A monstrous creature from the deepest trenches, its tentacles writhe with ancient power. Water floods the chamber as it emerges, bringing the crushing pressure of the abyss with it.',
  choices: [
    {
      text: 'Hack at the tentacles',
      outcome: {
        text: 'You slash through tentacle after tentacle, but each severed limb regenerates rapidly!',
        effects: [
          { type: 'damage', target: 'all', value: 200 },
          { type: 'xp', value: 600 },
          { type: 'gold', value: 850 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Target the head (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 55,
      },
      outcome: {
        text: 'You break through the tentacles and strike at its vulnerable head! The kraken thrashes wildly before going still!',
        effects: [
          { type: 'damage', target: 'all', value: 150 },
          { type: 'xp', value: 750 },
          { type: 'gold', value: 1000 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Use water magic against it (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You turn the water against the kraken, creating crushing pressure that implodes the beast!',
        effects: [
          { type: 'damage', target: 'all', value: 125 },
          { type: 'xp', value: 800 },
          { type: 'gold', value: 1100 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 24 },
        ],
      },
    },
    {
      text: 'Try to escape',
      outcome: {
        text: 'The kraken\'s tentacles wrap around you, squeezing with bone-crushing force!',
        effects: [
          { type: 'damage', target: 'random', value: 175 },
          { type: 'xp', value: 150 },
        ],
      },
    },
  ],
  depth: 35,
  icon: GiOctopus,
}

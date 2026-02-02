import type { DungeonEvent } from '@/types'
import { GiSpikedTentacle } from 'react-icons/gi'

export const KRAKEN_SPAWN: DungeonEvent = {
  id: 'kraken-spawn',
  type: 'boss',
  title: 'Kraken Spawn',
  description: 'A young kraken fills the flooded chamber with writhing tentacles. Though not fully grown, it\'s still a formidable predator of the deep.',
  choices: [
    {
      text: 'Hack at tentacles',
      outcome: {
        text: 'Tentacles regenerate as fast as you cut them! You\'re grabbed and crushed!',
        effects: [
          { type: 'damage', target: 'all', value: 126 },
          { type: 'xp', value: 472 },
          { type: 'gold', value: 622 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 18 },
        ],
      },
    },
    {
      text: 'Target the beak (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 28,
      },
      outcome: {
        text: 'You push through the tentacles and destroy its vulnerable beak!',
        effects: [
          { type: 'damage', target: 'strongest', value: 90 },
          { type: 'xp', value: 520 },
          { type: 'gold', value: 680 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Control the water (Druid bonus)',
      requirements: {
        class: 'Druid',
      },
      outcome: {
        text: 'You drain the chamber! The kraken suffocates without water!',
        effects: [
          { type: 'damage', target: 'all', value: 82 },
          { type: 'xp', value: 522 },
          { type: 'gold', value: 687 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 21 },
        ],
      },
    },
  ],
  depth: 24,
  icon: GiSpikedTentacle,
}

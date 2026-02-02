import type { DungeonEvent } from '@/types'
import { GiAngelOutfit } from 'react-icons/gi'

export const FALLEN_SERAPH: DungeonEvent = {
  id: 'fallen-seraph',
  type: 'boss',
  title: 'Fallen Seraph',
  description: 'A celestial who chose darkness. It wields corrupted holy power - burning light twisted into painful shadow.',
  choices: [
    {
      text: 'Endure corrupted light',
      outcome: {
        text: 'Holy power hurts more when corrupted! Shadow-fire burns your soul!',
        effects: [
          { type: 'damage', target: 'all', value: 415 },
          { type: 'xp', value: 1660 },
          { type: 'gold', value: 2490 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Redeem the fallen (Cleric bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'Your purity reminds them of what they lost! They thank you for release!',
        effects: [
          { type: 'damage', target: 'all', value: 345 },
          { type: 'xp', value: 1775 },
          { type: 'gold', value: 2663 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 41 },
        ],
      },
    },
    {
      text: 'Overwhelm with virtue (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 68,
      },
      outcome: {
        text: 'Your goodness is a weapon against corruption! The seraph is purified!',
        effects: [
          { type: 'damage', target: 'random', value: 358 },
          { type: 'xp', value: 1800 },
          { type: 'gold', value: 2700 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 42 },
        ],
      },
    },
  ],
  depth: 60,
  icon: GiAngelOutfit,
}

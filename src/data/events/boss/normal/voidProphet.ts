import type { DungeonEvent } from '@/types'
import { GiCrystalEye } from 'react-icons/gi'

export const VOID_PROPHET: DungeonEvent = {
  id: 'void-prophet',
  type: 'boss',
  title: 'Void Prophet',
  description: 'A being that has gazed too long into the void. It speaks truths that shatter minds and predicts your every move.',
  choices: [
    {
      text: 'Resist the prophecies',
      outcome: {
        text: 'Every action predicted! The prophecy becomes self-fulfilling!',
        effects: [
          { type: 'damage', target: 'random', value: 395 },
          { type: 'xp', value: 1610 },
          { type: 'gold', value: 2415 },
          { type: 'item', itemType: 'random', minRarity: 'epic', rarityBoost: 31 },
        ],
      },
    },
    {
      text: 'Act on pure instinct (Warrior bonus)',
      requirements: {
        class: 'Warrior',
      },
      outcome: {
        text: 'No thought, only action! Prophecy cannot predict mindless fury!',
        effects: [
          { type: 'damage', target: 'strongest', value: 318 },
          { type: 'xp', value: 1730 },
          { type: 'gold', value: 2595 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', rarityBoost: 39 },
        ],
      },
    },
    {
      text: 'Create your own fate (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 65,
      },
      outcome: {
        text: 'Your will surpasses prophecy! The prophet cannot foresee free will!',
        effects: [
          { type: 'damage', target: 'all', value: 332 },
          { type: 'xp', value: 1755 },
          { type: 'gold', value: 2633 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', rarityBoost: 40 },
        ],
      },
    },
  ],
  depth: 56,
  icon: GiCrystalEye,
}

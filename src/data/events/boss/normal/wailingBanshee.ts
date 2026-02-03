import type { DungeonEvent } from '@/types'
import { GiGhost } from 'react-icons/gi'

export const WAILING_BANSHEE: DungeonEvent = {
  id: 'wailing-banshee',
  type: 'boss',
  title: 'Wailing Banshee',
  description: 'A ghostly woman in tattered robes floats before you. Her sorrowful face twists in rage as she opens her mouth to unleash her deadly scream.',
  choices: [
    {
      text: 'Endure the wail',
      outcome: {
        text: 'The banshee\'s scream pierces your soul! The psychic damage is excruciating!',
        effects: [
          { type: 'damage', target: 'all', value: 72 },
          { type: 'xp', value: 312 },
          { type: 'gold', value: 412 },
          { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 13 },
        ],
      },
    },
    {
      text: 'Counter with song (Bard bonus)',
      requirements: {
        class: 'Bard',
      },
      outcome: {
        text: 'Your melody soothes her torment! She fades away in peace!',
        effects: [
          { type: 'damage', target: 'all', value: 44 },
          { type: 'xp', value: 365 },
          { type: 'gold', value: 475 },
          { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 17 },
        ],
      },
    },
    {
      text: 'Block your ears (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 16,
      },
      outcome: {
        text: 'You protect yourself from the wail! Unable to harm you, she dissipates!',
        effects: [
          { type: 'damage', target: 'weakest', value: 50 },
          { type: 'xp', value: 355 },
          { type: 'gold', value: 465 },
          { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 16 },
        ],
      },
    },
  ],
  depth: 12,
  icon: GiGhost,
}

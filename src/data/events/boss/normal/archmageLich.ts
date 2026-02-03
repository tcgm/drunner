import type { DungeonEvent } from '@/types'
import { GiCrystalWand } from 'react-icons/gi'

export const ARCHMAGE_LICH: DungeonEvent = {
  id: 'archmage-lich',
  type: 'boss',
  title: 'Archmage Lich',
  description: 'An ancient spellcaster who chose undeath over mortality. Reality warps around their skeletal form as they weave devastating magic.',
  choices: [
    {
      text: 'Endure the spells',
      outcome: {
        text: 'Arcane energies of unimaginable power strike you! Reality itself bends to harm you!',
        effects: [
          { type: 'damage', target: 'all', value: 188 },
          { type: 'xp', value: 725 },
          { type: 'gold', value: 1050 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Counter with magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You match spell for spell! In the end, your living magic overpowers undead sorcery!',
        effects: [
          { type: 'damage', target: 'all', value: 145 },
          { type: 'xp', value: 795 },
          { type: 'gold', value: 1135 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Destroy phylactery (High Wisdom)',
      requirements: {
        stat: 'defense',
        minValue: 38,
      },
      outcome: {
        text: 'You locate and destroy their soul vessel! The lich crumbles to dust!',
        effects: [
          { type: 'damage', target: 'random', value: 158 },
          { type: 'xp', value: 815 },
          { type: 'gold', value: 1165 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 37,
  icon: GiCrystalWand,
}

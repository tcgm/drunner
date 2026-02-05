import type { DungeonEvent } from '@/types'
import { GiAnvil } from 'react-icons/gi'

export const WEAPON_SMITH: DungeonEvent = {
  id: 'weapon-smith',
  type: 'merchant',
  title: 'Dungeon Weaponsmith',
  description: 'A skilled smith offers to upgrade your weapons or repair your armor.',
  choices: [
    {
      text: 'Reforge with better material',
      requirements: {
        gold: 100,
      },
      outcome: {
        text: 'The smith reforges your weakest equipment with superior materials!',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'xp', value: 30 },
          { type: 'upgradeItem', upgradeType: 'material' },
        ],
      },
    },
    {
      text: 'Enchant equipment',
      requirements: {
        gold: 150,
      },
      outcome: {
        text: 'The smith imbues your weakest equipment with powerful magic!',
        effects: [
          { type: 'gold', value: -150 },
          { type: 'xp', value: 50 },
          { type: 'upgradeItem', upgradeType: 'rarity', rarityBoost: 5 },
        ],
      },
    },
    {
      text: 'Repair armor',
      requirements: {
        gold: 80,
      },
      outcome: {
        text: 'Your armor is restored to peak condition!',
        effects: [
          { type: 'gold', value: -80 },
          { type: 'heal', target: 'all', value: 30 },
          { type: 'item', itemType: 'armor', minRarity: 'common' }, // Repair, not new
        ],
      },
    },
    {
      text: 'Commission custom gear',
      requirements: {
        gold: 250,
      },
      outcome: {
        text: 'The smith crafts masterwork equipment!',
        effects: [
          { type: 'gold', value: -250 },
          { type: 'xp', value: 80 },
          { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 10 },
        ],
      },
    },
    {
      text: 'Just window shop',
      outcome: {
        text: 'You admire the craftsmanship but don\'t buy.',
        effects: [],
      },
    },
  ],
  depth: 3,
  icon: GiAnvil,
}

import type { DungeonEvent } from '@/types'
import { GiAnvil } from 'react-icons/gi'

export const WEAPON_SMITH: DungeonEvent = {
  id: 'weapon-smith',
  type: 'merchant',
  title: 'Dungeon Weaponsmith',
  description: 'A skilled smith offers to upgrade your weapons or repair your armor.',
  choices: [
    {
      text: 'Upgrade equipment',
      requirements: {
        gold: 120,
      },
      outcome: {
        text: 'The smith upgrades your weakest equipment to superior quality!',
        effects: [
          { type: 'gold', value: -120 },
          { type: 'xp', value: 40 },
          { type: 'upgradeItem', rarityBoost: 5 },
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
          { type: 'item', itemType: 'armor', minRarity: 'common', maxRarity: 'uncommon' }, // Repair, not new
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

import type { DungeonEvent } from '@/types'
import { GiLeatherArmor } from 'react-icons/gi'

export const DWARVEN_ARMOURER: DungeonEvent = {
  id: 'dwarven-armourer',
  type: 'merchant',
  title: 'Dwarven Armourer',
  description: 'A stout dwarf has set up a portable forge. He specialises exclusively in protective gear.',
  choices: [
    {
      text: 'Buy a piece of armor',
      requirements: { gold: 80 },
      outcome: {
        text: 'He fits you with solid dwarven-crafted protection.',
        effects: [
          { type: 'gold', value: -80 },
          { type: 'item', itemType: 'armor', minRarity: 'common' },
        ],
      },
    },
    {
      text: 'Commission reinforced armor (better quality)',
      requirements: { gold: 160 },
      outcome: {
        text: 'He spends extra time on the rivets. The result is impressive.',
        effects: [
          { type: 'gold', value: -160 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 8 },
        ],
      },
    },
    {
      text: 'Ask him to repair and upgrade your weakest gear',
      requirements: { gold: 100 },
      outcome: {
        text: '"Leave it with me." He hammers away and returns it much improved.',
        effects: [
          { type: 'gold', value: -100 },
          { type: 'upgradeItem', upgradeType: 'material' },
        ],
      },
    },
    {
      text: 'Admire his work and move on',
      outcome: {
        text: 'Fine craftsmanship, but your coin purse stays intact.',
        effects: [],
      },
    },
  ],
  depth: 3,
  icon: GiLeatherArmor,
}

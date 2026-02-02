import type { DungeonEvent } from '@/types'
import { GiHeartBottle } from 'react-icons/gi'

export const HEALING_FOUNTAIN: DungeonEvent = {
  id: 'healing-fountain',
  type: 'rest',
  title: 'Healing Fountain',
  description: 'A pristine fountain with crystal-clear water. It radiates restorative magic.',
  choices: [
    {
      text: 'Drink deeply',
      outcome: {
        text: 'The water restores your health and invigorates you!',
        effects: [
          { type: 'heal', target: 'all', value: 80 },
        ],
      },
    },
    {
      text: 'Fill waterskins (get healing items)',
      outcome: {
        text: 'You collect the magical water for later use.',
        effects: [
          { type: 'heal', target: 'all', value: 30 },
          { type: 'consumable', consumableId: 'health-small' },
          { type: 'consumable', consumableId: 'health-small' },
        ],
      },
    },
    {
      text: 'Study the magic (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You learn the secrets of the healing magic!',
        effects: [
          { type: 'heal', target: 'all', value: 60 },
          { type: 'xp', value: 50 },
        ],
      },
    },
    {
      text: 'Move on',
      outcome: {
        text: 'You decide not to drink.',
        effects: [],
      },
    },
  ],
  depth: 2,
  icon: GiHeartBottle,
}

import type { DungeonEvent } from '@/types'
import { GiWindsock } from 'react-icons/gi'

export const AIR_ELEMENTAL_LORD: DungeonEvent = {
  id: 'air-elemental-lord',
  type: 'boss',
  title: 'Air Elemental Lord',
  description: 'A massive vortex of sentient wind fills the chamber, as if torn from the heart of an eternal tempest. Lightning crackles through its form like the wrath of ancient skies. The howling winds carry whispers of a fury that has raged since before the world knew dawn. The very air remembers what came before. The Party must survive.',
  choices: [
    {
      text: 'Fight the Storm!',
      outcome: {
        text: 'Hurricane-force winds tear at your flesh as lightning strikes with the fury of ages! You feel the weight of a thousand storms bearing down upon you, an endless gale that existed before mountains rose and will rage long after they fall!',
        effects: [
          { type: 'damage', target: 'all', value: 118 },
          { type: 'xp', value: 460 },
          { type: 'gold', value: 610 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'epic', rarityBoost: 16 },
        ],
      },
    },
    {
      text: 'Disperse the winds (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'Your counter-magic scatters the elemental! It dissipates harmlessly!',
        effects: [
          { type: 'damage', target: 'all', value: 75 },
          { type: 'xp', value: 503 },
          { type: 'gold', value: 663 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 20 },
        ],
      },
    },
    {
      text: 'Anchor yourself (High Defense)',
      requirements: {
        stat: 'defense',
        minValue: 27,
      },
      outcome: {
        text: 'You stand firm against the gale! Unable to move you, it exhausts itself!',
        effects: [
          { type: 'damage', target: 'weakest', value: 84 },
          { type: 'xp', value: 498 },
          { type: 'gold', value: 658 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'epic', rarityBoost: 19 },
        ],
      },
    },
  ],
  depth: 22,
  icon: GiWindsock,
}

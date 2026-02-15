import type { DungeonEvent } from '@/types'
import { GiBoarEnsign } from 'react-icons/gi'

export const WILD_BOAR: DungeonEvent = {
  id: 'wild-boar-intro',
  type: 'boss',
  title: 'Wild Boar',
  description: 'An enraged boar paws at the ground, snorting angrily. Its tusks gleam dangerously in the dim light.',
  choices: [
    {
      text: 'Face the charge',
      outcome: {
        text: 'The boar charges! You stand your ground and fight back fiercely!',
        effects: [
          { type: 'damage', target: 'all', value: 19 },
          { type: 'xp', value: 130 },
          { type: 'gold', value: 160 },
          { type: 'item', itemType: 'random', minRarity: 'common', rarityBoost: 6 },
        ],
      },
    },
    {
      text: 'Sidestep and strike (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 9,
      },
      outcome: {
        text: 'You dodge its charge and strike its vulnerable side! A decisive blow!',
        effects: [
          { type: 'damage', target: 'strongest', value: 13 },
          { type: 'xp', value: 160 },
          { type: 'gold', value: 190 },
          { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 9 },
        ],
      },
    },
    {
      text: 'Calm the beast (Ranger bonus)',
      requirements: {
        class: 'Ranger',
      },
      outcome: {
        text: 'You speak to the animal\'s instincts! The boar calms and trots away!',
        effects: [
          { type: 'damage', target: 'all', value: 8 },
          { type: 'xp', value: 170 },
          { type: 'gold', value: 210 },
          { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 11 },
        ],
      },
    },
  ],
  depth: 1,
  icon: GiBoarEnsign,
  isIntroBoss: true,
}

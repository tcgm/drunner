import type { DungeonEvent } from '@/types'
import { GiSawedOffShotgun } from 'react-icons/gi'

export const SIEGE_AUTOMATON: DungeonEvent = {
  id: 'siege-automaton',
  type: 'boss',
  title: 'Siege Automaton',
  description: 'A towering war machine designed to break castle walls. Its integrated ballistae and crushing limbs make it a terror on any battlefield.',
  choices: [
    {
      text: 'Weather the assault',
      outcome: {
        text: 'Bolts and crushing blows rain down! You\'re pummeled by siege weaponry!',
        effects: [
          { type: 'damage', target: 'all', value: 190 },
          { type: 'xp', value: 730 },
          { type: 'gold', value: 1060 },
          { type: 'item', itemType: 'random', minRarity: 'rare', maxRarity: 'legendary', rarityBoost: 22 },
        ],
      },
    },
    {
      text: 'Sabotage mechanisms (Rogue bonus)',
      requirements: {
        class: 'Rogue',
      },
      outcome: {
        text: 'You infiltrate and disable key systems! It tears itself apart!',
        effects: [
          { type: 'damage', target: 'random', value: 148 },
          { type: 'xp', value: 800 },
          { type: 'gold', value: 1140 },
          { type: 'item', itemType: 'weapon', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 26 },
        ],
      },
    },
    {
      text: 'Overload power core (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 41,
      },
      outcome: {
        text: 'You break through to its power source and overload it! It explodes spectacularly!',
        effects: [
          { type: 'damage', target: 'strongest', value: 160 },
          { type: 'xp', value: 820 },
          { type: 'gold', value: 1170 },
          { type: 'item', itemType: 'armor', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 28 },
        ],
      },
    },
  ],
  depth: 38,
  icon: GiSawedOffShotgun,
}

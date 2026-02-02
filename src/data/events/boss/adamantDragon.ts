import type { DungeonEvent } from '@/types'
import { GiSpikeDragon } from 'react-icons/gi'

export const ADAMANT_DRAGON: DungeonEvent = {
  id: 'adamant-dragon',
  type: 'boss',
  title: 'Adamant Dragon',
  description: 'A wyrm with metallic scales harder than any armor. Its breath weapon is superheated metal shards that pierce everything.',
  choices: [
    {
      text: 'Tank the shards',
      outcome: {
        text: 'Molten metal pierces your defenses! The dragon is impenetrable!',
        effects: [
          { type: 'damage', target: 'all', value: 420 },
          { type: 'xp', value: 1680 },
          { type: 'gold', value: 2520 },
          { type: 'item', itemType: 'random', minRarity: 'epic', maxRarity: 'legendary', rarityBoost: 33 },
        ],
      },
    },
    {
      text: 'Exploit weak points (High Attack)',
      requirements: {
        stat: 'attack',
        minValue: 64,
      },
      outcome: {
        text: 'You strike between the scales! Even adamant has gaps!',
        effects: [
          { type: 'damage', target: 'strongest', value: 348 },
          { type: 'xp', value: 1800 },
          { type: 'gold', value: 2700 },
          { type: 'item', itemType: 'weapon', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 43 },
        ],
      },
    },
    {
      text: 'Turn its breath back (Mage bonus)',
      requirements: {
        class: 'Mage',
      },
      outcome: {
        text: 'You reflect the metal shards! The dragon is destroyed by its own weapon!',
        effects: [
          { type: 'damage', target: 'all', value: 362 },
          { type: 'xp', value: 1825 },
          { type: 'gold', value: 2738 },
          { type: 'item', itemType: 'armor', minRarity: 'legendary', maxRarity: 'mythic', rarityBoost: 44 },
        ],
      },
    },
  ],
  depth: 59,
  icon: GiSpikeDragon,
}

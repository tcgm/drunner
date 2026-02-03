import type { DungeonEvent } from '@/types'
import { GiMountaintop } from 'react-icons/gi'

export const PRIMORDIAL_TITAN: DungeonEvent = {
  id: 'primordial-titan',
  type: 'boss',
  title: 'Primordial Titan',
  description: 'A being as old as the world itself. Mountains have eroded to dust in the time this creature has existed. It remembers when gods were young. Its every breath is like thunder, its footsteps like earthquakes.',
  choices: [
    {
      text: 'Match its ancient power',
      outcome: {
        text: 'You dig deep into your own strength, matching the titan blow for titanic blow! The battle shakes the very foundations!',
        effects: [
          { type: 'damage', target: 'all', value: 600 },
          { type: 'xp', value: 2400 },
          { type: 'gold', value: 3400 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 38 },
          { type: 'item', itemType: 'random', minRarity: 'legendary', rarityBoost: 38 },
        ],
      },
    },
    {
      text: 'Exploit mortal cunning (High Speed)',
      requirements: {
        stat: 'speed',
        minValue: 130,
      },
      outcome: {
        text: 'Your mortal agility proves superior to its ancient power! You dance around its devastating attacks, striking at critical points!',
        effects: [
          { type: 'damage', target: 'all', value: 480 },
          { type: 'xp', value: 2700 },
          { type: 'gold', value: 3700 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', rarityBoost: 45 },
        ],
      },
    },
    {
      text: 'Call upon the gods (Cleric/Paladin bonus)',
      requirements: {
        class: 'Cleric',
      },
      outcome: {
        text: 'You channel the power of divinity itself! Even a primordial must bow before the gods it once knew!',
        effects: [
          { type: 'damage', target: 'all', value: 510 },
          { type: 'heal', target: 'all', value: 120 },
          { type: 'xp', value: 2900 },
          { type: 'gold', value: 4000 },
          { type: 'item', itemType: 'random', minRarity: 'mythic', rarityBoost: 50 },
        ],
      },
    },
  ],
  depth: 85,
  icon: GiMountaintop,
}

import backgroundImage from '@/assets/icons/species/background/dwarf.png'
import type { SpeciesDefinition } from './_types'

export const dwarf: SpeciesDefinition = {
  id: 'dwarf',
  name: 'Dwarf',
  description: 'Stout and enduring, dwarves are unmatched in toughness and stubborn resolve.',
  statBonuses: [
    { stat: 'defense', value: 3 },
    { stat: 'maxHp', value: 15 },
  ],
  nameStyle: 'dwarven',
  spawnRarity: 'common',
  backgroundIcon: 'GiDwarfFace',
  backgroundImage,
  backgroundOffset: { x: 0, y: 23.8333257039388, scale: 0.73 },
}

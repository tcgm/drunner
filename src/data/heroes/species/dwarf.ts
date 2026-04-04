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
}

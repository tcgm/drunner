import type { SpeciesDefinition } from './_types'

export const dragon: SpeciesDefinition = {
  id: 'dragon',
  name: 'Dragon',
  description: 'Ancient and terrifyingly powerful beings who have chosen — or been forced — to walk among mortals. Their presence alone shifts the balance of a dungeon.',
  statBonuses: [
    { stat: 'attack', value: 8 },
    { stat: 'defense', value: 6 },
    { stat: 'maxHp', value: 30 },
    { stat: 'magicPower', value: 5 },
  ],
  nameStyle: 'draconic',
  spawnRarity: 'legendary',
  backgroundIcon: 'GiDragonHead',
}

import type { SpeciesDefinition } from './_types'

export const tanuki: SpeciesDefinition = {
  id: 'tanuki',
  name: 'Tanuki',
  description: 'Shape-shifting raccoon spirits whose boundless luck and silver tongues make them impossible to read.',
  statBonuses: [
    { stat: 'luck', value: 3 },
    { stat: 'charisma', value: 2 },
  ],
  nameStyle: 'yokai',
  spawnRarity: 'common',
}

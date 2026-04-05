import type { UniqueHeroDefinition } from './_types'

/** A hellborn warrior who ran away from Hell — literally just left. Nobody has come to collect her. She's not sure if she won. */
export const scorcha: UniqueHeroDefinition = {
    id: 'scorcha',
    name: 'Scorcha',
    species: 'hellborn',
    heroRarity: 'epic',
    level: 4,
    classId: 'warrior',
    statBonuses: [
        { stat: 'attack', value: 11 },
        { stat: 'maxHp', value: 25 },
        { stat: 'defense', value: 5 },
    ],
    hireCostOverride: 2000,
    lore: 'She ran away from Hell. Not metaphorically. Literally, she just left. Nobody has come to collect her. She\'s not sure if this means she won or they\'re waiting for something.',
}

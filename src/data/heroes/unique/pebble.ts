import type { UniqueHeroDefinition } from './_types'

/** A halfling ranger who nobody remembers hiring. She was just there one day, fully equipped, ready to go. */
export const pebble: UniqueHeroDefinition = {
    id: 'pebble',
    name: 'Pebble',
    species: 'halfling',
    heroRarity: 'rare',
    level: 3,
    classId: 'ranger',
    statBonuses: [
        { stat: 'luck', value: 7 },
        { stat: 'speed', value: 6 },
        { stat: 'attack', value: 4 },
    ],
    hireCostOverride: 900,
    lore: 'Nobody remembers hiring her. She was just there one day, fully equipped, ready to go. She doesn\'t explain this. Nobody presses.',
}

import type { UniqueHeroDefinition } from './_types'

/** A relic of a forgotten age, powered by runes and stubbornness. */
export const ancientconstruct: UniqueHeroDefinition = {
    id: 'ancientconstruct',
    name: 'Cogheart the Relentless',
    species: 'construct',
    heroRarity: 'epic',
    level: 5,
    classId: 'guardian',
    statBonuses: [
        { stat: 'defense', value: 18 },
        { stat: 'maxHp', value: 50 },
        { stat: 'attack', value: 6 },
    ],
    hireCostOverride: 3400,
    lore: 'It does not sleep. It does not tire. It simply stands, waiting for the next threat to emerge from the dark. The dungeon has tried to break it twelve times. All twelve attempts failed.',
}

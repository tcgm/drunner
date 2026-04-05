import type { UniqueHeroDefinition } from './_types'

/** An orc bard whose battle chants make allies fight harder and enemies slow down trying to figure out what he's singing about. He has leaned into the confusion. */
export const korvash: UniqueHeroDefinition = {
    id: 'korvash',
    name: 'Korvash the Singing Blade',
    species: 'orc',
    heroRarity: 'epic',
    level: 4,
    classId: 'bard',
    statBonuses: [
        { stat: 'attack', value: 8 },
        { stat: 'charisma', value: 7 },
        { stat: 'luck', value: 5 },
    ],
    hireCostOverride: 1950,
    lore: 'He writes battle chants. Allies fight harder; enemies slow down trying to figure out what he\'s singing about. He is aware this effect is partly confusion. He has leaned into it.',
}

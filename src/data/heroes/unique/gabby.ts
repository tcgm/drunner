import type { UniqueHeroDefinition } from './_types'

/** Heaven's divine messenger. She has delivered the most important messages in history and she will not stop bringing it up. */
export const gabby: UniqueHeroDefinition = {
    id: 'gabby',
    name: 'Gabriel',
    species: 'angel',
    heroRarity: 'epic',
    level: 4,
    classId: 'bard',
    statBonuses: [
        { stat: 'charisma', value: 10 },
        { stat: 'wisdom', value: 7 },
        { stat: 'speed', value: 5 },
    ],
    hireCostOverride: 2200,
    lore: 'She delivered the most important messages in history. She will not stop reminding you. To be fair, they were the most important messages in history.',
}

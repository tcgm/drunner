import type { UniqueHeroDefinition } from './_types'

/** An elven mage who has been studying magic for four hundred years and is still not satisfied. His colleagues find this insufferable. He's probably right. */
export const aethon: UniqueHeroDefinition = {
    id: 'aethon',
    name: 'Aethon Dawnwhisper',
    species: 'elf',
    heroRarity: 'legendary',
    level: 5,
    classId: 'mage',
    statBonuses: [
        { stat: 'magicPower', value: 12 },
        { stat: 'wisdom', value: 10 },
        { stat: 'speed', value: 4 },
    ],
    hireCostOverride: 3100,
    lore: 'He has been studying magic for four hundred years. He is still not satisfied. He doesn\'t believe anyone is ever truly finished. His colleagues find this insufferable. He\'s probably right.',
}

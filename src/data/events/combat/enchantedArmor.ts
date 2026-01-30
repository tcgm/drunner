import type { DungeonEvent } from '@/types'

export const ENCHANTED_ARMOR: DungeonEvent = {
    id: 'enchanted-armor',
    type: 'combat',
    title: 'Enchanted Armor',
    description: [
        { weight: 3, text: 'A suit of ancient armor animates and draws a spectral blade!' },
        { weight: 2, text: 'Empty armor stands up, wielding weapons of pure magic!' },
        { weight: 1, text: 'The armory comes to life as suits of armor march toward you!' },
    ],
    choices: [
        {
            text: 'Clash with the armor',
            outcome: {
                text: 'Steel rings against steel in a brutal melee!',
                effects: [
                    { type: 'damage', target: 'random', value: 25 },
                    { type: 'xp', value: 75 },
                    { type: 'gold', value: 60 },
                ],
            },
        },
        {
            text: 'Break the enchantment (Speed check)',
            requirements: {
                stat: 'speed',
                minValue: 50,
            },
            outcome: {
                text: 'You quickly strike the runic inscriptions, destroying the magic!',
                effects: [
                    { type: 'damage', target: 'random', value: 15 },
                    { type: 'xp', value: 90 },
                    { type: 'gold', value: 75 },
                    { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 6 },
                ],
            },
        },
        {
            text: 'Holy banishment (Cleric bonus)',
            requirements: {
                class: 'Cleric',
            },
            outcome: {
                text: 'Your divine power shatters the necromantic enchantment!',
                effects: [
                    { type: 'xp', value: 95 },
                    { type: 'gold', value: 80 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 7 },
                ],
            },
        },
        {
            text: 'Dodge and flee',
            outcome: {
                text: 'The armor lands several blows before you escape!',
                effects: [
                    { type: 'damage', target: 'all', value: 18 },
                    { type: 'xp', value: 35 },
                ],
            },
        },
    ],
    depth: 7,
}

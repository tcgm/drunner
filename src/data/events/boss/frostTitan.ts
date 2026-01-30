import type { DungeonEvent } from '@/types'

export const FROST_TITAN: DungeonEvent = {
    id: 'frost-titan',
    type: 'boss',
    title: 'Frost Titan',
    description: 'An enormous being of living ice towers before you, its frozen breath turning the air to mist. Icicles the size of spears hang from its massive frame.',
    choices: [
        {
            text: 'Attack head-on',
            outcome: {
                text: 'You charge through the freezing winds, trading blows with the titan!',
                effects: [
                    { type: 'damage', target: 'all', value: 40 },
                    { type: 'xp', value: 220 },
                    { type: 'gold', value: 280 },
                    { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 5 },
                ],
            },
        },
        {
            text: 'Use fire magic (Wizard/Sorcerer)',
            requirements: {
                class: 'Wizard',
            },
            outcome: {
                text: 'Your flames melt the titan\'s icy form, steam erupting as it falls!',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                    { type: 'xp', value: 280 },
                    { type: 'gold', value: 350 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 10 },
                ],
            },
        },
        {
            text: 'Evade and strike weakpoints (Speed check)',
            requirements: {
                stat: 'speed',
                minValue: 20,
            },
            outcome: {
                text: 'You dance around its slow attacks, shattering its frozen limbs!',
                effects: [
                    { type: 'damage', target: 'all', value: 30 },
                    { type: 'xp', value: 250 },
                    { type: 'gold', value: 300 },
                    { type: 'item', itemType: 'boots', minRarity: 'rare', rarityBoost: 8 },
                ],
            },
        },
        {
            text: 'Retreat to safer ground',
            outcome: {
                text: 'You withdraw from the freezing battle zone.',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'xp', value: 60 },
                ],
            },
        },
    ],
    depth: 10,
}

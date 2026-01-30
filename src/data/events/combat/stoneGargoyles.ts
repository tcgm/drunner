import type { DungeonEvent } from '@/types'

export const STONE_GARGOYLES: DungeonEvent = {
    id: 'stone-gargoyles',
    type: 'combat',
    title: 'Stone Gargoyles',
    description: [
        { weight: 3, text: 'Stone statues crack and come to life, spreading stone wings!' },
        { weight: 2, text: 'Gargoyles perched on the ceiling swoop down to attack!' },
        { weight: 1, text: 'Ancient guardians awaken from their stone slumber!' },
    ],
    choices: [
        {
            text: 'Engage them',
            outcome: {
                text: 'Your weapons chip away at the stone creatures!',
                effects: [
                    { type: 'damage', target: 'random', value: 32 },
                    { type: 'xp', value: 105 },
                    { type: 'gold', value: 85 },
                ],
            },
        },
        {
            text: 'Shatter their wings (Attack check)',
            requirements: {
                stat: 'attack',
                minValue: 55,
            },
            outcome: {
                text: 'You ground the gargoyles and finish them off!',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'xp', value: 125 },
                    { type: 'gold', value: 105 },
                    { type: 'item', itemType: 'helmet', minRarity: 'rare', rarityBoost: 11 },
                ],
            },
        },
        {
            text: 'Berserker rage (Warrior bonus)',
            requirements: {
                class: 'Warrior',
            },
            outcome: {
                text: 'Your furious assault shatters the stone guardians!',
                effects: [
                    { type: 'damage', target: 'random', value: 18 },
                    { type: 'xp', value: 130 },
                    { type: 'gold', value: 110 },
                    { type: 'item', itemType: 'armor', minRarity: 'rare', rarityBoost: 12 },
                ],
            },
        },
        {
            text: 'Take cover',
            outcome: {
                text: 'Stone claws tear into you before you find shelter!',
                effects: [
                    { type: 'damage', target: 'all', value: 28 },
                    { type: 'xp', value: 50 },
                ],
            },
        },
    ],
    depth: 13,
}

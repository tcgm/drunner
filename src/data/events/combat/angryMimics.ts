import type { DungeonEvent } from '@/types'

export const ANGRY_MIMICS: DungeonEvent = {
    id: 'angry-mimics',
    type: 'combat',
    title: 'Angry Mimics!',
    description: [
        { weight: 3, text: 'What you thought was a treasure chest suddenly sprouts teeth and lunges!' },
        { weight: 2, text: 'Multiple chests in the room reveal themselves as hungry mimics!' },
        { weight: 1, text: 'A door transforms into a gaping maw full of sharp teeth!' },
    ],
    choices: [
        {
            text: 'Fight them',
            outcome: {
                text: 'You battle the shapeshifting creatures!',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'xp', value: 65 },
                    { type: 'gold', value: 50 },
                ],
            },
        },
        {
            text: 'Detect their weak points (Luck check)',
            requirements: {
                stat: 'luck',
                minValue: 45,
            },
            outcome: {
                text: 'You spot their cores and strike precisely!',
                effects: [
                    { type: 'damage', target: 'random', value: 12 },
                    { type: 'xp', value: 80 },
                    { type: 'gold', value: 65 },
                    { type: 'item', itemType: 'accessory1', minRarity: 'uncommon', rarityBoost: 4 },
                ],
            },
        },
        {
            text: 'Disarm their magic (Wizard bonus)',
            requirements: {
                class: 'Wizard',
            },
            outcome: {
                text: 'You dispel the enchantment animating the mimics!',
                effects: [
                    { type: 'xp', value: 85 },
                    { type: 'gold', value: 70 },
                    { type: 'item', itemType: 'helmet', minRarity: 'uncommon', rarityBoost: 5 },
                ],
            },
        },
        {
            text: 'Run away',
            outcome: {
                text: 'A mimic catches your ankle as you flee!',
                effects: [
                    { type: 'damage', target: 'random', value: 15 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
    ],
    depth: 5,
}

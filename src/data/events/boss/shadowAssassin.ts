import type { DungeonEvent } from '@/types'

export const SHADOW_ASSASSIN: DungeonEvent = {
    id: 'shadow-assassin',
    type: 'boss',
    title: 'Shadow Assassin',
    description: 'A figure materializes from the darkness, twin daggers gleaming. Their form flickers between shadow and substance, making them nearly impossible to track.',
    choices: [
        {
            text: 'Fight defensively',
            outcome: {
                text: 'You weather the assassin\'s relentless assault, landing careful counterblows!',
                effects: [
                    { type: 'damage', target: 'all', value: 38 },
                    { type: 'xp', value: 210 },
                    { type: 'gold', value: 270 },
                    { type: 'item', itemType: 'weapon', minRarity: 'uncommon', rarityBoost: 6 },
                ],
            },
        },
        {
            text: 'Track their movements (Perception check)',
            requirements: {
                stat: 'luck',
                minValue: 18,
            },
            outcome: {
                text: 'You predict their movements and strike at the perfect moment!',
                effects: [
                    { type: 'damage', target: 'all', value: 28 },
                    { type: 'xp', value: 260 },
                    { type: 'gold', value: 320 },
                    { type: 'item', itemType: 'accessory1', minRarity: 'rare', rarityBoost: 10 },
                ],
            },
        },
        {
            text: 'Match their speed (Rogue bonus)',
            requirements: {
                class: 'Rogue',
            },
            outcome: {
                text: 'You engage in a deadly dance of blades, emerging victorious!',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                    { type: 'xp', value: 270 },
                    { type: 'gold', value: 340 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 12 },
                ],
            },
        },
        {
            text: 'Create distance',
            outcome: {
                text: 'You retreat, but the assassin lands several strikes before vanishing.',
                effects: [
                    { type: 'damage', target: 'random', value: 25 },
                    { type: 'xp', value: 55 },
                ],
            },
        },
    ],
    depth: 8,
}

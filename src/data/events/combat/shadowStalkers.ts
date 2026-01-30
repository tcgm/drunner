import type { DungeonEvent } from '@/types'

export const SHADOW_STALKERS: DungeonEvent = {
    id: 'shadow-stalkers',
    type: 'combat',
    title: 'Shadow Stalkers',
    description: [
        { weight: 3, text: 'Dark shapes detach from the walls, taking vaguely humanoid form!' },
        { weight: 2, text: 'The shadows themselves seem to move with malevolent intent!' },
        { weight: 1, text: 'Whispering darkness coalesces into stalking predators!' },
    ],
    choices: [
        {
            text: 'Fight in the darkness',
            outcome: {
                text: 'You swing blindly at the shifting shadows!',
                effects: [
                    { type: 'damage', target: 'random', value: 28 },
                    { type: 'xp', value: 95 },
                    { type: 'gold', value: 75 },
                ],
            },
        },
        {
            text: 'Light a torch (Defense check)',
            requirements: {
                stat: 'defense',
                minValue: 40,
            },
            outcome: {
                text: 'Your light forces the shadows to flee!',
                effects: [
                    { type: 'damage', target: 'random', value: 15 },
                    { type: 'xp', value: 110 },
                    { type: 'gold', value: 90 },
                    { type: 'item', itemType: 'accessory2', minRarity: 'rare', rarityBoost: 9 },
                ],
            },
        },
        {
            text: 'Shadow step (Rogue bonus)',
            requirements: {
                class: 'Rogue',
            },
            outcome: {
                text: 'You move through shadows like they do, striking from within!',
                effects: [
                    { type: 'damage', target: 'random', value: 12 },
                    { type: 'xp', value: 115 },
                    { type: 'gold', value: 95 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 10 },
                ],
            },
        },
        {
            text: 'Flee the darkness',
            outcome: {
                text: 'Shadowy claws rake across you as you escape!',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                    { type: 'xp', value: 45 },
                ],
            },
        },
    ],
    depth: 11,
}

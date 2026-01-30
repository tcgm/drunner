import type { DungeonEvent } from '@/types'

export const CURSED_KNIGHTS: DungeonEvent = {
    id: 'cursed-knights',
    type: 'combat',
    title: 'Cursed Knights',
    description: [
        { weight: 3, text: 'Armored warriors with hollow eyes block your path, cursed to guard forever!' },
        { weight: 2, text: 'The spirits of fallen knights manifest, bound to eternal service!' },
        { weight: 1, text: 'Spectral knights phase through walls, weapons raised!' },
    ],
    choices: [
        {
            text: 'Duel the knights',
            outcome: {
                text: 'You trade blows with the cursed warriors!',
                effects: [
                    { type: 'damage', target: 'random', value: 35 },
                    { type: 'xp', value: 120 },
                    { type: 'gold', value: 100 },
                ],
            },
        },
        {
            text: 'Break the curse (Speed check)',
            requirements: {
                stat: 'speed',
                minValue: 65,
            },
            outcome: {
                text: 'You destroy the cursed artifact binding them!',
                effects: [
                    { type: 'damage', target: 'random', value: 20 },
                    { type: 'xp', value: 140 },
                    { type: 'gold', value: 120 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 13 },
                ],
            },
        },
        {
            text: 'Lay them to rest (Cleric bonus)',
            requirements: {
                class: 'Cleric',
            },
            outcome: {
                text: 'Your holy rites free their souls from bondage!',
                effects: [
                    { type: 'xp', value: 150 },
                    { type: 'gold', value: 130 },
                    { type: 'item', itemType: 'armor', minRarity: 'epic', rarityBoost: 14 },
                ],
            },
        },
        {
            text: 'Phase through them',
            outcome: {
                text: 'The knights strike as you attempt to pass!',
                effects: [
                    { type: 'damage', target: 'all', value: 32 },
                    { type: 'xp', value: 55 },
                ],
            },
        },
    ],
    depth: 14,
}

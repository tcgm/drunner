import type { DungeonEvent } from '@/types'
import { GiFrozenOrb } from 'react-icons/gi'

export const ICE_WRAITHS: DungeonEvent = {
    id: 'ice-wraiths',
    type: 'combat',
    title: 'Ice Wraiths',
    description: [
        { weight: 3, text: 'Ghostly figures made of frost and mist swirl around you!' },
        { weight: 2, text: 'The temperature plummets as spectral ice creatures appear!' },
        { weight: 1, text: 'Frozen spirits wail as they manifest from the icy walls!' },
    ],
    choices: [
        {
            text: 'Battle the wraiths',
            outcome: {
                text: 'The cold bites deep as you fight the frozen spirits!',
                effects: [
                    { type: 'damage', target: 'all', value: 30 },
                    { type: 'xp', value: 115 },
                    { type: 'gold', value: 95 },
                ],
            },
        },
        {
            text: 'Warm yourself (Defense check)',
            requirements: {
                stat: 'defense',
                minValue: 50,
            },
            outcome: {
                text: 'Your endurance keeps you warm as you defeat the wraiths!',
                effects: [
                    { type: 'damage', target: 'random', value: 18 },
                    { type: 'xp', value: 135 },
                    { type: 'gold', value: 115 },
                    { type: 'item', itemType: 'accessory1', minRarity: 'rare', rarityBoost: 12 },
                ],
            },
        },
        {
            text: 'Fire magic (Wizard bonus)',
            requirements: {
                class: 'Wizard',
            },
            outcome: {
                text: 'Your flames melt the ice wraiths to nothingness!',
                effects: [
                    { type: 'damage', target: 'random', value: 15 },
                    { type: 'xp', value: 145 },
                    { type: 'gold', value: 125 },
                    { type: 'item', itemType: 'helmet', minRarity: 'rare', rarityBoost: 14 },
                ],
            },
        },
        {
            text: 'Flee the cold',
            outcome: {
                text: 'Frost burns your skin as you escape!',
                effects: [
                    { type: 'damage', target: 'all', value: 28 },
                    { type: 'xp', value: 50 },
                ],
            },
        },
    ],
    depth: 12,
    icon: GiFrozenOrb,
}

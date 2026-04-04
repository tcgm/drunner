import type { DungeonEvent } from '@/types'
import { GiIceberg } from 'react-icons/gi'

export const FROST_VEIN: DungeonEvent = {
    id: 'frost-vein',
    type: 'mining',
    title: 'Frost Crystal Vein',
    description: 'Ice-blue crystals have grown through the rock — not natural ice, but permafrost minerals that have taken crystalline form over millennia. The cold here is biting.',
    choices: [
        {
            text: 'Mine quickly before the cold gets to you',
            outcome: {
                text: 'Numb fingers, but good yield. You pack the crystals before frostbite sets in.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'damage', target: 'all', value: 10, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Warm tools with fire before extraction',
            outcome: {
                text: 'Heated tools work the cold rock cleanly. Smart preparation.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 25 },
                ],
            },
        },
        {
            text: 'Search for the frost node — the source crystal (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'You find it: a magnificent primary crystal the size of a fist. Priceless.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                    { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 5 },
                ],
            },
            failureOutcome: {
                text: 'No node. You\'re just cold and empty-handed.',
                effects: [
                    { type: 'damage', target: 'all', value: 15, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Too cold — keep moving',
            outcome: {
                text: 'Your breath mists and you pick up the pace.',
                effects: [],
            },
        },
    ],
    depth: 7,
    icon: GiIceberg,
}

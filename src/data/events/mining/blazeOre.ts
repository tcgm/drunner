import type { DungeonEvent } from '@/types'
import { GiFireGem } from 'react-icons/gi'

export const BLAZE_ORE: DungeonEvent = {
    id: 'blaze-ore',
    type: 'mining',
    title: 'Blaze Ore Seam',
    description: 'The rock wall glows with internal heat. Veins of deep orange ore pulse thickly — blaze ore, formed where magma cooled over centuries. You can feel the heat through your gloves.',
    choices: [
        {
            text: 'Mine with thick gloves and patience',
            outcome: {
                text: 'Hot work, but manageable. You end up with a good haul.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'damage', target: 'random', value: 10, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Use water to cool sections before mining',
            outcome: {
                text: 'Smart approach. Steam and cracking sounds, then stable cool fragments in your hands.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Mine aggressively while it\'s hot — more yield (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'You work quickly before the ore re-bonds with the surrounding rock. A spectacular haul.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'xp', value: 50 },
                ],
            },
            failureOutcome: {
                text: 'The ore superheats in your hands. Third-degree burns for two heroes.',
                effects: [
                    { type: 'damage', target: 'all', value: 40, isTrueDamage: true },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Too hot — not worth the burns',
            outcome: {
                text: 'You save your skin, literally, and press on.',
                effects: [],
            },
        },
    ],
    depth: 8,
    icon: GiFireGem,
}

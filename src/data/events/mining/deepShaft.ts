import type { DungeonEvent } from '@/types'
import { GiMineWagon } from 'react-icons/gi'

export const DEEP_SHAFT: DungeonEvent = {
    id: 'deep-shaft',
    type: 'mining',
    title: 'Abandoned Mine Shaft',
    description: 'An old mine shaft has been cut into the dungeon wall. Rotting timber supports creak ominously, but the ore veins visible in the walls look rich.',
    choices: [
        {
            text: 'Mine the accessible surface veins',
            outcome: {
                text: 'You work the visible veins quickly without going too deep.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Go deeper into the shaft (riskier, richer seam)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The inner veins are incredible. You haul out a substantial load.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'A support gives way. The collapse forces you to scramble out empty-handed and bruised.',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                    { type: 'xp', value: 15 },
                ],
            },
        },
        {
            text: 'Shore up the timbers first, then mine (Attack check)',
            requirements: { stat: 'attack', minValue: 40 },
            outcome: {
                text: 'A solid job reinforcing the shaft. You mine safely and thoroughly.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Too unstable — walk away',
            outcome: {
                text: 'The groaning timbers agree with your caution.',
                effects: [],
            },
        },
    ],
    depth: 5,
    icon: GiMineWagon,
}

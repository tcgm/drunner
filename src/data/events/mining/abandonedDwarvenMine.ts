import type { DungeonEvent } from '@/types'
import { GiDwarfFace } from 'react-icons/gi'

export const ABANDONED_DWARVEN_MINE: DungeonEvent = {
    id: 'abandoned-dwarven-mine',
    type: 'mining',
    title: 'Abandoned Dwarven Mine',
    description: 'A proper dwarven mine cut through the dungeon rock — arched ceilings, carved supports, tool racks still bolted to the walls. Abandoned centuries ago, but the veins were never fully exhausted.',
    choices: [
        {
            text: 'Work the leftover veins',
            outcome: {
                text: 'Even the dwarves\' leavings are richer than most finds elsewhere.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Use the dwarven tools (better quality extraction)',
            outcome: {
                text: 'Properly balanced picks make a world of difference. The yield is exceptional.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                    { type: 'xp', value: 50 },
                ],
            },
        },
        {
            text: 'Explore the deeper tunnels (Luck check)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'The far tunnels hold an untouched secondary vein the dwarves never reached.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 8 },
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'The deeper tunnels are flooded. You retreat without finding anything.',
                effects: [
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Take the records left behind (knowledge over ore)',
            outcome: {
                text: 'Dwarven mining records — priceless information about this dungeon\'s geology.',
                effects: [
                    { type: 'xp', value: 100 },
                    { type: 'gold', value: 40 },
                ],
            },
        },
    ],
    depth: 8,
    icon: GiDwarfFace,
}

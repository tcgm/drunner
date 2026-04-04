import type { DungeonEvent } from '@/types'
import { GiCrystalShine } from 'react-icons/gi'

export const CRYSTAL_VEIN: DungeonEvent = {
    id: 'crystal-vein',
    type: 'mining',
    title: 'Crystal Vein',
    description: 'A shimmering vein of crystals runs through the dungeon wall. The formations pulse with faint magical energy.',
    choices: [
        {
            text: 'Mine carefully',
            outcome: {
                text: 'Working patiently, you chip away several quality crystals.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Strike hard for more (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'A lucky strike fractures a huge chunk free — a windfall of raw crystals!',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                ],
            },
            failureOutcome: {
                text: 'You swing too hard. The vein collapses, pelting the party with sharp shards.',
                effects: [
                    { type: 'damage', target: 'all', value: 20, isTrueDamage: true },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Leave it — not worth slowing down',
            outcome: {
                text: 'You press on.',
                effects: [],
            },
        },
    ],
    depth: 3,
    icon: GiCrystalShine,
}

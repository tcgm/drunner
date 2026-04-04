import type { DungeonEvent } from '@/types'
import { GiMedicines } from 'react-icons/gi'

export const APOTHECARY_REMNANTS: DungeonEvent = {
    id: 'apothecary-remnants',
    type: 'rest',
    title: 'Apothecary Remnants',
    description: 'The remains of a portable apothecary station are scattered across a side alcove. Some vials and bandages are still intact.',
    choices: [
        {
            text: 'Search the shelves thoroughly',
            outcome: {
                text: 'You find a useful selection of supplies still in good condition.',
                effects: [
                    { type: 'consumable', consumableId: 'health-potion-small' },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'gold', value: 30 },
                ],
            },
        },
        {
            text: 'Identify the rare compounds (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'You find a rare alchemical compound among the mundane stock.',
                effects: [
                    { type: 'consumable', consumableId: 'strength-elixir' },
                    { type: 'consumable', consumableId: 'luck-elixir' },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'Most of it is spoiled. You salvage what little remains.',
                effects: [
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'xp', value: 15 },
                ],
            },
        },
        {
            text: 'Treat your wounds quickly and move on',
            outcome: {
                text: 'A quick patch-up with the available supplies.',
                effects: [
                    { type: 'heal', target: 'all', value: 35 },
                    { type: 'consumable', consumableId: 'bandages' },
                ],
            },
        },
    ],
    depth: 4,
    icon: GiMedicines,
}

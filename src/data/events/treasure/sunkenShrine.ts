import type { DungeonEvent } from '@/types'
import { GiWaterDrop } from 'react-icons/gi'

export const SUNKEN_SHRINE: DungeonEvent = {
    id: 'sunken-shrine',
    type: 'treasure',
    title: 'Sunken Shrine',
    description: 'A partially flooded chamber holds a submerged altar. Glinting offerings lie beneath the dark, still water.',
    choices: [
        {
            text: 'Dive in and retrieve the offerings (Speed check)',
            successChance: 0.55,
            statModifier: 'speed',
            successOutcome: {
                text: 'You plunge into the cold water and surface with handfuls of ancient offerings.',
                effects: [
                    { type: 'gold', value: 180 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 8 },
                ],
            },
            failureOutcome: {
                text: 'Something cold coils around your leg from below. You surface gasping, dropping most of what you found.',
                effects: [
                    { type: 'damage', target: 'random', value: 40 },
                    { type: 'gold', value: 60 },
                ],
            },
        },
        {
            text: 'Pray at the altar and leave an offering',
            outcome: {
                text: 'The shrine spirit accepts your tribute and blesses the party in return.',
                effects: [
                    { type: 'gold', value: -30 },
                    { type: 'heal', target: 'all', value: 60 },
                    { type: 'xp', value: 60 },
                ],
            },
        },
        {
            text: 'Leave it undisturbed',
            outcome: {
                text: 'You back away respectfully from the flooded chamber.',
                effects: [],
            },
        },
    ],
    depth: 6,
    icon: GiWaterDrop,
}

import type { DungeonEvent } from '@/types'
import { GiFire } from 'react-icons/gi'

export const RAVAGED_BIVOUAC: DungeonEvent = {
    id: 'ravaged-bivouac',
    type: 'rest',
    title: 'Ravaged Bivouac',
    description: "Someone camped here recently — and didn't leave voluntarily. Scattered gear and an extinguished fire ring remain.",
    choices: [
        {
            text: 'Rest at the campsite and relight the fire',
            outcome: {
                text: 'Warmth and rest do their work. You wake up patched and alert.',
                effects: [
                    { type: 'heal', target: 'all', value: 50 },
                    { type: 'xp', value: 25 },
                ],
            },
        },
        {
            text: 'Search through the abandoned belongings',
            outcome: {
                text: 'The previous occupant left in a hurry — and left behind useful gear.',
                effects: [
                    { type: 'gold', value: 45 },
                    { type: 'consumable', consumableId: 'rations' },
                    { type: 'consumable', consumableId: 'bandages' },
                ],
            },
        },
        {
            text: 'Set a watch and rest in shifts',
            outcome: {
                text: 'The careful rest leaves everyone better prepared — if a little tired.',
                effects: [
                    { type: 'heal', target: 'all', value: 35 },
                    { type: 'gold', value: 25 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
    ],
    depth: 2,
    icon: GiFire,
}

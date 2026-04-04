import type { DungeonEvent } from '@/types'
import { GiSkullCrack } from 'react-icons/gi'

export const REANIMATED_BONES: DungeonEvent = {
    id: 'reanimated-bones',
    type: 'trap',
    title: 'Reanimated Bones',
    description: 'The floor of the corridor is covered in old bones. As you step on them, they twitch. A necromantic ward still pulses in the walls — whoever made this trap was thorough.',
    choices: [
        {
            text: 'Dispel the ward (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The ward collapses and the bones go still again.',
                effects: [
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'The ward flares and the bones assemble into something that attacks immediately.',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                ],
            },
        },
        {
            text: 'Stomp through quickly (Speed check)',
            successChance: 0.55,
            statModifier: 'speed',
            successOutcome: {
                text: 'You sprint through before the reassembly is complete. Close.',
                effects: [
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'Bony hands grab ankles. The party takes hits getting free.',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                ],
            },
        },
        {
            text: 'Shatter every bone before they can assemble',
            outcome: {
                text: 'Exhausting, but effective. You grind every fragment to dust.',
                effects: [
                    { type: 'damage', target: 'all', value: 15 },
                    { type: 'xp', value: 45 },
                ],
            },
        },
    ],
    depth: 8,
    icon: GiSkullCrack,
}

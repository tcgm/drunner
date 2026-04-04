import type { DungeonEvent } from '@/types'
import { GiRuneStone } from 'react-icons/gi'

export const EXPLOSIVE_RUNE: DungeonEvent = {
    id: 'explosive-rune',
    type: 'trap',
    title: 'Explosive Rune',
    description: 'A barely-visible sigil sprawls across the corridor floor, glowing faintly orange. The air smells of sulphur. One wrong step and it goes.',
    choices: [
        {
            text: 'Identify and neutralise (Luck check)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'You snap the rune\'s circuit with a counter-inscription. It sputters and dies.',
                effects: [
                    { type: 'xp', value: 75 },
                ],
            },
            failureOutcome: {
                text: 'The counter-inscription made things worse. The detonation is spectacular.',
                effects: [
                    { type: 'damage', target: 'all', value: 45, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Drag a piece of debris onto it',
            outcome: {
                text: 'The rune detonates under the debris. You shield your faces from the blast.',
                effects: [
                    { type: 'damage', target: 'all', value: 15 },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Leap over it',
            successChance: 0.55,
            statModifier: 'speed',
            successOutcome: {
                text: 'Everyone clears it in a single bound.',
                effects: [
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'The last hero\'s foot clips the edge. The explosion catches the whole party.',
                effects: [
                    { type: 'damage', target: 'all', value: 30 },
                ],
            },
        },
        {
            text: 'Back away and find another route',
            outcome: {
                text: 'You leave it intact and detour safely.',
                effects: [
                    { type: 'xp', value: 10 },
                ],
            },
        },
    ],
    depth: 7,
    icon: GiRuneStone,
}

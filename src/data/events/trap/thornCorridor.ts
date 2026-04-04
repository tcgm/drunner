import type { DungeonEvent } from '@/types'
import { GiSpikes } from 'react-icons/gi'

export const THORN_CORRIDOR: DungeonEvent = {
    id: 'thorn-corridor',
    type: 'trap',
    title: 'Thorn Corridor',
    description: 'Dense black thorns have grown through the walls and floor, leaving only a narrow winding path. The thorns are barbed and spring back when touched.',
    choices: [
        {
            text: 'Navigate the path carefully (Speed check)',
            successChance: 0.6,
            statModifier: 'speed',
            successOutcome: {
                text: 'Slow, careful footwork gets everyone through without a scratch.',
                effects: [
                    { type: 'xp', value: 45 },
                ],
            },
            failureOutcome: {
                text: 'Barbs snag armour and skin. You emerge scratched and irritated.',
                effects: [
                    { type: 'damage', target: 'all', value: 20 },
                    { type: 'xp', value: 15 },
                ],
            },
        },
        {
            text: 'Hack through with weapons (Attack check)',
            requirements: { stat: 'attack', minValue: 45 },
            outcome: {
                text: 'It takes effort but you carve a cleaner path through the growths.',
                effects: [
                    { type: 'damage', target: 'all', value: 10 },
                    { type: 'xp', value: 50 },
                ],
            },
        },
        {
            text: 'Burn it',
            successChance: 0.7,
            statModifier: 'luck',
            successOutcome: {
                text: 'The thorns ignite easily. You wait for it to burn down and walk the clean path.',
                effects: [
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'The fire spreads faster than expected, forcing you to charge through the burning thicket.',
                effects: [
                    { type: 'damage', target: 'all', value: 30, isTrueDamage: true },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Accept the scratches and push through',
            outcome: {
                text: 'Everyone bleeds a little. The thorns weren\'t giving up without payment.',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
    ],
    depth: 4,
    icon: GiSpikes,
}

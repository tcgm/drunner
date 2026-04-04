import type { DungeonEvent } from '@/types'
import { GiScrollUnfurled } from 'react-icons/gi'

export const SCROLL_MONGER: DungeonEvent = {
    id: 'scroll-monger',
    type: 'merchant',
    title: 'Scroll Monger',
    description: 'An elderly scholar sells ancient scrolls and tomes recovered from the deeper vaults. Knowledge is worth more than gold — or so he insists.',
    choices: [
        {
            text: 'Purchase a skill scroll',
            requirements: { gold: 70 },
            outcome: {
                text: 'You study the scroll carefully. Your technique improves.',
                effects: [
                    { type: 'gold', value: -70 },
                    { type: 'xp', value: 120 },
                ],
            },
        },
        {
            text: 'Buy the advanced codex (requires high stat)',
            requirements: { gold: 130, stat: 'luck', minValue: 50 },
            outcome: {
                text: 'The dense tome is hard going, but invaluable. Your whole party learns from it.',
                effects: [
                    { type: 'gold', value: -130 },
                    { type: 'xp', value: 280 },
                ],
            },
        },
        {
            text: 'Ask if he has any item schematics',
            requirements: { gold: 90 },
            outcome: {
                text: 'He produces a hand-drawn schematic. Following it, you assemble something useful.',
                effects: [
                    { type: 'gold', value: -90 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon' },
                ],
            },
        },
        {
            text: 'Read one for free while he\'s distracted (Luck check)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'You absorb it quickly before he notices.',
                effects: [
                    { type: 'xp', value: 80 },
                ],
            },
            failureOutcome: {
                text: 'He catches you and politely but firmly shows you the exit.',
                effects: [],
            },
        },
        {
            text: 'Not interested',
            outcome: {
                text: 'He returns to his reading.',
                effects: [],
            },
        },
    ],
    depth: 3,
    icon: GiScrollUnfurled,
}

import type { DungeonEvent } from '@/types'
import { GiHealing } from 'react-icons/gi'

export const CURSE_LIFTER: DungeonEvent = {
    id: 'curse-lifter',
    type: 'merchant',
    title: 'Curse Lifter',
    description: 'A solemn cleric offers his services to weary adventurers. Wounds, ailments, or spiritual burdens — he says he can handle them all, for a price.',
    choices: [
        {
            text: 'Pay for full party healing',
            requirements: { gold: 80 },
            outcome: {
                text: 'He lays hands on each hero in turn. Everyone leaves considerably better off.',
                effects: [
                    { type: 'gold', value: -80 },
                    { type: 'heal', target: 'all', fullHeal: true },
                ],
            },
        },
        {
            text: 'Pay to revive a fallen hero',
            requirements: { gold: 150 },
            outcome: {
                text: 'Chanting softly, he draws a soul back from the brink.',
                effects: [
                    { type: 'gold', value: -150 },
                    { type: 'revive', target: 'random', value: 50 },
                ],
            },
        },
        {
            text: 'Ask for a minor blessing (cheap)',
            requirements: { gold: 30 },
            outcome: {
                text: 'A brief prayer. The party feels a little more protected.',
                effects: [
                    { type: 'gold', value: -30 },
                    { type: 'heal', target: 'all', value: 40 },
                    { type: 'xp', value: 20 },
                ],
            },
        },
        {
            text: 'Ask if he accepts barter',
            outcome: {
                text: 'He shakes his head apologetically. "Gold only, friend."',
                effects: [],
            },
        },
    ],
    depth: 4,
    icon: GiHealing,
}

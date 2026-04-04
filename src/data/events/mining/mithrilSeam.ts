import type { DungeonEvent } from '@/types'
import { GiSilverBullet } from 'react-icons/gi'

export const MITHRIL_SEAM: DungeonEvent = {
    id: 'mithril-seam',
    type: 'mining',
    title: 'Mithril Seam',
    description: 'A thread of pale silver metal runs through the rock — unmistakably mithril. Rare even in the deep places. The seam is thin but pure.',
    choices: [
        {
            text: 'Mine the entire seam methodically',
            outcome: {
                text: 'It takes time, but you extract every usable gram of mithril.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                    { type: 'xp', value: 40 },
                ],
            },
        },
        {
            text: 'Take the purest section only',
            outcome: {
                text: 'You harvest the richest section quickly and move on.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 1 },
                    { type: 'gold', value: 70 },
                ],
            },
        },
        {
            text: 'Follow the seam deeper (Luck check — may widen)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The seam widens dramatically as you follow it into the rock. A vein, not a thread.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'xp', value: 60 },
                ],
            },
            failureOutcome: {
                text: 'The seam pinches out entirely. You\'ve wasted time for nothing.',
                effects: [
                    { type: 'xp', value: 20 },
                ],
            },
        },
    ],
    depth: 9,
    icon: GiSilverBullet,
}

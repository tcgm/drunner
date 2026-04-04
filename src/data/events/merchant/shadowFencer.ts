import type { DungeonEvent } from '@/types'
import { GiHood } from 'react-icons/gi'

export const SHADOW_FENCER: DungeonEvent = {
    id: 'shadow-fencer',
    type: 'merchant',
    title: 'Shadow Fencer',
    description: 'A cloaked figure steps from the shadows holding a sack of "liberated" merchandise. Everything is clearly stolen, but the prices reflect that.',
    choices: [
        {
            text: 'Buy the discounted item (Luck check — it might be cursed)',
            requirements: { gold: 50 },
            successChance: 0.6,
            statModifier: 'luck',
            successOutcome: {
                text: 'Clean goods — or at least, not cursed. A genuine bargain.',
                effects: [
                    { type: 'gold', value: -50 },
                    { type: 'item', itemType: 'random', minRarity: 'rare', rarityBoost: 15 },
                ],
            },
            failureOutcome: {
                text: 'The item glows with a sickly hue. The fencer vanishes before you can complain.',
                effects: [
                    { type: 'gold', value: -50 },
                    { type: 'item', itemType: 'random', minRarity: 'common' },
                    { type: 'damage', target: 'random', value: 20, isTrueDamage: true },
                ],
            },
        },
        {
            text: 'Steal from the thief (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'Ironic justice. You lift something valuable before he realises.',
                effects: [
                    { type: 'item', itemType: 'random', minRarity: 'uncommon' },
                    { type: 'xp', value: 40 },
                ],
            },
            failureOutcome: {
                text: 'He catches your hand and drives a knee into you before fleeing.',
                effects: [
                    { type: 'damage', target: 'random', value: 30 },
                ],
            },
        },
        {
            text: 'Report him to dungeon authorities',
            outcome: {
                text: 'You leave a note somewhere. Probably nothing will happen.',
                effects: [
                    { type: 'xp', value: 15 },
                ],
            },
        },
        {
            text: 'Walk away',
            outcome: {
                text: 'Not your problem.',
                effects: [],
            },
        },
    ],
    depth: 4,
    icon: GiHood,
}

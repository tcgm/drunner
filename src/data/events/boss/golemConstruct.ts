import type { DungeonEvent } from '@/types'
import { GiStoneBlock } from 'react-icons/gi'

export const GOLEM_CONSTRUCT: DungeonEvent = {
    id: 'golem-construct',
    type: 'boss',
    title: 'Golem Construct',
    description: 'An enormous stone golem blocks your path, ancient runes glowing across its massive frame. Each step shakes the ground beneath you.',
    choices: [
        {
            text: 'Attack with brute force',
            outcome: {
                text: 'You chip away at the golem\'s stone body, eventually finding its core!',
                effects: [
                    { type: 'damage', target: 'all', value: 50 },
                    { type: 'xp', value: 280 },
                    { type: 'gold', value: 350 },
                    { type: 'item', itemType: 'armor', minRarity: 'uncommon', rarityBoost: 8 },
                ],
            },
        },
        {
            text: 'Target the runes (Speed check)',
            requirements: {
                stat: 'speed',
                minValue: 25,
            },
            outcome: {
                text: 'You disrupt the magical runes, causing the golem to crumble!',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                    { type: 'xp', value: 340 },
                    { type: 'gold', value: 420 },
                    { type: 'item', itemType: 'accessory2', minRarity: 'rare', rarityBoost: 14 },
                ],
            },
        },
        {
            text: 'Channel divine power (Cleric bonus)',
            requirements: {
                class: 'Cleric',
            },
            outcome: {
                text: 'Holy energy shatters the arcane bindings holding the golem together!',
                effects: [
                    { type: 'damage', target: 'all', value: 30 },
                    { type: 'xp', value: 350 },
                    { type: 'gold', value: 440 },
                    { type: 'item', itemType: 'weapon', minRarity: 'rare', rarityBoost: 15 },
                ],
            },
        },
        {
            text: 'Evade and flee',
            outcome: {
                text: 'The golem\'s massive fist catches you before you can escape.',
                effects: [
                    { type: 'damage', target: 'random', value: 35 },
                    { type: 'xp', value: 70 },
                ],
            },
        },
    ],
    depth: 15,
    icon: GiStoneBlock,
}

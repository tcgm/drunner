import type { DungeonEvent } from '@/types'
import { GiGems } from 'react-icons/gi'

export const UNSTABLE_GEM_CACHE: DungeonEvent = {
    id: 'unstable-gem-cache',
    type: 'mining',
    title: 'Unstable Gem Cache',
    description: 'A cluster of volatile magical gems protrudes from the floor, radiating heat. They\'re worth a fortune — if you can extract them without triggering a rupture.',
    choices: [
        {
            text: 'Extract with care (slow but safe)',
            outcome: {
                text: 'Patience pays off. You carefully prise out several gems without incident.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'gold', value: 60 },
                ],
            },
        },
        {
            text: 'Grab as many as possible (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'Against all odds, you get away clean with an armful of gems.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'gold', value: 120 },
                ],
            },
            failureOutcome: {
                text: 'The cache ruptures in a burst of magical fire! You scramble away with what you can.',
                effects: [
                    { type: 'damage', target: 'all', value: 40 },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Detonate it safely from a distance',
            outcome: {
                text: 'The explosion scatters shards across the floor. You collect the biggest pieces.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Too dangerous — walk away',
            outcome: {
                text: 'Some treasures aren\'t worth it.',
                effects: [],
            },
        },
    ],
    depth: 10,
    icon: GiGems,
}

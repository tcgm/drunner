import type { DungeonEvent } from '@/types'
import { GiGhost } from 'react-icons/gi'

export const GHOSTLY_CAMPFIRE: DungeonEvent = {
    id: 'ghostly-campfire',
    type: 'rest',
    title: 'Ghostly Campfire',
    description: "A campfire burns with cold blue flames that cast no shadows. A translucent figure sits beside it, staring into the fire. It doesn't seem hostile.",
    choices: [
        {
            text: 'Sit with the ghost and listen to its story',
            outcome: {
                text: 'The spirit recounts its life and death with quiet dignity. Somehow, sitting by the pale fire soothes the party\'s wounds.',
                effects: [
                    { type: 'heal', target: 'all', value: 65 },
                    { type: 'xp', value: 80 },
                ],
            },
        },
        {
            text: "Ask the ghost about the dungeon's secrets",
            outcome: {
                text: "The spirit reveals what it remembers — hidden passages, dangers ahead, and where it buried its gold.",
                effects: [
                    { type: 'gold', value: 120 },
                    { type: 'xp', value: 60 },
                ],
            },
        },
        {
            text: 'Attempt to banish the spirit',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'You banish the spirit. Its lingering power washes over the party as it fades.',
                effects: [
                    { type: 'heal', target: 'all', value: 80 },
                    { type: 'xp', value: 70 },
                ],
            },
            failureOutcome: {
                text: 'The ghost takes offense and lashes out before vanishing.',
                effects: [
                    { type: 'damage', target: 'all', value: 30, isTrueDamage: true },
                    { type: 'xp', value: 30 },
                ],
            },
        },
    ],
    depth: 7,
    icon: GiGhost,
}

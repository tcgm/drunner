import type { DungeonEvent } from '@/types'
import { GiChemicalDrop } from 'react-icons/gi'

export const ALCHEMISTS_LABORATORY: DungeonEvent = {
    id: 'alchemists-laboratory',
    type: 'treasure',
    title: "Alchemist's Laboratory",
    description: "Bubbling flasks and scattered notes fill an abandoned laboratory. The alchemist left in quite a hurry — several experiments are still running.",
    choices: [
        {
            text: 'Gather the best formulas and supplies',
            outcome: {
                text: 'You collect a fine haul of alchemical supplies.',
                effects: [
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                    { type: 'consumable', consumableId: 'strength-elixir' },
                    { type: 'consumable', consumableId: 'iron-skin-potion' },
                    { type: 'gold', value: 70 },
                ],
            },
        },
        {
            text: 'Mix the experimental compounds (Luck check)',
            successChance: 0.5,
            statModifier: 'luck',
            successOutcome: {
                text: 'The mixture creates a potent concoction. The party feels supercharged.',
                effects: [
                    { type: 'heal', target: 'all', value: 70 },
                    { type: 'xp', value: 80 },
                    { type: 'consumable', consumableId: 'luck-elixir' },
                    { type: 'consumable', consumableId: 'strength-elixir' },
                ],
            },
            failureOutcome: {
                text: 'The mixture explodes! Noxious fumes fill the room.',
                effects: [
                    { type: 'damage', target: 'all', value: 25, isTrueDamage: true },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                ],
            },
        },
        {
            text: 'Study the research notes carefully',
            outcome: {
                text: 'The alchemical knowledge within is fascinating and instructive. You take key pages.',
                effects: [
                    { type: 'xp', value: 120 },
                    { type: 'gold', value: 50 },
                ],
            },
        },
    ],
    depth: 7,
    icon: GiChemicalDrop,
}

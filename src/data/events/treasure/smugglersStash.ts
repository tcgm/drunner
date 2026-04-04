import type { DungeonEvent } from '@/types'
import { GiOpenChest } from 'react-icons/gi'

export const SMUGGLERS_STASH: DungeonEvent = {
    id: 'smugglers-stash',
    type: 'treasure',
    title: "Smuggler's Stash",
    description: 'A loose stone in the wall conceals a cache — the mark of a dungeon smuggling operation. The goods are still fresh.',
    choices: [
        {
            text: 'Take everything',
            outcome: {
                text: 'Gold, supplies, and stolen goods pack every corner of the stash.',
                effects: [
                    { type: 'gold', value: 110 },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'consumable', consumableId: 'rations' },
                    { type: 'item', itemType: 'random', minRarity: 'common' },
                ],
            },
        },
        {
            text: 'Set a trap and wait for the owner (Luck check)',
            successChance: 0.4,
            statModifier: 'luck',
            successOutcome: {
                text: 'You wait in the shadows. The smuggler arrives — laden with goods. You relieve them of both.',
                effects: [
                    { type: 'gold', value: 210 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon' },
                ],
            },
            failureOutcome: {
                text: 'The trap springs on you instead. Embarrassing.',
                effects: [
                    { type: 'damage', target: 'random', value: 30 },
                    { type: 'gold', value: 50 },
                ],
            },
        },
        {
            text: 'Take only what you need and leave the rest',
            outcome: {
                text: 'You pocket the most useful items and move on.',
                effects: [
                    { type: 'gold', value: 60 },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'xp', value: 25 },
                ],
            },
        },
    ],
    depth: 3,
    icon: GiOpenChest,
}

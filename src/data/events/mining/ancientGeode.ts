import type { DungeonEvent } from '@/types'
import { GiEarthCrack } from 'react-icons/gi'

export const ANCIENT_GEODE: DungeonEvent = {
    id: 'ancient-geode',
    type: 'mining',
    title: 'Ancient Geode',
    description: 'A massive geode — half the size of a room — juts from the floor. Its outer shell is dull grey stone, but you can hear resonance when you knock on it. Something remarkable is inside.',
    choices: [
        {
            text: 'Crack it open at the stress point',
            outcome: {
                text: 'A clean split reveals a dazzling interior of crystalline formations.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 3 },
                    { type: 'gold', value: 60 },
                ],
            },
        },
        {
            text: 'Drill for a core sample first (Luck check)',
            successChance: 0.55,
            statModifier: 'luck',
            successOutcome: {
                text: 'The core sample is extraordinary. You crack it fully and take everything.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 4 },
                    { type: 'xp', value: 50 },
                ],
            },
            failureOutcome: {
                text: 'The drill bit hits a gas pocket and crystals erupt outward.',
                effects: [
                    { type: 'damage', target: 'all', value: 25 },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Hammer out a small opening and reach inside',
            successChance: 0.6,
            statModifier: 'luck',
            successOutcome: {
                text: 'Your hand closes on something extraordinary inside the hollow.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                    { type: 'item', itemType: 'random', minRarity: 'uncommon', rarityBoost: 10 },
                ],
            },
            failureOutcome: {
                text: 'There\'s nothing inside but hollow rock and disappointment.',
                effects: [
                    { type: 'xp', value: 15 },
                ],
            },
        },
    ],
    depth: 6,
    icon: GiEarthCrack,
}

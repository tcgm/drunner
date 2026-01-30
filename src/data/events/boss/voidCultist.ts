import type { DungeonEvent } from '@/types'

export const VOID_CULTIST: DungeonEvent = {
    id: 'void-cultist',
    type: 'boss',
    title: 'Void Cultist',
    description: 'A robed figure stands before an eldritch portal, void energy crackling around them. Their eyes glow with otherworldly power as they chant in an alien tongue.',
    choices: [
        {
            text: 'Interrupt the ritual',
            outcome: {
                text: 'You disrupt the ritual before it completes, but the backlash of void energy strikes you!',
                effects: [
                    { type: 'damage', target: 'all', value: 55 },
                    { type: 'xp', value: 320 },
                    { type: 'gold', value: 400 },
                    { type: 'item', itemType: 'helmet', minRarity: 'rare', rarityBoost: 10 },
                ],
            },
        },
        {
            text: 'Wait for an opening (Luck check)',
            requirements: {
                stat: 'luck',
                minValue: 30,
            },
            outcome: {
                text: 'You sense a perfect moment of vulnerability and strike decisively!',
                effects: [
                    { type: 'damage', target: 'all', value: 40 },
                    { type: 'xp', value: 380 },
                    { type: 'gold', value: 480 },
                    { type: 'item', itemType: 'accessory1', minRarity: 'epic', rarityBoost: 16 },
                ],
            },
        },
        {
            text: 'Use arcane knowledge (Wizard bonus)',
            requirements: {
                class: 'Wizard',
            },
            outcome: {
                text: 'You counter their magic with your own, turning the void energy against them!',
                effects: [
                    { type: 'damage', target: 'all', value: 35 },
                    { type: 'xp', value: 400 },
                    { type: 'gold', value: 500 },
                    { type: 'item', itemType: 'weapon', minRarity: 'epic', rarityBoost: 18 },
                ],
            },
        },
        {
            text: 'Retreat from the portal',
            outcome: {
                text: 'Void tendrils lash out as you flee, tearing at your essence.',
                effects: [
                    { type: 'damage', target: 'random', value: 40 },
                    { type: 'xp', value: 80 },
                ],
            },
        },
    ],
    depth: 20,
}

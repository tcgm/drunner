import type { DungeonEvent } from '@/types'
import { GiMagicSwirl } from 'react-icons/gi'

export const ENCHANTRESS_SHOP: DungeonEvent = {
    id: 'enchantress-shop',
    type: 'merchant',
    title: 'Enchantress\' Stall',
    description: 'A robed enchantress offers temporary magical enhancements. The runes on her stall shimmer with quiet power.',
    choices: [
        {
            text: 'Buy a haste buff',
            requirements: { gold: 60 },
            outcome: {
                text: 'She traces a swift rune on your wrist. Your feet feel lighter.',
                effects: [
                    { type: 'gold', value: -60 },
                    { type: 'consumable', consumableId: 'haste-potion' },
                ],
            },
        },
        {
            text: 'Buy a strength enchantment',
            requirements: { gold: 80 },
            outcome: {
                text: 'A red sigil glows on your arm. Your grip feels iron-hard.',
                effects: [
                    { type: 'gold', value: -80 },
                    { type: 'consumable', consumableId: 'strength-elixir' },
                ],
            },
        },
        {
            text: 'Ask her to enchant your equipment',
            requirements: { gold: 120 },
            outcome: {
                text: 'She spends several minutes weaving spells into your gear. It visibly improves.',
                effects: [
                    { type: 'gold', value: -120 },
                    { type: 'upgradeItem', upgradeType: 'rarity' },
                ],
            },
        },
        {
            text: 'Ask for a blessing (free, minor)',
            outcome: {
                text: 'She offers a small blessing at no charge. "Good luck out there."',
                effects: [
                    { type: 'xp', value: 25 },
                    { type: 'heal', target: 'all', value: 20 },
                ],
            },
        },
        {
            text: 'Decline and move on',
            outcome: {
                text: 'You nod politely and continue into the dungeon.',
                effects: [],
            },
        },
    ],
    depth: 5,
    icon: GiMagicSwirl,
}

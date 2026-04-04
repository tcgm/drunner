import type { DungeonEvent } from '@/types'
import { GiBackpack } from 'react-icons/gi'

export const ADVENTURERS_SUPPLY: DungeonEvent = {
    id: 'adventurers-supply',
    type: 'merchant',
    title: 'Adventurer\'s Supply Depot',
    description: 'A no-nonsense supply sergeant has stocked a small depot in a side alcove. Torches, rations, oil — everything a sensible delver could want.',
    choices: [
        {
            text: 'Buy basic supplies',
            requirements: { gold: 35 },
            outcome: {
                text: 'Torch, rations, bandages. The essentials.',
                effects: [
                    { type: 'gold', value: -35 },
                    { type: 'consumable', consumableId: 'torch' },
                    { type: 'consumable', consumableId: 'rations' },
                    { type: 'consumable', consumableId: 'bandages' },
                ],
            },
        },
        {
            text: 'Buy weapon maintenance kit',
            requirements: { gold: 45 },
            outcome: {
                text: 'Oil, whetstone, polish. Your gear has never been sharper.',
                effects: [
                    { type: 'gold', value: -45 },
                    { type: 'consumable', consumableId: 'oil' },
                    { type: 'consumable', consumableId: 'whetstone' },
                    { type: 'consumable', consumableId: 'armor-polish' },
                ],
            },
        },
        {
            text: 'Buy a power orb for emergencies',
            requirements: { gold: 55 },
            outcome: {
                text: 'A crackling orb of stored energy. Useful in a pinch.',
                effects: [
                    { type: 'gold', value: -55 },
                    { type: 'consumable', consumableId: 'power-orb' },
                ],
            },
        },
        {
            text: 'Resupply everything (bulk deal)',
            requirements: { gold: 100 },
            outcome: {
                text: 'You clean him out. The sergeant looks pleased.',
                effects: [
                    { type: 'gold', value: -100 },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'consumable', consumableId: 'rations' },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                    { type: 'consumable', consumableId: 'power-orb' },
                ],
            },
        },
        {
            text: 'Browse and leave',
            outcome: {
                text: 'Nothing you need right now.',
                effects: [],
            },
        },
    ],
    depth: 1,
    icon: GiBackpack,
}

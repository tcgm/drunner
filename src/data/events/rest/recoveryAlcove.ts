import type { DungeonEvent } from '@/types'
import { GiSleepingBag } from 'react-icons/gi'

export const RECOVERY_ALCOVE: DungeonEvent = {
    id: 'recovery-alcove',
    type: 'rest',
    title: 'Recovery Alcove',
    description: 'A narrow, defensible alcove with a magically reinforced threshold. The air inside feels faintly warm and protected — a rare safe haven in the deep dungeon.',
    choices: [
        {
            text: 'Rest fully — everyone recovers to full health',
            outcome: {
                text: 'The magical shelter does its work. Every wound closes, every ache fades.',
                effects: [
                    { type: 'heal', target: 'all', fullHeal: true },
                    { type: 'xp', value: 30 },
                ],
            },
        },
        {
            text: 'Rest and study nearby inscriptions',
            outcome: {
                text: 'The walls are covered in tactical annotations left by previous adventurers.',
                effects: [
                    { type: 'heal', target: 'all', value: 90 },
                    { type: 'xp', value: 100 },
                    { type: 'consumable', consumableId: 'health-potion-medium' },
                ],
            },
        },
        {
            text: 'Set camp and prepare for the next floor',
            outcome: {
                text: 'You reorganize equipment and rest. The party is ready for what comes next.',
                effects: [
                    { type: 'heal', target: 'all', value: 70 },
                    { type: 'consumable', consumableId: 'bandages' },
                    { type: 'consumable', consumableId: 'rations' },
                    { type: 'xp', value: 50 },
                ],
            },
        },
    ],
    depth: 10,
    icon: GiSleepingBag,
}

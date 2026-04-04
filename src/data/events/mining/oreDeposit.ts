import type { DungeonEvent } from '@/types'
import { GiMineWagon } from 'react-icons/gi'

export const ORE_DEPOSIT: DungeonEvent = {
    id: 'ore-deposit',
    type: 'mining',
    title: 'Rich Ore Deposit',
    description: 'A thick seam of metallic ore glints in the torchlight. Someone has been here before — rusted mining tools lie nearby.',
    choices: [
        {
            text: 'Mine the ore',
            outcome: {
                text: 'You work the seam and pull out a good haul of raw ore.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Use the old tools to dig deeper (Attack check)',
            requirements: {
                stat: 'attack',
                minValue: 60,
            },
            outcome: {
                text: 'Your strength lets you crack the deeper rock. A rich secondary vein spills open.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                    { type: 'xp', value: 40 },
                ],
            },
        },
        {
            text: 'Take a sample and keep moving',
            outcome: {
                text: 'You pocket a small piece and continue.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
    ],
    depth: 5,
    icon: GiMineWagon,
}

import type { DungeonEvent } from '@/types'
import { GiFossil } from 'react-icons/gi'

export const FOSSIL_VEIN: DungeonEvent = {
    id: 'fossil-vein',
    type: 'mining',
    title: 'Fossilised Vein',
    description: 'A seam of ancient fossils is embedded through the rock, some partially mineralized with rare compounds. Scholars would pay well for these, but so would alchemists.',
    choices: [
        {
            text: 'Mine the mineralised sections',
            outcome: {
                text: 'The fossilised mineral deposits make excellent material fragments.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'chest', fragmentQuantity: 2 },
                ],
            },
        },
        {
            text: 'Extract a whole fossil specimen (takes time)',
            outcome: {
                text: 'You spend careful time extracting a pristine specimen. Worth the effort.',
                effects: [
                    { type: 'xp', value: 50 },
                    { type: 'gold', value: 80 },
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
        {
            text: 'Crush it all for maximum yield (Luck check)',
            successChance: 0.45,
            statModifier: 'luck',
            successOutcome: {
                text: 'You hit the ideal stress points and the whole vein fractures cleanly.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'boss', fragmentQuantity: 3 },
                ],
            },
            failureOutcome: {
                text: 'You pulverise the minerals too finely. Most of it is useless dust.',
                effects: [
                    { type: 'material_fragment', fragmentSourceType: 'drop', fragmentQuantity: 1 },
                ],
            },
        },
    ],
    depth: 4,
    icon: GiFossil,
}

import type { QuestType, QuestDifficulty, ItemRarity } from '@/types/quests'

export interface QuestTemplate {
    type: QuestType
    difficulty: QuestDifficulty
    title: string
    descriptionFn: (req: number, extra?: number) => string
    /** Base multiplier before difficulty/power scaling */
    base: number
    /** Exponent applied to partyPower */
    exp: number
    /** Gold per unit of requirement */
    goldPerReq: number
    /** Meta-XP per unit of requirement */
    xpPerReq: number
    /** Rarity tiers available for this quest, ordered low → high */
    rarityPool: ItemRarity[]
    /** Minimum deepestFloor the player must have reached for this template to be offered */
    templateMinFloor?: number
    /** For complete_runs_floor: floorThreshold = deepestFloor * pct (min 10) */
    floorThresholdPct?: number
}

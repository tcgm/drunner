import type { Quest } from '@/types/quests'
import type { Hero } from '@/types'
import { RARITY_CONFIGS } from '@/systems/rarity/raritySystem'
import { QUEST_CONFIG } from '@/config/questConfig'
import { calcGoldXpReward, rollFragmentRewards } from '@/data/questRewards'
import type { QuestTemplate } from './types'
import { KILL_ENEMIES_TEMPLATES } from './killEnemies'
import { COMPLETE_RUNS_TEMPLATES } from './completeRuns'
import { REACH_FLOOR_TEMPLATES } from './reachFloor'
import { DEFEAT_BOSSES_TEMPLATES } from './defeatBosses'
import { EARN_GOLD_TEMPLATES } from './earnGold'
import { COMPLETE_ENCOUNTERS_TEMPLATES } from './encounters'

// ── Party power score ─────────────────────────────────────────────────────
//
// Computes a single 0..∞ value that represents how strong the active party is,
// combining both level and total gear stats.  Used to scale quest requirements
// and rewards proportionally so quests always feel achievable but meaningful.
//
//  Formula:
//    avgLevel  (1–20) contributes directly
//    avgTotalStat  = avg(attack + defense + speed) over party members
//    partyPower = avgLevel + avgTotalStat / 15   (≈1 extra power point per 15 stat)
//
// At level 1, bare hands (~10 total stat): power ≈ 1.7
// At level 10, mid tier gear (~80 total):  power ≈ 15.3
// At level 20, endgame gear (~200+ total): power ≈ 33+

export function calcPartyPower(party: (Hero | null)[]): number {
    const members = party.filter((h): h is Hero => h !== null && h.isAlive)
    if (members.length === 0) return 1

    const avgLevel = members.reduce((sum, h) => sum + h.level, 0) / members.length
    return Math.max(1, avgLevel)
}

// ── All quest templates ───────────────────────────────────────────────────

const QUEST_TEMPLATES: QuestTemplate[] = [
    ...KILL_ENEMIES_TEMPLATES,
    ...COMPLETE_RUNS_TEMPLATES,
    ...REACH_FLOOR_TEMPLATES,
    ...DEFEAT_BOSSES_TEMPLATES,
    ...EARN_GOLD_TEMPLATES,
    ...COMPLETE_ENCOUNTERS_TEMPLATES,
]

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Roll a rarity from `pool` biased by `power`.
 * At low power (≈1) you almost always get index 0 (base tier).
 * As power rises toward 30+ the distribution smoothly opens up
 * toward the top of the pool.
 *
 *   biased = lerp(rand², rand^0.4, t)
 * where t = clamp((power-1)/30, 0, 1)
 */
function rollRarity(pool: QuestTemplate['rarityPool'], power: number): QuestTemplate['rarityPool'][number] {
    const t = Math.min(1, (power - 1) / QUEST_CONFIG.rarityRollPowerScale)
    const rand = Math.random()
    // t=0 → rand² (mean ≈0.33, favours index 0)
    // t=1 → rand^0.4 (mean ≈0.71, favours top)
    const biased = (1 - t) * rand * rand + t * Math.pow(rand, 0.4)
    const idx = Math.min(pool.length - 1, Math.floor(biased * pool.length))
    return pool[idx]
}

/** Round to a "nice" integer – fewer digits look cleaner on the UI */
function niceRound(n: number, snap = 5): number {
    return Math.max(1, Math.round(n / snap) * snap)
}

function calcRequirement(template: QuestTemplate, power: number): number {
    const settings = QUEST_CONFIG.typeSettings[template.type]
    const max = settings.maxPerDifficulty?.[template.difficulty] ?? settings.max
    const raw = template.base * Math.pow(power, template.exp) * QUEST_CONFIG.difficultyReqMult[template.difficulty]
    const snapped = niceRound(raw, settings.snap)
    return Math.min(max, Math.max(1, snapped))
}

/**
 * Generate `count` fresh available quests scaled to the current party's power.
 * Types already held by `existingQuests` are excluded so the board stays varied.
 * Only rarities whose `minFloor` is ≤ `deepestFloor` are eligible for the roll.
 */
export function generateQuests(
    existingQuests: Quest[],
    party: (Hero | null)[],
    count: number = QUEST_CONFIG.boardSlots,
    deepestFloor: number = 0,
): Quest[] {
    const power = calcPartyPower(party)

    const activeTypes = new Set(
        existingQuests
            .filter(q => q.status === 'active' || q.status === 'available')
            .map(q => q.type)
    )

    const eligible = QUEST_TEMPLATES.filter(t =>
        !activeTypes.has(t.type) && deepestFloor >= (t.templateMinFloor ?? 0)
    )
    const shuffled = [...eligible].sort(() => Math.random() - 0.5)
    const picked = shuffled.slice(0, count)

    const now = Date.now()
    return picked.map(template => {
        const requirement = calcRequirement(template, power)
        const { gold, metaXp } = calcGoldXpReward(template.goldPerReq, template.xpPerReq, requirement, template.difficulty)
        // Only roll from rarities the player has unlocked via deepestFloor
        const unlockedPool = template.rarityPool.filter(r => (RARITY_CONFIGS[r]?.minFloor ?? 0) <= deepestFloor)
        const pool = unlockedPool.length > 0 ? unlockedPool : [template.rarityPool[0]]
        const rarity = rollRarity(pool, power)
        const minFloor = RARITY_CONFIGS[rarity]?.minFloor ?? 0
        const items = rollFragmentRewards(rarity, template.difficulty, deepestFloor)
        const floorThreshold = template.floorThresholdPct != null
            ? Math.max(10, Math.floor(deepestFloor * template.floorThresholdPct))
            : undefined
        return {
            id: `quest-${now}-${Math.random().toString(36).slice(2, 8)}`,
            title: template.title,
            description: template.descriptionFn(requirement, floorThreshold),
            type: template.type,
            difficulty: template.difficulty,
            rarity,
            minFloor,
            ...(floorThreshold != null && { floorThreshold }),
            requirement,
            progress: 0,
            reward: { gold, metaXp, items },
            status: 'available' as const,
            generatedAt: now,
            expiresAt: now + QUEST_CONFIG.expiryHours * QUEST_CONFIG.msPerHour,
        }
    })
}

import type { QuestTemplate } from './types'

export const COMPLETE_RUNS_TEMPLATES: QuestTemplate[] = [
    { type: 'complete_runs', difficulty: 'easy', title: 'First Expedition', descriptionFn: req => `Complete ${req} dungeon run${req > 1 ? 's' : ''} (victory or retreat).`, base: 0.15, exp: 0.6, goldPerReq: 150, xpPerReq: 30, rarityPool: ['common', 'uncommon', 'rare'] },
    { type: 'complete_runs', difficulty: 'medium', title: 'Seasoned Delver', descriptionFn: req => `Complete ${req} dungeon runs.`, base: 0.15, exp: 0.6, goldPerReq: 180, xpPerReq: 40, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
    { type: 'complete_runs', difficulty: 'hard', title: 'Veteran Adventurer', descriptionFn: req => `Complete ${req} dungeon runs without retreating.`, base: 0.15, exp: 0.6, goldPerReq: 230, xpPerReq: 55, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'], templateMinFloor: 90 },
    { type: 'complete_runs_floor', difficulty: 'medium', title: 'Relentless Delver', descriptionFn: (req, floor) => `Complete ${req} dungeon runs, each reaching at least floor ${floor}.`, base: 0.15, exp: 0.6, goldPerReq: 200, xpPerReq: 45, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'], templateMinFloor: 15, floorThresholdPct: 0.7 },
]

import type { QuestTemplate } from './types'

export const DEFEAT_BOSSES_TEMPLATES: QuestTemplate[] = [
    { type: 'defeat_bosses', difficulty: 'easy', title: 'Monster Hunter', descriptionFn: req => `Defeat ${req} dungeon boss${req > 1 ? 'es' : ''}.`, base: 0.4, exp: 0.8, goldPerReq: 200, xpPerReq: 40, rarityPool: ['common', 'uncommon', 'rare'] },
    { type: 'defeat_bosses', difficulty: 'medium', title: 'Boss Slayer', descriptionFn: req => `Bring down ${req} fearsome bosses in the dungeon depths.`, base: 0.4, exp: 0.8, goldPerReq: 250, xpPerReq: 50, rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'] },
    { type: 'defeat_bosses', difficulty: 'hard', title: 'Champion of the Realm', descriptionFn: req => `Slay ${req} powerful bosses to prove your guild's legend.`, base: 0.4, exp: 0.8, goldPerReq: 320, xpPerReq: 65, rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'] },
]

import type { QuestTemplate } from './types'

// Tracks total eventsCompleted across runs — any map node resolved counts.
// Requirements scale with party power via base * power^0.8.
// At power  5: easy ~90,  medium ~175,  hard ~350
// At power 10: easy ~160, medium ~315,  hard ~630
// At power 20: easy ~275, medium ~550,  hard ~1100
export const COMPLETE_ENCOUNTERS_TEMPLATES: QuestTemplate[] = [
  {
    type: 'complete_encounters',
    difficulty: 'easy',
    title: 'Path Surveyor',
    descriptionFn: req => `Complete ${req} encounters across any dungeon runs.`,
    base: 25,
    exp: 0.8,
    goldPerReq: 5,
    xpPerReq: 1.0,
    rarityPool: ['common', 'uncommon', 'rare'],
  },
  {
    type: 'complete_encounters',
    difficulty: 'medium',
    title: 'Dungeon Navigator',
    descriptionFn: req => `Complete ${req} encounters across your dungeon expeditions.`,
    base: 25,
    exp: 0.8,
    goldPerReq: 6,
    xpPerReq: 1.2,
    rarityPool: ['uncommon', 'rare', 'veryRare', 'magical'],
  },
  {
    type: 'complete_encounters',
    difficulty: 'hard',
    title: 'Pathfinder Supreme',
    descriptionFn: req => `Navigate and resolve ${req} encounters in the dungeon depths.`,
    base: 25,
    exp: 0.8,
    goldPerReq: 8,
    xpPerReq: 1.5,
    rarityPool: ['rare', 'veryRare', 'magical', 'elite', 'epic', 'legendary'],
  },
]

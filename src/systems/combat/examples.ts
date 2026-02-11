/**
 * Boss Combat System - Example Usage
 * 
 * This file demonstrates how to use the boss combat system
 */

import type { DungeonEvent, Dungeon } from '@/types'
import {
    calculateDanger,
    applyFirstBossScaling,
    calculateInitialBossStats,
    recalculateDynamicBossStats,
    getBossBaseStats,
    initializeBossCombatState,
} from './index'

// Example: Floor Boss at Floor 5, 20 events completed
function exampleFloorBoss() {
    const mockBossEvent: DungeonEvent = {
        id: 'floor-boss-5',
        type: 'boss',
        title: 'Floor Guardian',
        description: 'A powerful guardian blocks your path!',
        choices: [],
        depth: 5,
        bossAbilities: [],
        attackPatterns: [],
    }

    const mockDungeon: Partial<Dungeon> = {
        floor: 5,
        depth: 20,
    }

    // Calculate danger at combat start
    const initialDanger = calculateDanger(5, 20, 0)
    console.log('Initial danger:', initialDanger) // 5 + (20 * 0.05) + 0 = 6.0

    // Calculate initial boss stats
    const initialStats = calculateInitialBossStats(
        mockBossEvent,
        mockDungeon.floor!,
        mockDungeon.depth!
    )
    console.log('Initial stats:', initialStats)
    // HP: 200 * (1 + (6.0-1) * 0.15) = 200 * 1.75 = 350
    // Attack: 30 * (1 + (6.0-1) * 0.12) = 30 * 1.60 = 48

    // Calculate stats after 10 turns
    const baseStats = getBossBaseStats(mockBossEvent)
    const statsAtTurn10 = recalculateDynamicBossStats(
        baseStats,
        mockDungeon.floor!,
        mockDungeon.depth!,
        10,
        initialStats.currentHp,
        initialStats.maxHp
    )
    console.log('Stats at turn 10:', statsAtTurn10)
    // Danger: 5 + (20 * 0.05) + (10 * 0.05) = 6.5
    // Attack: 30 * (1 + (6.5-1) * 0.12) = 30 * 1.66 = 49.8 ≈ 50
    // Note: maxHp stays 350!
}

// Example: First Boss (Floor 1) with Tutorial Scaling
function exampleFirstBoss() {
    const mockBossEvent: DungeonEvent = {
        id: 'first-boss',
        type: 'boss',
        title: 'Goblin Chief',
        description: 'Your first boss encounter!',
        choices: [],
        depth: 1,
    }

    const mockDungeon: Partial<Dungeon> = {
        floor: 1,
        depth: 0,
    }

    // Calculate danger
    const rawDanger = calculateDanger(1, 0, 0)
    console.log('Raw danger:', rawDanger) // 1.0

    // Apply first boss scaling (50% reduction)
    const scaledDanger = applyFirstBossScaling(rawDanger, 1)
    console.log('Scaled danger:', scaledDanger) // 0.5

    const stats = calculateInitialBossStats(
        mockBossEvent,
        mockDungeon.floor!,
        mockDungeon.depth!
    )
    console.log('First boss stats:', stats)
    // HP: 200 * (1 + (0.5-1) * 0.15) = 200 * 0.925 = 185 (easier than normal!)
}

// Example: Zone Boss with Custom Base Stats
function exampleZoneBossWithCustomStats() {
    const mockBossEvent: DungeonEvent = {
        id: 'zone-boss-10-custom',
        type: 'boss',
        title: 'Ancient Dragon',
        description: 'A legendary dragon appears!',
        choices: [],
        depth: 10,
        isZoneBoss: true,
        zoneBossFloor: 10,
        customBaseStats: {
            baseHp: 1500, // Override zone boss HP (default 500)
            baseAttack: 80, // Override attack (default 50)
            baseSpeed: 40, // Very fast! (default 20)
        },
    }

    const mockDungeon: Partial<Dungeon> = {
        floor: 10,
        depth: 50,
    }

    const stats = calculateInitialBossStats(
        mockBossEvent,
        mockDungeon.floor!,
        mockDungeon.depth!
    )
    console.log('Custom zone boss stats:', stats)
    // Uses custom base stats instead of tier defaults
    // HP: 1500 * (1 + (12.5-1) * 0.15) = 1500 * 2.725 = 4087.5 ≈ 4088
}

// Example: Full Combat State Initialization
function exampleCombatStateInit() {
    const mockBossEvent: DungeonEvent = {
        id: 'test-boss',
        type: 'boss',
        title: 'Test Boss',
        description: 'A test boss for demonstration',
        choices: [],
        depth: 5,
        bossAbilities: [],
        attackPatterns: [],
        healPerTurn: 25, // Regenerating boss
    }

    const mockDungeon = {
        floor: 5,
        depth: 20,
        eventsThisFloor: 5,
        eventsRequiredThisFloor: 5,
        currentEvent: null,
        eventHistory: [],
        eventLog: [],
        gold: 100,
        inventory: [],
    } as Dungeon

    const combatState = initializeBossCombatState(mockBossEvent, mockDungeon)
    console.log('Initialized combat state:', combatState)
    // All fields initialized, ready for combat!
}

// Uncomment to run examples
// exampleFloorBoss()
// exampleFirstBoss()
// exampleZoneBossWithCustomStats()
// exampleCombatStateInit()

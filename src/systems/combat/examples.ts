/**
 * Boss Combat System - Example Usage
 * 
 * This file demonstrates how to use the boss combat system
 */

import type { DungeonEvent, Dungeon, Hero } from '@/types'
import {
    calculateDanger,
    applyFirstBossScaling,
    calculateInitialBossStats,
    recalculateDynamicBossStats,
    getBossBaseStats,
    initializeBossCombatState,
    startCombatRound,
    processBossTurn,
    processRoundEnd,
    checkVictory,
    checkDefeat,
    getCurrentCombatant,
    advanceTurn,
    executeAttack,
    executeDefend,
    processHeroTurn,
    calculateConsumableActionCost,
    validateActionSequence,
    getConsumableActionCost,
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

// Example: Full Combat Flow
function exampleCombatFlow() {
    const mockBossEvent: DungeonEvent = {
        id: 'example-boss',
        type: 'boss',
        title: 'Example Boss',
        description: 'A test boss',
        choices: [],
        depth: 5,
        bossAbilities: [],
        attackPatterns: [
            {
                id: 'basic-attack',
                name: 'Basic Attack',
                weight: 100,
                attackType: 'single',
                damageMultiplier: 1.0,
                description: 'A simple attack',
            },
        ],
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

    const mockParty: (Hero | null)[] = [
        {
            id: 'hero-1',
            name: 'Warrior',
            stats: { hp: 100, maxHp: 100, attack: 20, defense: 15, speed: 10, luck: 5, wisdom: 5, charisma: 5 },
            isAlive: true,
        } as Hero,
        null,
        null,
        null,
    ]

    // Initialize combat
    const combatState = initializeBossCombatState(mockBossEvent, mockDungeon)
    startCombatRound(combatState, mockParty)

    console.log('=== Combat Round 1 ===')
    console.log('Turn order:', combatState.turnOrder.map(c => c.id))

    // Simulate combat loop
    let roundCount = 0
    while (roundCount < 3) {
        // Check current combatant
        const current = getCurrentCombatant(combatState)
        if (!current) {
            // Round ended
            console.log('--- Round End ---')
            const roundEnd = processRoundEnd(combatState, mockParty)
            console.log('Status effects:', roundEnd.effectsProcessed)
            roundCount++
            continue
        }

        if (current.type === 'boss') {
            console.log('Boss turn:')
            const bossTurn = processBossTurn(combatState, mockParty)
            console.log('  Healing:', bossTurn.passiveHealing)
            console.log('  Abilities:', bossTurn.abilitiesUsed.length)
            console.log('  Attack:', bossTurn.attackResult?.pattern.name)
        } else {
            console.log(`Hero ${current.id} turn (skipped for example)`)
        }

        // Advance turn
        advanceTurn(combatState)

        // Check victory/defeat
        if (checkVictory(combatState)) {
            console.log('=== VICTORY ===')
            break
        }
        if (checkDefeat(mockParty)) {
            console.log('=== DEFEAT ===')
            break
        }
    }
}

// Uncomment to run examples
// exampleFloorBoss()
// exampleFirstBoss()
// exampleZoneBossWithCustomStats()
// exampleCombatStateInit()
// exampleCombatFlow()
// exampleHeroTurn()
// exampleActionEconomy()

// Example: Hero Turn Actions
function exampleHeroTurn() {
    const mockHero: Hero = {
        id: 'hero-1',
        name: 'Warrior',
        stats: {
            hp: 80,
            maxHp: 100,
            attack: 20,
            defense: 15,
            speed: 10,
            luck: 5,
            wisdom: 5,
            charisma: 5
        },
        isAlive: true,
        slots: {
            weapon: null,
            armor: null,
            consumable1: {
                id: 'potion-1',
                name: 'Health Potion',
                description: 'Heals 50 HP',
                type: 'consumable',
                rarity: 'common',
                value: 25,
                icon: 'GiHealthPotion',
                stats: {},
                consumableType: 'potion',
                effects: [{ type: 'heal', value: 50, target: 'self' }],
                usableInCombat: true,
                usableOutOfCombat: true,
            } as any,
        },
        abilities: [],
        activeEffects: [],
        class: {} as any,
        level: 1,
        xp: 0,
    } as Hero

    const mockCombatState = {
        currentHp: 200,
        maxHp: 350,
        baseStats: { attack: 30, defense: 10, speed: 15, luck: 10 },
        abilities: [],
        attackPatterns: [],
        currentPhase: 1,
        combatDepth: 5,
        floor: 5,
        depth: 20,
        itemCooldowns: new Map(),
        abilityCooldowns: new Map(),
        activeEffects: [],
        turnOrder: [],
        currentTurnIndex: 0,
    } as any

    // Example 1: Hero attacks
    console.log('=== Hero Attack ===')
    const attackResult = executeAttack(mockHero, mockCombatState)
    console.log('Damage dealt:', attackResult.damage)
    console.log('Boss HP remaining:', mockCombatState.currentHp)

    // Example 2: Hero defends
    console.log('\n=== Hero Defend ===')
    const defendResult = executeDefend(mockHero, mockCombatState)
    console.log('Defense buff:', defendResult.effects[0].value)
    console.log('Combat effects:', mockHero.combatEffects)

    // Example 3: Hero uses consumable
    console.log('\n=== Hero Uses Consumable ===')
    const context = {
        hero: mockHero,
        combatState: mockCombatState,
        party: [mockHero, null, null, null],
        actionCostUsed: 0,
    }

    const actions = [
        {
            type: 'useItem' as const,
            heroId: mockHero.id,
            item: mockHero.slots.consumable1 as any,
            itemSlot: 'consumable1',
        },
        {
            type: 'attack' as const,
            heroId: mockHero.id,
        },
    ]

    const turnResult = processHeroTurn(context, actions)
    console.log('Actions performed:', turnResult.actions.length)
    console.log('Total action cost:', turnResult.totalActionCost)
    console.log('Hero HP after heal:', mockHero.stats.hp)
}

// Example: Action Economy
function exampleActionEconomy() {
    const healingPotion = {
        effects: [{ type: 'heal', value: 50 }],
    } as any

    const revivePotion = {
        effects: [{ type: 'revive', value: 50 }],
    } as any

    console.log('=== Action Economy ===')
    console.log('Healing potion cost:', getConsumableActionCost(healingPotion)) // 0.33
    console.log('Revive potion cost:', getConsumableActionCost(revivePotion)) // 1.0

    // Validate action sequence
    const validSequence = [
        { type: 'useItem' as const, heroId: 'h1', item: healingPotion },
        { type: 'useItem' as const, heroId: 'h1', item: healingPotion },
        { type: 'useItem' as const, heroId: 'h1', item: healingPotion },
        { type: 'attack' as const, heroId: 'h1' },
    ]

    const validation = validateActionSequence(validSequence)
    console.log('\nValid sequence (3 potions + attack):', validation.valid)

    // Calculate cost
    const cost = calculateConsumableActionCost([
        healingPotion,
        healingPotion,
        healingPotion,
    ])
    console.log('Total consumable cost:', cost.totalCost) // 0.99
    console.log('Total action cost with attack:', cost.totalCost + 1.0) // 1.99 (within 2.0 limit)

    // Invalid sequence (too many main actions)
    const invalidSequence = [
        { type: 'attack' as const, heroId: 'h1' },
        { type: 'defend' as const, heroId: 'h1' },
    ]
    const invalidValidation = validateActionSequence(invalidSequence)
    console.log('\nInvalid sequence (attack + defend):', invalidValidation)
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { GameState, Hero, EventChoice, Item, ItemSlot } from '@/types'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome, resolveChoiceOutcome } from '@systems/events/eventResolver'
import { GAME_CONFIG } from '@/config/gameConfig'
import { calculateMaxHp, createHero } from '@/utils/heroUtils'
import { equipItem, unequipItem, sellItem } from '@/systems/loot/inventoryManager'
import { repairItemNames } from '@/systems/loot/lootGenerator'
import { migrateGameState } from '@/utils/migration'

/**
 * Create a backup of the current state
 */
function createBackup(name: string): void {
  try {
    const current = localStorage.getItem(name)
    if (current) {
      const timestamp = Date.now()
      localStorage.setItem(`${name}-backup-${timestamp}`, current)
      
      // Keep only the last 5 backups
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${name}-backup-`))
        .sort()
      
      while (backupKeys.length > 5) {
        const oldestKey = backupKeys.shift()
        if (oldestKey) localStorage.removeItem(oldestKey)
      }
      
      console.log(`[Backup] Created backup: ${name}-backup-${timestamp}`)
    }
  } catch (error) {
    console.error('[Backup] Failed to create backup:', error)
  }
}

/**
 * List available backups
 */
function listBackups(name: string): string[] {
  return Object.keys(localStorage)
    .filter(key => key.startsWith(`${name}-backup-`))
    .sort()
    .reverse()
}

/**
 * Restore from a backup
 */
function restoreBackup(name: string, backupKey: string): boolean {
  try {
    const backup = localStorage.getItem(backupKey)
    if (backup) {
      localStorage.setItem(name, backup)
      console.log(`[Backup] Restored from: ${backupKey}`)
      return true
    }
    return false
  } catch (error) {
    console.error('[Backup] Failed to restore backup:', error)
    return false
  }
}

/**
 * Sanitize hero stats to fix any NaN values - mutates the hero in place
 */
function sanitizeHeroStats(hero: Hero): Hero {
  const maxHp = calculateMaxHp(hero.level, hero.class.baseStats.defense)
  
  if (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp)) {
    hero.stats.maxHp = maxHp
    hero.stats.hp = isNaN(hero.stats.hp) ? maxHp : Math.min(hero.stats.hp, maxHp)
  }
  
  // Fix any other NaN stats
  if (isNaN(hero.stats.attack)) hero.stats.attack = hero.class.baseStats.attack
  if (isNaN(hero.stats.defense)) hero.stats.defense = hero.class.baseStats.defense
  if (isNaN(hero.stats.speed)) hero.stats.speed = hero.class.baseStats.speed
  if (isNaN(hero.stats.luck)) hero.stats.luck = hero.class.baseStats.luck
  if (hero.stats.magicPower !== undefined && isNaN(hero.stats.magicPower)) {
    hero.stats.magicPower = hero.class.baseStats.magicPower
  }
  
  return hero
}

/**
 * Middleware that sanitizes party state after every mutation AND on subscribe
 */
const sanitizeMiddleware = <T extends GameState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) => {
    // Subscribe to changes and sanitize on every access
    api.subscribe(() => {
      const state = get() as GameState
      if (state.party?.length > 0) {
        const needsSanitization = state.party.some(hero => 
          hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp))
        )
        if (needsSanitization) {
          set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats } }) : null) } as Partial<T>)
        }
      }
    })

    return config(
      (args) => {
        set(args)
        const state = get() as GameState
        if (state.party?.length > 0) {
          const needsSanitization = state.party.some(hero => 
            hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp))
          )
          if (needsSanitization) {
            set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats } }) : null) } as Partial<T>)
          }
        }
      },
      get,
      api
    )
  }

/**
 * Apply death penalty to a party of heroes
 */
function applyPenaltyToParty(party: (Hero | null)[]): (Hero | null)[] {
  console.log('applyPenaltyToParty called with party:', party.map(h => h ? { name: h.name, level: h.level } : null))
  
  return party.map(hero => {
    if (!hero) return null
    
    const newHero = { ...hero }
    
    switch (GAME_CONFIG.deathPenalty.type) {
      case 'halve-levels':
        // Halve level (min 1)
        { const oldLevel = hero.level
        newHero.level = Math.max(1, Math.floor(hero.level / 2))
        console.log(`Halving level for ${hero.name}: ${oldLevel} → ${newHero.level}`)
        newHero.xp = 0
        // Recalculate stats based on new level
        const levelDifference = hero.level - newHero.level
        newHero.stats = { ...hero.stats }
        newHero.stats.attack = Math.max(hero.class.baseStats.attack, hero.stats.attack - (levelDifference * GAME_CONFIG.statGains.attack))
        newHero.stats.defense = Math.max(hero.class.baseStats.defense, hero.stats.defense - (levelDifference * GAME_CONFIG.statGains.defense))
        newHero.stats.speed = Math.max(hero.class.baseStats.speed, hero.stats.speed - (levelDifference * GAME_CONFIG.statGains.speed))
        newHero.stats.luck = Math.max(hero.class.baseStats.luck, hero.stats.luck - (levelDifference * GAME_CONFIG.statGains.luck))
        newHero.stats.maxHp = calculateMaxHp(newHero.level, hero.class.baseStats.defense)
        newHero.stats.hp = newHero.stats.maxHp
        newHero.isAlive = true // Revive on penalty
        break }
        
      case 'reset-levels':
        // Reset to level 1
        newHero.level = 1
        newHero.xp = 0
        newHero.stats = {
          hp: calculateMaxHp(1, hero.class.baseStats.defense),
          maxHp: calculateMaxHp(1, hero.class.baseStats.defense),
          attack: hero.class.baseStats.attack,
          defense: hero.class.baseStats.defense,
          speed: hero.class.baseStats.speed,
          luck: hero.class.baseStats.luck,
          magicPower: hero.class.baseStats.magicPower,
        }
        break
        
      case 'lose-equipment':
        // Keep levels but reset equipment
        newHero.equipment = {
          weapon: null,
          armor: null,
          helmet: null,
          boots: null,
          accessory1: null,
          accessory2: null,
        }
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break
        
      case 'none':
      default:
        // Just revive with full HP
        newHero.stats = { ...hero.stats }
        newHero.stats.hp = newHero.stats.maxHp
        break
    }
    
    newHero.isAlive = true
    return sanitizeHeroStats(newHero)
  })
}

interface GameStore extends GameState {
  // Actions
  addHero: (hero: Hero, slotIndex?: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addHeroByClass: (heroClass: any, slotIndex?: number) => void
  removeHero: (heroId: string) => void
  updateHero: (heroId: string, updates: Partial<Hero>) => void
  startDungeon: (startingFloor?: number, alkahestCost?: number) => void
  advanceDungeon: () => void
  selectChoice: (choice: EventChoice) => void
  endGame: () => void
  victoryGame: () => void
  retreatFromDungeon: () => void
  resetGame: () => void
  applyPenalty: () => void
  repairParty: () => void
  // Inventory actions
  equipItemToHero: (heroId: string, item: Item, slot: ItemSlot) => void
  unequipItemFromHero: (heroId: string, slot: ItemSlot) => Item | null
  sellItemForGold: (item: Item) => void
  equipItemFromBank: (heroId: string, item: Item, slot: ItemSlot) => void
  moveItemToBank: (item: Item) => void
  removeItemFromBank: (itemId: string) => void
  expandBankStorage: (slots: number) => void
  keepOverflowItem: (itemId: string) => void
  discardOverflowItem: (itemId: string) => void
  discardItems: (itemIds: string[]) => void
  clearOverflow: () => void
  // Backup/Recovery actions
  listBackups: () => string[]
  restoreFromBackup: (backupKey: string) => boolean
  exportSave: () => void
  importSave: (jsonString: string) => boolean
}

const initialState: GameState = {
  party: Array(GAME_CONFIG.party.maxSize).fill(null),
  heroRoster: [],
  dungeon: {
    depth: 0,
    floor: 0,
    eventsThisFloor: 0,
    eventsRequiredThisFloor: 4,
    currentEvent: null,
    eventHistory: [],
    eventLog: [],
    gold: 0,
    inventory: [],
    isNextEventBoss: false,
    bossType: null,
  },
  bankGold: 0,
  alkahest: 0,
  bankInventory: [],
  bankStorageSlots: GAME_CONFIG.bank.startingSlots,
  overflowInventory: [],
  metaXp: 0,
  isGameOver: false,
  isPaused: false,
  hasPendingPenalty: false,
  activeRun: null,
  runHistory: [],
  lastOutcome: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    sanitizeMiddleware(
      (set, _get) => ({
        ...initialState,
  
  addHero: (hero, slotIndex) => 
    set((state) => {
      // If no slot specified, find first empty slot
      const targetIndex = slotIndex !== undefined ? slotIndex : state.party.findIndex(h => h === null)
      if (targetIndex === -1 || targetIndex >= state.party.length) return state // Party full or invalid slot
      if (state.party[targetIndex] !== null) return state // Slot occupied
      
      // Add to roster if not already there
      const existingInRoster = state.heroRoster.find(h => h.id === hero.id)
      const newParty = [...state.party]
      newParty[targetIndex] = hero
      
      return {
        party: newParty,
        heroRoster: existingInRoster ? state.heroRoster : [...state.heroRoster, hero]
      }
    }),
  
  addHeroByClass: (heroClass, slotIndex) => 
    set((state) => {
      // If no slot specified, find first empty slot
      const targetIndex = slotIndex !== undefined ? slotIndex : state.party.findIndex(h => h === null)
      if (targetIndex === -1 || targetIndex >= state.party.length) return state // Party full or invalid slot
      if (state.party[targetIndex] !== null) return state // Slot occupied
      
      // Find existing hero of this class in roster that's not currently in party
      const existingHero = state.heroRoster.find(
        h => h.class.id === heroClass.id && !state.party.some(p => p !== null && p.id === h.id)
      )
      
      const newParty = [...state.party]
      
      if (existingHero) {
        // Reuse existing hero
        newParty[targetIndex] = existingHero
        return {
          party: newParty
        }
      } else {
        // Create new hero
        const newHero = createHero(heroClass, heroClass.name)
        newParty[targetIndex] = newHero
        return {
          party: newParty,
          heroRoster: [...state.heroRoster, newHero]
        }
      }
    }),
  
  removeHero: (heroId) => 
    set((state) => {
      const newParty = state.party.map(h => h?.id === heroId ? null : h)
      return { party: newParty }
    }),
  
  updateHero: (heroId, updates) => 
    set((state) => {
      const updatedParty = state.party.map(h => 
        h?.id === heroId ? { ...h, ...updates } : h
      )
      const updatedRoster = state.heroRoster.map(h => 
        h.id === heroId ? { ...h, ...updates } : h
      )
      return {
        party: updatedParty,
        heroRoster: updatedRoster
      }
    }),
  
  startDungeon: (startingFloor = 1, alkahestCost = 0) => 
    set((state) => {
      // Deduct alkahest cost
      const newAlkahest = Math.max(0, state.alkahest - alkahestCost)
      
      // Penalty should already be applied by endGame
      // Revive all party members and full heal at dungeon start
      const healedParty = state.party.map(hero => hero ? ({
        ...hero,
        isAlive: true,
        stats: {
          ...hero.stats,
          hp: hero.stats.maxHp
        }
      }) : null)
      
      // Create a new run
      const newRun: import('@/types').Run = {
        id: `run-${Date.now()}`,
        startDate: Date.now(),
        startDepth: startingFloor,
        finalDepth: startingFloor,
        startFloor: startingFloor,
        finalFloor: startingFloor,
        result: 'active',
        goldEarned: 0,
        goldSpent: 0,
        eventsCompleted: 0,
        enemiesDefeated: 0,
        itemsFound: 0,
        damageDealt: 0,
        damageTaken: 0,
        healingReceived: 0,
        xpGained: 0,
        xpMentored: 0,
        metaXpGained: 0,
        heroesUsed: state.party.filter((h): h is Hero => h !== null).map(h => ({
          name: h.name,
          class: h.class.name,
          level: h.level
        })),
        // New detailed statistics
        combatEvents: 0,
        treasureEvents: 0,
        restEvents: 0,
        bossesDefeated: 0,
        merchantVisits: 0,
        trapsTriggered: 0,
        choiceEvents: 0,
        totalLevelsGained: 0,
        itemsDiscarded: 0,
        alkahestGained: 0,
        highestDamageSingleHit: 0,
        timesRevived: 0,
      }
      
      // Roll random number of events for first floor
      const eventsRequired = Math.floor(
        Math.random() * (GAME_CONFIG.dungeon.maxEventsPerFloor - GAME_CONFIG.dungeon.minEventsPerFloor + 1)
      ) + GAME_CONFIG.dungeon.minEventsPerFloor
      
      const event = getNextEvent(startingFloor, startingFloor, false, false, [])
      return {
        party: healedParty,
        alkahest: newAlkahest,
        dungeon: { 
          depth: startingFloor,
          floor: startingFloor,
          eventsThisFloor: 0,
          eventsRequiredThisFloor: eventsRequired,
          currentEvent: event,
          eventHistory: event ? [event.id] : [],
          eventLog: [],
          gold: 0, // Reset gold for each new run
          inventory: [], // Reset inventory for each new run
          isNextEventBoss: false,
        },
        isGameOver: false,
        hasPendingPenalty: false,
        activeRun: newRun,
        lastOutcome: null,
      }
    }),
  
  advanceDungeon: () => 
    set((state) => {
      const newDepth = state.dungeon.depth + 1
      const newEventsThisFloor = state.dungeon.eventsThisFloor + 1
      
      // Check if we just completed a boss (which means we're completing the floor)
      // We use the stored bossType flag which was set when the boss event was generated
      const completingFloor = state.dungeon.bossType !== null
      const newFloor = completingFloor ? state.dungeon.floor + 1 : state.dungeon.floor
      const resetEvents = completingFloor ? 0 : newEventsThisFloor
      
      // Roll new random target for next floor
      const newEventsRequired = completingFloor 
        ? Math.floor(
            Math.random() * (GAME_CONFIG.dungeon.maxEventsPerFloor - GAME_CONFIG.dungeon.minEventsPerFloor + 1)
          ) + GAME_CONFIG.dungeon.minEventsPerFloor
        : state.dungeon.eventsRequiredThisFloor
      
      // Check if we've completed the required events (next event should be boss)
      // eventsRequiredThisFloor is the number of events BEFORE the boss, so boss comes when we exceed that
      const isNextEventBoss = resetEvents > newEventsRequired
      
      // Check if this is a major boss (zone completion)
      const isMajorBoss = isNextEventBoss && (newFloor % GAME_CONFIG.dungeon.majorBossInterval === 0)
      
      // Check for victory - completed max floors
      if (newFloor > GAME_CONFIG.dungeon.maxFloors) {
        // Player has completed all floors, trigger victory
        // This will be handled by calling victoryGame externally
        return state
      }
      
      const event = getNextEvent(newDepth, newFloor, isNextEventBoss, isMajorBoss, state.dungeon.eventHistory)
      
      // Update active run
      const updatedRun = state.activeRun ? {
        ...state.activeRun,
        finalDepth: newDepth,
        finalFloor: newFloor,
        eventsCompleted: state.activeRun.eventsCompleted + 1
      } : null
      
      return {
        dungeon: { 
          ...state.dungeon, 
          depth: newDepth,
          floor: newFloor,
          eventsThisFloor: completingFloor ? 0 : resetEvents,
          eventsRequiredThisFloor: newEventsRequired,
          isNextEventBoss,
          bossType: isNextEventBoss ? (isMajorBoss ? 'major' : 'floor') : null,
          currentEvent: event,
          eventHistory: event ? [...state.dungeon.eventHistory, event.id] : state.dungeon.eventHistory
        },
        activeRun: updatedRun,
        lastOutcome: null
      }
    }),
  
  selectChoice: (choice) =>
    set((state) => {
      if (!state.dungeon.currentEvent || !state.activeRun) {
        return state
      }

      const currentEvent = state.dungeon.currentEvent

      // First resolve which outcome to use (handles weighted/success-fail/single)
      const selectedOutcome = resolveChoiceOutcome(choice, state.party)
      
      const { updatedParty, updatedGold, metaXpGained, xpMentored, resolvedOutcome } = resolveEventOutcome(
        selectedOutcome,
        state.party,
        state.dungeon
      )
      
      // Calculate statistics from effects
      const damageDealt = 0
      let damageTaken = 0
      let healingReceived = 0
      let xpGained = 0
      let revivals = 0
      const itemsFound = resolvedOutcome.items.length
      const isCombatEvent = currentEvent.type === 'combat' || currentEvent.type === 'boss'
      const heroesAffected: Set<string> = new Set()
      
      let highestSingleDamage = 0
      resolvedOutcome.effects.forEach(effect => {
        if (effect.type === 'damage' && effect.value) {
          // Damage to party is damage taken, damage from party is damage dealt
          if (isCombatEvent) {
            // In combat events, assume all damage effects are damage taken by party
            const totalDamage = effect.value * (effect.target?.length || 1)
            damageTaken += totalDamage
            if (effect.value > highestSingleDamage) {
              highestSingleDamage = effect.value
            }
          }
          effect.target?.forEach(heroId => {
            const hero = state.party.find(h => h?.id === heroId)
            if (hero) heroesAffected.add(hero.name)
          })
        } else if (effect.type === 'heal' && effect.value) {
          healingReceived += effect.value * (effect.target?.length || 1)
          effect.target?.forEach(heroId => {
            const hero = state.party.find(h => h?.id === heroId)
            if (hero) heroesAffected.add(hero.name)
          })
        } else if (effect.type === 'xp' && effect.value) {
          xpGained += effect.value
        } else if (effect.type === 'revive') {
          revivals += effect.target?.length || 1
          effect.target?.forEach(heroId => {
            const hero = state.party.find(h => h?.id === heroId)
            if (hero) heroesAffected.add(hero.name)
          })
        }
      })
      
      // Count level-ups
      let totalLevelsGained = 0
      updatedParty.forEach((hero, idx) => {
        if (hero && state.party[idx]) {
          const levelDiff = hero.level - state.party[idx]!.level
          if (levelDiff > 0) {
            totalLevelsGained += levelDiff
            heroesAffected.add(hero.name)
          }
        }
      })

      // Create event log entry
      const eventLogEntry: import('@/types').EventLogEntry = {
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        eventType: currentEvent.type,
        floor: state.dungeon.floor,
        depth: state.dungeon.depth,
        choiceMade: choice.text,
        outcomeText: resolvedOutcome.text,
        goldChange: updatedGold - state.dungeon.gold,
        itemsGained: resolvedOutcome.items.map(item => item.name),
        damageDealt,
        damageTaken,
        healingReceived,
        xpGained,
        heroesAffected: Array.from(heroesAffected)
      }
      
      // Check if wiped
      const isWiped = updatedParty.every(h => h !== null && !h.isAlive)
      
      // Capture death details if party wiped
      const deathDetails = isWiped ? {
        eventTitle: currentEvent.title,
        eventType: currentEvent.type,
        heroDamage: resolvedOutcome.effects
          .filter(effect => effect.type === 'damage' && effect.target)
          .flatMap(effect => 
            effect.target!.map(heroId => {
              const hero = state.party.find(h => h?.id === heroId)
              return {
                heroName: hero?.name || 'Unknown',
                damageReceived: effect.value || 0
              }
            })
          )
      } : undefined
      
      // Save pre-penalty levels when party wipes (for display later)
      const prePenaltyLevels = isWiped ? state.party.filter((h): h is Hero => h !== null).map(h => ({
        id: h.id,
        name: h.name,
        class: h.class.name,
        level: h.level
      })) : null
      
      if (isWiped && prePenaltyLevels) {
        console.log('Party wiped! Saving pre-penalty levels:', prePenaltyLevels)
      }
      
      // Track gold changes in active run
      const goldDiff = updatedGold - state.dungeon.gold
      
      // Track event type statistics
      const eventTypeStats: Partial<import('@/types').Run> = {}
      switch (currentEvent.type) {
        case 'combat':
          eventTypeStats.combatEvents = (state.activeRun.combatEvents ?? 0) + 1
          break
        case 'treasure':
          eventTypeStats.treasureEvents = (state.activeRun.treasureEvents ?? 0) + 1
          break
        case 'rest':
          eventTypeStats.restEvents = (state.activeRun.restEvents ?? 0) + 1
          break
        case 'merchant':
          eventTypeStats.merchantVisits = (state.activeRun.merchantVisits ?? 0) + 1
          break
        case 'trap':
          eventTypeStats.trapsTriggered = (state.activeRun.trapsTriggered ?? 0) + 1
          break
        case 'choice':
          eventTypeStats.choiceEvents = (state.activeRun.choiceEvents ?? 0) + 1
          break
        case 'boss':
          eventTypeStats.bossesDefeated = (state.activeRun.bossesDefeated ?? 0) + (isWiped ? 0 : 1)
          eventTypeStats.combatEvents = (state.activeRun.combatEvents ?? 0) + 1
          break
      }

      const updatedRun = {
        ...state.activeRun,
        // Patch legacy runs with missing fields
        enemiesDefeated: (state.activeRun.enemiesDefeated ?? 0) + (isCombatEvent && !isWiped ? 1 : 0),
        itemsFound: (state.activeRun.itemsFound ?? 0) + itemsFound,
        damageDealt: (state.activeRun.damageDealt ?? 0) + damageDealt,
        damageTaken: (state.activeRun.damageTaken ?? 0) + damageTaken,
        healingReceived: (state.activeRun.healingReceived ?? 0) + healingReceived,
        xpGained: (state.activeRun.xpGained ?? 0) + xpGained,
        totalLevelsGained: (state.activeRun.totalLevelsGained ?? 0) + totalLevelsGained,
        timesRevived: (state.activeRun.timesRevived ?? 0) + revivals,
        highestDamageSingleHit: Math.max(state.activeRun.highestDamageSingleHit ?? 0, highestSingleDamage),
        // Update with new values
        goldEarned: state.activeRun.goldEarned + (goldDiff > 0 ? goldDiff : 0),
        goldSpent: state.activeRun.goldSpent + (goldDiff < 0 ? -goldDiff : 0),
        xpMentored: (state.activeRun.xpMentored ?? 0) + xpMentored,
        metaXpGained: (state.activeRun.metaXpGained ?? 0) + metaXpGained,
        ...eventTypeStats,
        ...(prePenaltyLevels ? { heroesUsed: prePenaltyLevels } : {}), // Store pre-penalty levels
        ...(deathDetails ? { deathDetails } : {}) // Store death details if party wiped
      }
      
      return {
        metaXp: state.metaXp + metaXpGained,
        party: updatedParty,
        dungeon: {
          ...state.dungeon,
          gold: updatedGold,
          inventory: [...state.dungeon.inventory, ...resolvedOutcome.items], // Add found items to inventory
          eventLog: [...state.dungeon.eventLog, eventLogEntry],
          currentEvent: null // Clear current event after resolution
        },
        isGameOver: isWiped,
        lastOutcome: resolvedOutcome,
        activeRun: updatedRun
      }
    }),
  
  endGame: () => 
    set((state) => {
      console.log('endGame called, activeRun result:', state.activeRun?.result)
      
      // Prevent applying penalty multiple times
      if (!state.activeRun || state.activeRun.result !== 'active') {
        console.log('endGame skipped - run not active')
        return state
      }
      
      console.log('endGame: Applying penalty. Party before:', state.party.map(h => h ? { name: h.name, level: h.level } : null))
      console.log('endGame: heroesUsed before:', state.activeRun.heroesUsed)
      
      // Complete the active run
      const completedRun: import('@/types').Run = {
        ...state.activeRun,
        endDate: Date.now(),
        result: 'defeat',
        finalDepth: state.dungeon.depth,
        finalFloor: state.dungeon.floor,
        // heroesUsed already contains pre-penalty levels from resolveEventChoice
      }
      
      console.log('endGame: completedRun.heroesUsed:', completedRun.heroesUsed)
      
      // Lose all gold on defeat if penalty is enabled
      const loseGold = GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat
      
      // Apply death penalty immediately
      const penalizedParty = applyPenaltyToParty(state.party)
      console.log('endGame: Party after penalty:', penalizedParty.map(h => h ? { name: h.name, level: h.level } : null))
      
      const updatedRoster = state.heroRoster.map(rosterHero => {
        const penalizedVersion = penalizedParty.find(h => h?.id === rosterHero.id)
        return penalizedVersion || rosterHero
      })
      
      return {
        party: penalizedParty,
        heroRoster: updatedRoster,
        isGameOver: true,
        hasPendingPenalty: false,
        activeRun: completedRun, // Keep the run active to show pre-penalty levels
        runHistory: [completedRun, ...state.runHistory],
        dungeon: loseGold ? { ...state.dungeon, gold: 0 } : state.dungeon
      }
    }),
  
  victoryGame: () => 
    set((state) => {
      // Complete the active run as victory
      if (state.activeRun) {
        const completedRun: import('@/types').Run = {
          ...state.activeRun,
          endDate: Date.now(),
          result: 'victory',
          finalDepth: state.dungeon.depth,
          heroesUsed: state.party.filter((h): h is Hero => h !== null).map(h => ({
            name: h.name,
            class: h.class.name,
            level: h.level
          }))
        }
        
        // Add in-run gold to bank on victory
        const goldToBank = Math.max(0, state.dungeon.gold)
        
        // Handle inventory - items that fit go to bank, overflow goes to temporary storage
        const availableSlots = state.bankStorageSlots - state.bankInventory.length
        const itemsToBank = state.dungeon.inventory.slice(0, availableSlots)
        const itemsToOverflow = state.dungeon.inventory.slice(availableSlots)
        
        return {
          dungeon: {
            depth: 0,
            floor: 0,
            eventsThisFloor: 0,
            eventsRequiredThisFloor: 4,
            currentEvent: null,
            eventHistory: [],
            eventLog: [],
            gold: 0,
            inventory: [],
            isNextEventBoss: false,
          },
          bankGold: state.bankGold + goldToBank,
          bankInventory: [...state.bankInventory, ...itemsToBank],
          overflowInventory: [...state.overflowInventory, ...itemsToOverflow],
          isGameOver: true,
          activeRun: completedRun,
          runHistory: [completedRun, ...state.runHistory],
        }
      }
      
      return { isGameOver: true }
    }),
  
  retreatFromDungeon: () =>
    set((state) => {
      // Complete the active run as retreat (no death penalty)
      if (state.activeRun) {
        const completedRun: import('@/types').Run = {
          ...state.activeRun,
          endDate: Date.now(),
          result: 'retreat',
          finalDepth: state.dungeon.depth,
          heroesUsed: state.party.filter((h): h is Hero => h !== null).map(h => ({
            name: h.name,
            class: h.class.name,
            level: h.level
          }))
        }
        
        // Add in-run gold to bank on successful retreat
        const goldToBank = Math.max(0, state.dungeon.gold)
        
        // Handle inventory - items that fit go to bank, overflow goes to temporary storage
        const availableSlots = state.bankStorageSlots - state.bankInventory.length
        const itemsToBank = state.dungeon.inventory.slice(0, availableSlots)
        const itemsToOverflow = state.dungeon.inventory.slice(availableSlots)
        
        return {
          dungeon: {
            depth: 0,
            floor: 0,
            eventsThisFloor: 0,
            eventsRequiredThisFloor: 4,
            currentEvent: null,
            eventHistory: [],
            eventLog: [],
            gold: 0,
            inventory: [],
            isNextEventBoss: false,
          },
          bankGold: state.bankGold + goldToBank,
          bankInventory: [...state.bankInventory, ...itemsToBank],
          overflowInventory: itemsToOverflow,
          isGameOver: false,
          hasPendingPenalty: false,
          activeRun: null,
          runHistory: [completedRun, ...state.runHistory]
        }
      }
      
      return {}
    }),
  
  applyPenalty: () =>
    set((state) => {
      const penalizedParty = applyPenaltyToParty(state.party)
      // Update roster with penalized heroes
      const updatedRoster = state.heroRoster.map(rosterHero => {
        const penalizedVersion = penalizedParty.find(h => h?.id === rosterHero.id)
        return penalizedVersion || rosterHero
      })
      return {
        party: penalizedParty,
        heroRoster: updatedRoster,
        hasPendingPenalty: false,
      }
    }),
  
  repairParty: () =>
    set((state) => {
      const needsRepair = state.party.some(hero => 
        hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp))
      )
      if (needsRepair) {
        return { party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats } }) : null) }
      }
      return {}
    }),
  
  equipItemToHero: (heroId, item, slot) =>
    set((state) => {
      const updatedParty = state.party.map(h =>
        h?.id === heroId ? equipItem(h, item, slot) : h
      )
      const updatedRoster = state.heroRoster.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      return {
        party: updatedParty,
        heroRoster: updatedRoster
      }
    }),
  
  unequipItemFromHero: (heroId, slot) => {
    const hero = useGameStore.getState().party.find(h => h?.id === heroId)
    if (!hero) return null
    
    const { hero: updatedHero, item } = unequipItem(hero, slot)
    useGameStore.setState((state) => ({
      party: state.party.map(h => h?.id === heroId ? updatedHero : h)
    }))
    
    return item
  },
  
  sellItemForGold: (item) =>
    set((state) => ({
      dungeon: {
        ...state.dungeon,
        gold: state.dungeon.gold + sellItem(item)
      }
    })),
  
  equipItemFromBank: (heroId, item, slot) =>
    set((state) => {
      const updatedParty = state.party.map(h =>
        h?.id === heroId ? equipItem(h, item, slot) : h
      )
      const updatedRoster = state.heroRoster.map(h =>
        h.id === heroId ? equipItem(h, item, slot) : h
      )
      // Remove item from bank
      const updatedBank = state.bankInventory.filter(i => i.id !== item.id)
      
      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        bankInventory: updatedBank
      }
    }),
  
  moveItemToBank: (item) =>
    set((state) => ({
      bankInventory: [...state.bankInventory, item]
    })),
  
  removeItemFromBank: (itemId) =>
    set((state) => ({
      bankInventory: state.bankInventory.filter(i => i.id !== itemId)
    })),
  
  expandBankStorage: (slots) =>
    set((state) => {
      const costPerSlot = 50 // 50 gold per slot
      const totalCost = slots * costPerSlot
      
      if (state.bankGold >= totalCost) {
        return {
          bankStorageSlots: state.bankStorageSlots + slots,
          bankGold: state.bankGold - totalCost
        }
      }
      return {}
    }),
  
  keepOverflowItem: (itemId) =>
    set((state) => {
      const item = state.overflowInventory.find(i => i.id === itemId)
      if (!item) return {}
      
      const availableSlots = state.bankStorageSlots - state.bankInventory.length
      if (availableSlots > 0) {
        return {
          overflowInventory: state.overflowInventory.filter(i => i.id !== itemId),
          bankInventory: [...state.bankInventory, item]
        }
      }
      return {}
    }),
  
  discardOverflowItem: (itemId) =>
    set((state) => ({
      overflowInventory: state.overflowInventory.filter(i => i.id !== itemId)
    })),
  
  clearOverflow: () =>
    set({ overflowInventory: [] }),
  
  discardItems: (itemIds) =>
    set((state) => {
      const itemsToDiscard = state.bankInventory.filter(item => itemIds.includes(item.id))
      const totalValue = itemsToDiscard.reduce((sum, item) => sum + item.value, 0)
      const alkahestGained = Math.floor(totalValue * GAME_CONFIG.items.alkahestConversionRate)
      
      // Track discard stats if there's an active run
      const runUpdate = state.activeRun ? {
        itemsDiscarded: (state.activeRun.itemsDiscarded ?? 0) + itemsToDiscard.length,
        alkahestGained: (state.activeRun.alkahestGained ?? 0) + alkahestGained
      } : {}
      
      return {
        bankInventory: state.bankInventory.filter(item => !itemIds.includes(item.id)),
        alkahest: state.alkahest + alkahestGained,
        ...(state.activeRun ? { activeRun: { ...state.activeRun, ...runUpdate } } : {})
      }
    }),
  
  resetGame: () => 
    set(initialState),
  
  // Backup/Recovery functions
  listBackups: () => {
    return listBackups('dungeon-runner-storage')
  },
  
  restoreFromBackup: (backupKey: string) => {
    const success = restoreBackup('dungeon-runner-storage', backupKey)
    if (success) {
      // Reload the page to apply restored state
      window.location.reload()
    }
    return success
  },
  
  exportSave: () => {
    try {
      const state = _get()
      const saveData = {
        version: 1,
        timestamp: Date.now(),
        data: state
      }
      const json = JSON.stringify(saveData, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dungeon-runner-save-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      console.log('[Export] Save exported successfully')
    } catch (error) {
      console.error('[Export] Failed to export save:', error)
    }
  },
  
  importSave: (jsonString: string) => {
    try {
      const saveData = JSON.parse(jsonString)
      if (!saveData.data) {
        console.error('[Import] Invalid save file format')
        return false
      }
      
      // Validate the save data has the required structure
      const requiredKeys = ['party', 'heroRoster', 'dungeon', 'bankGold', 'bankInventory']
      const hasRequiredKeys = requiredKeys.every(key => key in saveData.data)
      
      if (!hasRequiredKeys) {
        console.error('[Import] Save file missing required data')
        return false
      }
      
      // Apply the imported state
      set(saveData.data)
      console.log('[Import] Save imported successfully')
      return true
    } catch (error) {
      console.error('[Import] Failed to import save:', error)
      return false
    }
  },
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          
          // Create backup before attempting repair
          createBackup(name)
          
          try {
            const state = JSON.parse(str)
            
            // Access the actual nested state
            const actualState = state?.state
            if (!actualState) return state
            
            // Repair party array size if it doesn't match config
            if (actualState.party) {
              const expectedSize = GAME_CONFIG.party.maxSize
              if (!Array.isArray(actualState.party) || actualState.party.length !== expectedSize) {
                // Create new array with correct size
                const newParty = Array(expectedSize).fill(null)
                // Copy existing heroes to new array
                if (Array.isArray(actualState.party)) {
                  actualState.party.forEach((hero: Hero | null, index: number) => {
                    if (index < expectedSize && hero !== null) {
                      newParty[index] = hero
                    }
                  })
                }
                actualState.party = newParty
              }
            } else {
              // If party is missing entirely, initialize it
              actualState.party = Array(GAME_CONFIG.party.maxSize).fill(null)
            }
            
            // Repair any NaN values when loading from storage
            if (actualState.party?.length > 0) {
              actualState.party = actualState.party.map((h: Hero | null) => {
                if (!h) return null
                if (isNaN(h.stats?.hp) || isNaN(h.stats?.maxHp)) {
                  return sanitizeHeroStats({ ...h, stats: { ...h.stats } })
                }
                return h
              })
            }
            
            // Also repair heroRoster
            if (actualState.heroRoster?.length > 0) {
              actualState.heroRoster = actualState.heroRoster.map((h: Hero) => {
                if (isNaN(h.stats?.hp) || isNaN(h.stats?.maxHp)) {
                  return sanitizeHeroStats({ ...h, stats: { ...h.stats } })
                }
                return h
              })
            }
            
            // Repair item names and icons in inventories
            if (actualState.bankInventory?.length > 0) {
              actualState.bankInventory = repairItemNames(actualState.bankInventory)
            }
            if (actualState.dungeon?.inventory?.length > 0) {
              actualState.dungeon.inventory = repairItemNames(actualState.dungeon.inventory)
            }
            if (actualState.overflowInventory?.length > 0) {
              actualState.overflowInventory = repairItemNames(actualState.overflowInventory)
            }
            
            // Repair equipped items on heroes in party
            if (actualState.party?.length > 0) {
              actualState.party = actualState.party.map((hero: Hero | null) => {
                if (!hero) return null
                const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
                if (equippedItems.length > 0) {
                  const repairedItems = repairItemNames(equippedItems)
                  const newEquipment = { ...hero.equipment }
                  let itemIndex = 0
                  for (const slot in newEquipment) {
                    if (newEquipment[slot as ItemSlot] !== null) {
                      newEquipment[slot as ItemSlot] = repairedItems[itemIndex]
                      itemIndex++
                    }
                  }
                  return { ...hero, equipment: newEquipment }
                }
                return hero
              })
            }
            
            // Sync roster from party if roster heroes are corrupted
            // Party data is the source of truth for active heroes
            if (actualState.party && actualState.heroRoster) {
              const validPartyHeroes = actualState.party.filter((h: Hero | null): h is Hero => h !== null)
              
              // For each hero in party, check if roster version is outdated or corrupted
              validPartyHeroes.forEach((partyHero: Hero) => {
                const rosterIndex = actualState.heroRoster.findIndex((h: Hero) => h.id === partyHero.id)
                
                if (rosterIndex !== -1) {
                  const rosterHero = actualState.heroRoster[rosterIndex]
                  
                  // If roster version is level 1 but party version is higher, roster is corrupted
                  // Or if roster has no equipment but party does
                  const rosterCorrupted = (
                    rosterHero.level === 1 && partyHero.level > 1
                  ) || (
                    rosterHero.level < partyHero.level
                  ) || (
                    Object.values(rosterHero.equipment || {}).every(item => item === null) &&
                    Object.values(partyHero.equipment || {}).some(item => item !== null)
                  )
                  
                  if (rosterCorrupted) {
                    // Replace roster version with party version
                    actualState.heroRoster[rosterIndex] = { ...partyHero }
                    console.log(`[Repair] Synced roster hero ${partyHero.name} from party (level ${partyHero.level})`)
                  }
                } else {
                  // Hero in party but not in roster, add them
                  actualState.heroRoster.push({ ...partyHero })
                  console.log(`[Repair] Added missing hero ${partyHero.name} to roster`)
                }
              })
            }
            
            // Repair equipped items on heroes in roster
            if (actualState.heroRoster?.length > 0) {
              actualState.heroRoster = actualState.heroRoster.map((hero: Hero) => {
                const equippedItems = Object.values(hero.equipment || {}).filter((item): item is Item => item !== null)
                if (equippedItems.length > 0) {
                  const repairedItems = repairItemNames(equippedItems)
                  const newEquipment = { ...hero.equipment }
                  let itemIndex = 0
                  for (const slot in newEquipment) {
                    if (newEquipment[slot as ItemSlot] !== null) {
                      newEquipment[slot as ItemSlot] = repairedItems[itemIndex]
                      itemIndex++
                    }
                  }
                  return { ...hero, equipment: newEquipment }
                }
                return hero
              })
            }
            
            // Migrate to new floor-based system
            const migratedState = migrateGameState(actualState)
            state.state = migratedState
            
            return state
          } catch (error) {
            console.error('Error loading game state:', error)
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

// Repair party on initial mount
useGameStore.getState().repairParty()


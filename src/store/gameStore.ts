import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StateCreator } from 'zustand'
import type { GameState, Hero, EventChoice, Item, ItemSlot, Consumable } from '@/types'
import { MusicContext } from '@/types/audio'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome, resolveChoiceOutcome } from '@systems/events/eventResolver'
import { GAME_CONFIG } from '@/config/gameConfig'
import { calculateMaxHp, createHero } from '@/utils/heroUtils'
import { equipItem, unequipItem, sellItem, calculateStatsWithEquipment } from '@/systems/loot/inventoryManager'
import { repairItemNames } from '@/systems/loot/lootGenerator'
import { migrateGameState } from '@/utils/migration'
import { tickEffectsForDepthProgression } from '@/systems/effects'
import { getClassById } from '@/data/classes'
import LZString from 'lz-string'
import { audioManager } from '@/systems/audio/audioManager'
import { getPlaylistForContext } from '@/config/musicConfig'

/**
 * Create a backup of the current state
 */
function createBackup(name: string): void {
  try {
    const current = localStorage.getItem(name)
    if (current) {
      const timestamp = Date.now()

      // Check localStorage size before attempting backup
      const currentSize = new Blob([current]).size
      console.log(`[Backup] Current save size: ${(currentSize / 1024).toFixed(2)} KB`)

      // Keep only the last 3 backups (reduced from 5 to save space)
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${name}-backup-`))
        .sort()

      while (backupKeys.length > 2) {
        const oldestKey = backupKeys.shift()
        if (oldestKey) {
          localStorage.removeItem(oldestKey)
          console.log(`[Backup] Removed old backup: ${oldestKey}`)
        }
      }

      // Try to create backup
      localStorage.setItem(`${name}-backup-${timestamp}`, current)
      console.log(`[Backup] Created backup: ${name}-backup-${timestamp}`)
    }
  } catch (error) {
    console.error('[Backup] Failed to create backup:', error)
    // If quota exceeded, delete all backups and try again
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.log('[Backup] Quota exceeded, clearing all backups...')
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${name}-backup-`))
      backupKeys.forEach(key => localStorage.removeItem(key))
      console.log(`[Backup] Cleared ${backupKeys.length} old backups`)
    }
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

  // Ensure activeEffects exists
  if (!hero.activeEffects) {
    hero.activeEffects = []
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
          hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp) || !hero.activeEffects)
        )
        if (needsSanitization) {
          set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats }, activeEffects: h.activeEffects || [] }) : null) } as Partial<T>)
        }
      }
    })

    return config(
      (args) => {
        set(args)
        const state = get() as GameState
        if (state.party?.length > 0) {
          const needsSanitization = state.party.some(hero =>
            hero !== null && (isNaN(hero.stats.hp) || isNaN(hero.stats.maxHp) || !hero.activeEffects)
          )
          if (needsSanitization) {
            set({ party: state.party.map(h => h !== null ? sanitizeHeroStats({ ...h, stats: { ...h.stats }, activeEffects: h.activeEffects || [] }) : null) } as Partial<T>)
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
        {
          const oldLevel = hero.level
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
          break
        }

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
          wisdom: hero.class.baseStats.wisdom || 0,
          charisma: hero.class.baseStats.charisma || 0,
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
  migrateHeroStats: () => void
  recalculateHeroStats: () => void
  healParty: () => void
  getRunHistory: () => import('@/types').Run[]
  clearRunHistory: () => void
  // Inventory actions
  equipItemToHero: (heroId: string, item: Item, slotId: string) => void
  unequipItemFromHero: (heroId: string, slotId: string) => Item | null
  sellItemForGold: (item: Item) => void
  purchasePotion: (potion: Consumable) => void
  spendBankGold: (amount: number) => boolean
  equipItemFromBank: (heroId: string, item: Item, slotId: string) => void
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
  // Music actions
  setMusicVolume: (volume: number) => void
  setMusicEnabled: (enabled: boolean) => void
  changeMusicContext: (context: MusicContext) => void
}

/**
 * Save run history to separate localStorage key to keep main save small
 */
function saveRunHistory(runHistory: any[]) {
  try {
    const json = JSON.stringify(runHistory)
    const compressed = LZString.compressToUTF16(json)
    localStorage.setItem('dungeon-runner-run-history', compressed)
    console.log(`[RunHistory] Saved ${runHistory.length} runs`)
  } catch (error) {
    console.error('[RunHistory] Failed to save:', error)
  }
}

/**
 * Load run history from separate localStorage key
 */
function loadRunHistory(): any[] {
  try {
    const compressed = localStorage.getItem('dungeon-runner-run-history')
    if (!compressed) return []

    const json = LZString.decompressFromUTF16(compressed) || compressed
    return JSON.parse(json) || []
  } catch (error) {
    console.error('[RunHistory] Failed to load:', error)
    return []
  }
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
  musicVolume: 0.7,
  musicEnabled: true,
  currentMusicContext: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    sanitizeMiddleware(
      (set, get) => ({
        ...initialState,

        addHero: (hero, slotIndex) =>
          set((state) => {
            // If no slot specified, find first empty slot
            const targetIndex = slotIndex !== undefined ? slotIndex : state.party.findIndex(h => h === null)
            if (targetIndex === -1 || targetIndex >= state.party.length) return state // Party full or invalid slot
            if (state.party[targetIndex] !== null) return state // Slot occupied

            // Heal hero to full HP
            const healedHero = { ...hero, stats: { ...hero.stats, hp: hero.stats.maxHp } }

            // Add to roster if not already there
            const existingInRoster = state.heroRoster.find(h => h.id === hero.id)
            const newParty = [...state.party]
            newParty[targetIndex] = healedHero

            // Also update in roster if exists
            const updatedRoster = existingInRoster
              ? state.heroRoster.map(h => h.id === hero.id ? healedHero : h)
              : [...state.heroRoster, healedHero]

            return {
              party: newParty,
              heroRoster: updatedRoster
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
              // Reuse existing hero and heal to full HP
              const healedHero = { ...existingHero, stats: { ...existingHero.stats, hp: existingHero.stats.maxHp } }
              newParty[targetIndex] = healedHero

              // Also update in roster
              const updatedRoster = state.heroRoster.map(h => h.id === existingHero.id ? healedHero : h)

              return {
                party: newParty,
                heroRoster: updatedRoster
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

        startDungeon: (startingFloor = 0, alkahestCost = 0) =>
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

            // Update roster with healed heroes
            const updatedRoster = state.heroRoster.map(rosterHero => {
              const healedVersion = healedParty.find(h => h?.id === rosterHero.id)
              return healedVersion || rosterHero
            })

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
              heroRoster: updatedRoster,
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

            // Tick effects for all heroes on every depth increment
            let updatedParty = tickEffectsForDepthProgression(state.party, newDepth)

            // Handle pending resurrections from Amulet of Resurrection
            const resurrectedHeroes: string[] = []
            updatedParty = updatedParty.map(hero => {
              if (hero && hero.pendingResurrection) {
                // Find and remove the amulet
                const newSlots = { ...hero.slots }
                let amuletSlot: string | null = null
                
                for (const [slotId, item] of Object.entries(newSlots)) {
                  if (item && 'name' in item && item.name === 'Amulet of Resurrection') {
                    amuletSlot = slotId
                    break
                  }
                }
                
                if (amuletSlot) {
                  // Remove the amulet (it shatters)
                  delete newSlots[amuletSlot]
                  
                  // Revive the hero with 50% HP
                  const maxHp = hero.stats.maxHp
                  resurrectedHeroes.push(hero.name)
                  
                  return {
                    ...hero,
                    isAlive: true,
                    pendingResurrection: false,
                    stats: {
                      ...hero.stats,
                      hp: Math.floor(maxHp * 0.5)
                    },
                    slots: newSlots
                  }
                }
                
                // If amulet not found (shouldn't happen), just clear the flag
                return {
                  ...hero,
                  pendingResurrection: false
                }
              }
              return hero
            })

            // Update roster with latest party state
            const updatedRoster = state.heroRoster.map(rosterHero => {
              const updatedVersion = updatedParty.find(h => h?.id === rosterHero.id)
              return updatedVersion || rosterHero
            })

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

            // Create resurrection outcome if any heroes were revived
            const resurrectionOutcome = resurrectedHeroes.length > 0 ? {
              title: 'Resurrection',
              description: resurrectedHeroes.length === 1 
                ? `${resurrectedHeroes[0]}'s Amulet of Resurrection shatters in a blinding flash! They are revived with half health.`
                : `The Amulets of Resurrection shatter in blinding flashes! ${resurrectedHeroes.join(', ')} revived with half health.`,
              effects: [],
              items: []
            } : null

            // Update active run
            const updatedRun = state.activeRun ? {
              ...state.activeRun,
              finalDepth: newDepth,
              finalFloor: newFloor,
              eventsCompleted: state.activeRun.eventsCompleted + 1
            } : null

            return {
              party: updatedParty,
              heroRoster: updatedRoster,
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
              lastOutcome: resurrectionOutcome
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
              state.dungeon,
              currentEvent
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

            if (isWiped) {
              console.log('========== PARTY WIPED DETECTED ==========')
              console.log('Event:', {
                title: currentEvent.title,
                type: currentEvent.type,
                choiceText: choice.text
              })
              console.log('Updated Party State:', updatedParty.map(h => h ? {
                name: h.name,
                level: h.level,
                hp: h.stats.hp,
                maxHp: h.stats.maxHp,
                isAlive: h.isAlive
              } : null))
              console.log('Current Floor:', state.dungeon.floor, 'Depth:', state.dungeon.depth)
            }

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

            // If party wiped, create completed run and add to history immediately
            let completedRun: import('@/types').Run | null = null
            let penalizedParty = updatedParty
            let updatedRoster = state.heroRoster

            if (isWiped && prePenaltyLevels) {
              console.log('Creating completed run immediately with pre-penalty levels:', prePenaltyLevels)

              // Create the completed run with pre-penalty levels
              completedRun = {
                ...state.activeRun!,
                endDate: Date.now(),
                result: 'defeat' as const,
                finalDepth: state.dungeon.depth,
                finalFloor: state.dungeon.floor,
                heroesUsed: prePenaltyLevels
              }

              console.log('Applying penalty to party. Before:', updatedParty.map(h => h ? { name: h.name, level: h.level } : null))

              // Apply death penalty to party
              penalizedParty = applyPenaltyToParty(updatedParty)

              console.log('After penalty:', penalizedParty.map(h => h ? { name: h.name, level: h.level } : null))

              // Update roster with penalized heroes
              updatedRoster = state.heroRoster.map(rosterHero => {
                const penalizedVersion = penalizedParty.find(h => h?.id === rosterHero.id)
                return penalizedVersion || rosterHero
              })
            }

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

            // Determine if we should lose gold
            const loseGold = isWiped && GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat

            // Update roster with latest party state (even when not wiped)
            if (!isWiped) {
              updatedRoster = state.heroRoster.map(rosterHero => {
                const updatedVersion = updatedParty.find(h => h?.id === rosterHero.id)
                return updatedVersion || rosterHero
              })
            }

            const resultState = {
              metaXp: state.metaXp + metaXpGained,
              party: isWiped ? penalizedParty : updatedParty,
              heroRoster: updatedRoster,
              dungeon: {
                ...state.dungeon,
                gold: loseGold ? 0 : updatedGold,
                inventory: [...state.dungeon.inventory, ...resolvedOutcome.items], // Add found items to inventory
                eventLog: [...state.dungeon.eventLog, eventLogEntry],
                currentEvent: null // Clear current event after resolution
              },
              isGameOver: isWiped,
              lastOutcome: resolvedOutcome,
              activeRun: completedRun || updatedRun,
              hasPendingPenalty: false
            }

            // Save completed run to separate storage
            if (completedRun) {
              const history = loadRunHistory()
              saveRunHistory([completedRun, ...history])
            }

            return resultState
          }),

        endGame: () =>
          set((state) => {
            console.log('========== endGame called ==========')
            console.log('activeRun:', state.activeRun ? {
              result: state.activeRun.result,
              floor: state.activeRun.finalFloor,
              depth: state.activeRun.finalDepth,
              heroesUsed: state.activeRun.heroesUsed
            } : 'null')

            // Penalty and history addition should already be done in resolveEventChoice
            // This function now does nothing if run is already completed
            if (!state.activeRun || state.activeRun.result !== 'active') {
              console.log('endGame: Run already completed, skipping')
              return state
            }

            console.warn('endGame: Run still active - this should not happen! Applying penalty as fallback.')
            console.log('Party before fallback penalty:', state.party.map(h => h ? { name: h.name, level: h.level } : null))

            // Complete the active run
            const completedRun: import('@/types').Run = {
              ...state.activeRun,
              endDate: Date.now(),
              result: 'defeat',
              finalDepth: state.dungeon.depth,
              finalFloor: state.dungeon.floor,
              heroesUsed: state.party.filter((h): h is Hero => h !== null).map(h => ({
                id: h.id,
                name: h.name,
                class: h.class.name,
                level: h.level
              }))
            }

            // Lose all gold on defeat if penalty is enabled
            const loseGold = GAME_CONFIG.deathPenalty.loseAllGoldOnDefeat

            // Apply death penalty immediately
            const penalizedParty = applyPenaltyToParty(state.party)
            console.log('Party after fallback penalty:', penalizedParty.map(h => h ? { name: h.name, level: h.level } : null))

            const updatedRoster = state.heroRoster.map(rosterHero => {
              const penalizedVersion = penalizedParty.find(h => h?.id === rosterHero.id)
              return penalizedVersion || rosterHero
            })

            // Save to separate run history storage
            const history = loadRunHistory()
            saveRunHistory([completedRun, ...history])

            return {
              party: penalizedParty,
              heroRoster: updatedRoster,
              isGameOver: true,
              hasPendingPenalty: false,
              activeRun: completedRun,
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

              const resultState = {
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
              }

              // Save to separate run history storage
              const history = loadRunHistory()
              saveRunHistory([completedRun, ...history])

              return resultState
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
                finalFloor: state.dungeon.floor,
                heroesUsed: state.party.filter((h): h is Hero => h !== null).map(h => ({
                  name: h.name,
                  class: h.class.name,
                  level: h.level
                }))
              }

              // Save to separate run history storage
              const history = loadRunHistory()
              saveRunHistory([completedRun, ...history])

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

        migrateHeroStats: () =>
          set((state) => {
            // Check if any hero actually needs migration
            const allHeroes = [
              ...state.party.filter((h): h is Hero => h !== null),
              ...state.heroRoster
            ]

            const needsMigration = allHeroes.some(hero => {
              const needsWisdom = hero.stats.wisdom == null || isNaN(hero.stats.wisdom)
              const needsCharisma = hero.stats.charisma == null || isNaN(hero.stats.charisma)
              console.log(`[Migration Check] ${hero.name}: wisdom=${hero.stats.wisdom} (${typeof hero.stats.wisdom}), charisma=${hero.stats.charisma} (${typeof hero.stats.charisma}), needsWisdom=${needsWisdom}, needsCharisma=${needsCharisma}`)
              return needsWisdom || needsCharisma
            })

            if (!needsMigration) {
              console.log('[Migration] All heroes already have wisdom/charisma - skipping')
              return {}
            }

            console.log('[Migration] Running wisdom/charisma migration...')
            console.log(`[Migration] Party has ${state.party.filter(h => h !== null).length} heroes`)
            console.log(`[Migration] Roster has ${state.heroRoster.length} heroes`)

            const migrateHero = (hero: Hero): Hero => {
              const needsWisdom = hero.stats.wisdom == null || isNaN(hero.stats.wisdom)
              const needsCharisma = hero.stats.charisma == null || isNaN(hero.stats.charisma)

              if (needsWisdom || needsCharisma) {
                // Get current class definition (in case old hero has outdated class data)
                const currentClass = getClassById(hero.class.id) || hero.class
                const levelBonus = (hero.level - 1) * 5
                console.log(`[Migration] Adding wisdom/charisma to ${hero.name} (${hero.class.name}) Lv${hero.level}`)
                const newWisdom = needsWisdom ? currentClass.baseStats.wisdom + levelBonus : hero.stats.wisdom
                const newCharisma = needsCharisma ? currentClass.baseStats.charisma + levelBonus : hero.stats.charisma
                console.log(`  New values: wisdom=${newWisdom}, charisma=${newCharisma}`)
                return {
                  ...hero,
                  class: currentClass,
                  stats: {
                    ...hero.stats,
                    wisdom: newWisdom,
                    charisma: newCharisma,
                  }
                }
              }
              return hero
            }

            const newParty = state.party.map(h => h !== null ? migrateHero(h) : null)
            const newRoster = state.heroRoster.map(h => migrateHero(h))

            console.log('[Migration] Wisdom/charisma migration complete')
            return {
              party: newParty,
              heroRoster: newRoster
            }
          }),

        recalculateHeroStats: () =>
          set((state) => {
            const recalculateHero = (hero: Hero): Hero => {
              const updatedHero = { ...hero }
              updatedHero.stats = calculateStatsWithEquipment(updatedHero)
              return updatedHero
            }

            const newParty = state.party.map(h => h !== null ? recalculateHero(h) : null)
            const newRoster = state.heroRoster.map(h => recalculateHero(h))

            console.log('[Recalculate] Hero stats recalculated with equipment bonuses')
            return {
              party: newParty,
              heroRoster: newRoster
            }
          }),

        healParty: () =>
          set((state) => {
            const healHero = (hero: Hero): Hero => {
              return {
                ...hero,
                stats: {
                  ...hero.stats,
                  hp: hero.stats.maxHp
                }
              }
            }

            const newParty = state.party.map(h => h !== null ? healHero(h) : null)
            const newRoster = state.heroRoster.map(h => healHero(h))

            return {
              party: newParty,
              heroRoster: newRoster
            }
          }),

        unequipItemFromHero: (heroId, slotId) => {
          let unequippedItem: Item | null = null
          
          useGameStore.setState((state) => {
            const hero = state.party.find(h => h?.id === heroId)
            if (!hero) return state

            const result = unequipItem(hero, slotId)
            unequippedItem = result.item
            const updatedHero = result.hero

            return {
              party: state.party.map(h => h?.id === heroId ? updatedHero : h),
              heroRoster: state.heroRoster.map(h => h.id === heroId ? updatedHero : h)
            }
          })

          return unequippedItem
        },

        sellItemForGold: (item) =>
          set((state) => ({
            dungeon: {
              ...state.dungeon,
              gold: state.dungeon.gold + sellItem(item)
            }
          })),

        purchasePotion: (potion) =>
          set((state) => {
            if (state.bankGold >= potion.value) {
              return {
                bankGold: state.bankGold - potion.value,
                bankInventory: [...state.bankInventory, potion]
              }
            }
            return state
          }),

        spendBankGold: (amount) => {
          const state = useGameStore.getState()
          if (state.bankGold >= amount) {
            set({ bankGold: state.bankGold - amount })
            return true
          }
          return false
        },

        equipItemToHero: (heroId, item, slotId) =>
          set((state) => {
            let replacedItem: Item | null = null
            
            const updatedParty = state.party.map(h => {
              if (h?.id === heroId) {
                const result = equipItem(h, item, slotId)
                if (result.replacedItem) {
                  replacedItem = result.replacedItem
                }
                return result.hero
              }
              return h
            })
            
            const updatedRoster = state.heroRoster.map(h => {
              if (h.id === heroId) {
                const result = equipItem(h, item, slotId)
                return result.hero
              }
              return h
            })
            
            // Remove newly equipped item from dungeon inventory
            let updatedInventory = state.dungeon.inventory.filter(i => i.id !== item.id)
            
            // Add replaced item back to dungeon inventory
            if (replacedItem) {
              updatedInventory = [...updatedInventory, replacedItem]
            }

            return {
              party: updatedParty,
              heroRoster: updatedRoster,
              dungeon: {
                ...state.dungeon,
                inventory: updatedInventory
              }
            }
          }),

        equipItemFromBank: (heroId, item, slotId) =>
          set((state) => {
            let replacedItem: Item | null = null
            
            const updatedParty = state.party.map(h => {
              if (h?.id === heroId) {
                const result = equipItem(h, item, slotId)
                if (result.replacedItem) {
                  replacedItem = result.replacedItem
                }
                return result.hero
              }
              return h
            })
            
            const updatedRoster = state.heroRoster.map(h => {
              if (h.id === heroId) {
                const result = equipItem(h, item, slotId)
                return result.hero
              }
              return h
            })
            
            // Remove newly equipped item from bank
            let updatedBank = state.bankInventory.filter(i => i.id !== item.id)
            
            // Add replaced item back to bank
            if (replacedItem) {
              updatedBank = [...updatedBank, replacedItem]
            }

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

        // Run History functions
        getRunHistory: () => {
          return loadRunHistory()
        },

        clearRunHistory: () => {
          localStorage.removeItem('dungeon-runner-run-history')
          console.log('[RunHistory] Cleared all run history')
        },

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
            const state = useGameStore.getState()
            const saveData = {
              version: 1,
              timestamp: Date.now(),
              data: state
            }
            // Use custom replacer to strip out icon functions
            const replacer = (key: string, val: any) => {
              if (key === 'icon' && typeof val === 'function') {
                return undefined
              }
              return val
            }
            const json = JSON.stringify(saveData, replacer, 2)
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

        // Music actions
        setMusicVolume: (volume: number) => {
          console.log('[GameStore] Setting music volume:', volume);
          set({ musicVolume: volume })
          audioManager.setVolume(volume)
        },

        setMusicEnabled: (enabled: boolean) => {
          console.log('[GameStore] Setting music enabled:', enabled);
          set({ musicEnabled: enabled })
          audioManager.setMusicEnabled(enabled)
        },

        changeMusicContext: (context: MusicContext) => {
          const currentContext = get().currentMusicContext;

          // Skip if already on this context
          if (currentContext === context) {
            console.log('[GameStore] Already on music context:', context, '- skipping');
            return;
          }

          console.log('[GameStore] Changing music context to:', context);
          const playlist = getPlaylistForContext(context)
          console.log('[GameStore] Got playlist:', playlist);
          set({ currentMusicContext: context });
          audioManager.changeContext(playlist)
        },
      })
    ),
    {
      name: 'dungeon-runner-storage',
      storage: {
        getItem: (name) => {
          const compressed = localStorage.getItem(name)
          if (!compressed) return null

          // Try to decompress - if it fails, assume it's old uncompressed data
          let str: string
          try {
            str = LZString.decompressFromUTF16(compressed) || compressed
          } catch {
            str = compressed
          }

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

                // Handle new slot format
                if (hero.slots) {
                  const slotItems = Object.values(hero.slots).filter((item): item is Item => item !== null && 'stats' in item)
                  if (slotItems.length > 0) {
                    const repairedItems = repairItemNames(slotItems)
                    const newSlots = { ...hero.slots }
                    let itemIndex = 0
                    for (const slotId in newSlots) {
                      if (newSlots[slotId] !== null && 'stats' in newSlots[slotId]!) {
                        newSlots[slotId] = repairedItems[itemIndex]
                        itemIndex++
                      }
                    }
                    return { ...hero, slots: newSlots }
                  }
                  return hero
                }

                // Handle old equipment format (for backwards compatibility)
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

                  // Check corruption using both old equipment and new slots format
                  const partyHasItems = partyHero.slots
                    ? Object.values(partyHero.slots).some(item => item !== null)
                    : Object.values(partyHero.equipment || {}).some(item => item !== null)

                  const rosterHasItems = rosterHero.slots
                    ? Object.values(rosterHero.slots).some(item => item !== null)
                    : Object.values(rosterHero.equipment || {}).some(item => item !== null)

                  // Determine which version has the most complete data
                  // Priority: higher level > has items > neither (use party as source of truth)
                  const shouldUseParty = (
                    partyHero.level > rosterHero.level
                  ) || (
                      partyHero.level === rosterHero.level && partyHasItems && !rosterHasItems
                    )

                  const shouldUseRoster = (
                    rosterHero.level > partyHero.level
                  ) || (
                      rosterHero.level === partyHero.level && rosterHasItems && !partyHasItems
                    )

                  if (shouldUseParty) {
                    // Party has better data, sync roster from party
                    actualState.heroRoster[rosterIndex] = { ...partyHero }
                    console.log(`[Repair] Synced roster hero ${partyHero.name} from party (level ${partyHero.level}, items: ${partyHasItems})`)
                  } else if (shouldUseRoster) {
                    // Roster has better data, sync party from roster (this prevents item loss!)
                    const partySlotIndex = actualState.party.findIndex((h: Hero | null) => h?.id === rosterHero.id)
                    if (partySlotIndex !== -1) {
                      actualState.party[partySlotIndex] = { ...rosterHero }
                      console.log(`[Repair] Synced party hero ${rosterHero.name} from roster (level ${rosterHero.level}, items: ${rosterHasItems})`)
                    }
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
                // Handle new slot format
                if (hero.slots) {
                  const slotItems = Object.values(hero.slots).filter((item): item is Item => item !== null && 'stats' in item)
                  if (slotItems.length > 0) {
                    const repairedItems = repairItemNames(slotItems)
                    const newSlots = { ...hero.slots }
                    let itemIndex = 0
                    for (const slotId in newSlots) {
                      if (newSlots[slotId] !== null && 'stats' in newSlots[slotId]!) {
                        newSlots[slotId] = repairedItems[itemIndex]
                        itemIndex++
                      }
                    }
                    return { ...hero, slots: newSlots }
                  }
                  return hero
                }

                // Handle old equipment format (for backwards compatibility)
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

            // Migrate run history to separate storage if it exists
            if (migratedState.runHistory && migratedState.runHistory.length > 0) {
              console.log(`[RunHistory Migration] Found ${migratedState.runHistory.length} runs in old save, migrating to separate storage`)
              const existingHistory = loadRunHistory()

              // Merge old and new, deduplicate by run ID
              const allRuns = [...migratedState.runHistory, ...existingHistory]
              const uniqueRuns = allRuns.filter((run, index, self) =>
                index === self.findIndex(r => r.id === run.id)
              )

              saveRunHistory(uniqueRuns)
              console.log(`[RunHistory Migration] Saved ${uniqueRuns.length} total runs`)

              // Clear from main state
              migratedState.runHistory = []
            }

            return state
          } catch (error) {
            console.error('Error loading game state:', error)
            return null
          }
        },
        setItem: (name, value) => {
          // Custom replacer to strip out icon functions that shouldn't be serialized
          const replacer = (key: string, val: any) => {
            // Skip icon functions
            if (key === 'icon' && typeof val === 'function') {
              return undefined
            }
            return val
          }
          const json = JSON.stringify(value, replacer)

          // Compress the JSON before saving
          const compressed = LZString.compressToUTF16(json)
          const originalSize = new Blob([json]).size
          const compressedSize = new Blob([compressed]).size
          console.log(`[Storage] Compressed save: ${(originalSize / 1024).toFixed(2)} KB → ${(compressedSize / 1024).toFixed(2)} KB (${((1 - compressedSize / originalSize) * 100).toFixed(1)}% reduction)`)

          localStorage.setItem(name, compressed)
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)

// Repair party on initial mount
useGameStore.getState().repairParty()
// Migrate hero stats to add wisdom and charisma
useGameStore.getState().migrateHeroStats()
// Recalculate hero stats to ensure equipment bonuses are applied
useGameStore.getState().recalculateHeroStats()

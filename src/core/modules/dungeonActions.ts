/**
 * Dungeon actions module
 * Handles dungeon progression, events, combat, and game state transitions
 */

import type { StateCreator } from 'zustand'
import type { GameState, Hero, EventChoice, Run, DungeonEvent } from '@/types'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getNextEvent } from '@systems/events/eventSelector'
import { resolveEventOutcome, resolveChoiceOutcome } from '@systems/events/eventResolver'
import type { ResolvedEffect } from '@systems/events/eventResolver'
import { tickEffectsForDepthProgression } from '@/systems/effects'
import { processUniqueEffects } from '@/systems/items/uniqueEffects'
import { applyPenaltyToParty } from './statActions'
import { saveRunHistory, loadRunHistory } from './runHistory'
import { resetPartyCooldowns } from '@/utils/abilityUtils'
import { calculateTotalStats } from '@/utils/statCalculator'

export interface DungeonActionsSlice {
  startDungeon: (startingFloor?: number, alkahestCost?: number) => void
  advanceDungeon: () => void
  selectChoice: (choice: EventChoice) => void
  endGame: () => void
  victoryGame: () => void
  retreatFromDungeon: () => void
  applyPenalty: () => void
  applyBossVictoryRewards: (bossEvent: DungeonEvent) => void
}

export const createDungeonActions: StateCreator<
  GameState & DungeonActionsSlice,
  [],
  [],
  DungeonActionsSlice
> = (set, get) => ({
  startDungeon: (startingFloor = 0, alkahestCost = 0) =>
    set((state) => {


      // Penalty should already be applied by endGame
      // Revive all party members, full heal, and reset ability cooldowns at dungeon start
      const healedParty = resetPartyCooldowns(state.party.map(hero => hero ? ({
        ...hero,
        isAlive: true,
        stats: {
          ...hero.stats,
          hp: calculateTotalStats(hero).maxHp
        }
      }) : null))

      // Update roster with healed heroes
      const updatedRoster = state.heroRoster.map(rosterHero => {
        const healedVersion = healedParty.find(h => h?.id === rosterHero.id)
        return healedVersion || rosterHero
      })

      // Create a new run
      const newRun: Run = {
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
        alkahest: alkahestCost > 0 ? Math.max(0, state.alkahest - alkahestCost) : state.alkahest,
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

      // Process unique item effects for depth advancement (every event)
      if (updatedParty.some(h => h !== null && h.isAlive)) {
        const uniqueEffectResult = processUniqueEffects(updatedParty, 'onDepthAdvance', {
          floor: newFloor
        })
        
        if (uniqueEffectResult) {
          updatedParty = uniqueEffectResult.party
        }
      }

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
            
            // Revive the hero with 50% HP (using effective max HP with equipment)
            const maxHp = calculateTotalStats(hero).maxHp
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
        // Player has completed all floors - update state and trigger victory
        const victoryRun = state.activeRun ? {
          ...state.activeRun,
          finalDepth: newDepth,
          finalFloor: GAME_CONFIG.dungeon.maxFloors, // Cap at max floor
          eventsCompleted: state.activeRun.eventsCompleted + 1,
          result: 'victory' as const,
          endDate: Date.now(),
        } : null

        return {
          party: updatedParty,
          heroRoster: updatedRoster,
          dungeon: {
            ...state.dungeon,
            depth: newDepth,
            floor: newFloor, // Set floor to 101 to trigger victory screen
            eventsThisFloor: 0,
            currentEvent: null,
          },
          activeRun: victoryRun,
          isGameOver: true,
        }
      }

      // Process unique item effects for floor advancement
      let floorAdvanceEffectMessage: string | null = null
      let floorAdvanceEffects: import('@/systems/events/eventResolver').ResolvedEffect[] = []
      
      if (completingFloor && updatedParty.some(h => h !== null && h.isAlive)) {
        const uniqueEffectResult = processUniqueEffects(updatedParty, 'onFloorAdvance', {
          floor: newFloor
        })
        
        if (uniqueEffectResult) {
          updatedParty = uniqueEffectResult.party
          floorAdvanceEffectMessage = uniqueEffectResult.message || null
          floorAdvanceEffects = uniqueEffectResult.additionalEffects || []
          
          // Update roster with modified party
          const updatedRosterWithEffects = state.heroRoster.map(rosterHero => {
            const updatedVersion = updatedParty.find(h => h?.id === rosterHero.id)
            return updatedVersion || rosterHero
          })
          
          // Store for later use
          updatedRoster.length = 0
          updatedRoster.push(...updatedRosterWithEffects)
        }
      }

      const event = getNextEvent(newDepth, newFloor, isNextEventBoss, isMajorBoss, state.dungeon.eventHistory)

      // Create resurrection outcome if any heroes were revived or if unique effects triggered
      const resurrectionMessages: string[] = []
      const allEffects: import('@/systems/events/eventResolver').ResolvedEffect[] = []
      
      if (resurrectedHeroes.length > 0) {
        resurrectionMessages.push(
          resurrectedHeroes.length === 1 
            ? `${resurrectedHeroes[0]}'s Amulet of Resurrection shatters in a blinding flash! They are revived with half health.`
            : `The Amulets of Resurrection shatter in blinding flashes! ${resurrectedHeroes.join(', ')} revived with half health.`
        )
      }
      
      if (floorAdvanceEffectMessage) {
        resurrectionMessages.push(floorAdvanceEffectMessage)
      }
      
      if (floorAdvanceEffects.length > 0) {
        allEffects.push(...floorAdvanceEffects)
      }
      
      const resurrectionOutcome = resurrectionMessages.length > 0 ? {
        text: resurrectionMessages.join('\n\n'),
        effects: allEffects,
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
          eventsThisFloor: resetEvents,
          eventsRequiredThisFloor: newEventsRequired,
          currentEvent: event,
          eventHistory: event ? [...state.dungeon.eventHistory, event.id] : state.dungeon.eventHistory,
          isNextEventBoss,
          bossType: isNextEventBoss ? (isMajorBoss ? 'major' : 'floor') : null,
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

      // Process unique item effects at combat start
      let partyForCombat = state.party
      let combatStartEffectMessage: string | null = null
      let combatStartEffects: ResolvedEffect[] = []
      
      if ((currentEvent.type === 'combat' || currentEvent.type === 'boss') && state.party.some(h => h !== null && h.isAlive)) {
        const uniqueEffectResult = processUniqueEffects(state.party, 'onCombatStart', {
          eventType: currentEvent.type,
          floor: state.dungeon.floor
        })
        
        if (uniqueEffectResult) {
          partyForCombat = uniqueEffectResult.party
          combatStartEffectMessage = uniqueEffectResult.message || null
          combatStartEffects = uniqueEffectResult.additionalEffects || []
          
          // Check if party wiped from unique effects (e.g., Demon Coreflail radiation)
          const wipedFromUniqueEffects = partyForCombat.every(h => h !== null && !h.isAlive)
          if (wipedFromUniqueEffects) {
            // Handle wipe before combat even starts
            const wipeRun = state.activeRun ? {
              ...state.activeRun,
              finalDepth: state.dungeon.depth,
              finalFloor: state.dungeon.floor,
              result: 'defeat' as const,
              endDate: Date.now(),
            } : null

            return {
              party: partyForCombat,
              dungeon: {
                ...state.dungeon,
                currentEvent: null,
              },
              activeRun: wipeRun,
              isGameOver: true,
              lastOutcome: {
                text: uniqueEffectResult.message || 'The party has been wiped out by a cursed item\'s effect!',
                effects: uniqueEffectResult.additionalEffects || [],
                items: []
              }
            }
          }
        }
      }

      // First resolve which outcome to use (handles weighted/success-fail/single)
      const selectedOutcome = resolveChoiceOutcome(choice, partyForCombat)

      const { updatedParty, updatedGold, metaXpGained, xpMentored, resolvedOutcome } = resolveEventOutcome(
        selectedOutcome,
        partyForCombat,
        state.dungeon,
        currentEvent
      )

      // Prepend combat start effects to resolved outcome
      if (combatStartEffectMessage) {
        resolvedOutcome.text = `${combatStartEffectMessage}\n\n${resolvedOutcome.text}`
      }
      if (combatStartEffects.length > 0) {
        resolvedOutcome.effects.unshift(...combatStartEffects)
      }

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

      // Process unique item effects (e.g., Heart of the Phoenix on boss defeat)
      if (currentEvent.type === 'boss') {
        const uniqueEffectResult = processUniqueEffects(updatedParty, 'onBossDefeat', {
          eventType: currentEvent.type,
          resolvedOutcome,
          floor: state.dungeon.floor
        })
        
        if (uniqueEffectResult) {
          // Use the updated party from unique effects
          const updatedPartyFromEffects = uniqueEffectResult.party
          
          // Add effects to the resolved outcome
          if (uniqueEffectResult.additionalEffects) {
            uniqueEffectResult.additionalEffects.forEach((effect: ResolvedEffect) => {
              resolvedOutcome.effects.push(effect)
              
              // Track statistics
              if (effect.type === 'revive') {
                revivals += effect.target.length
                effect.target.forEach((heroId: string) => {
                  const hero = updatedPartyFromEffects.find(h => h?.id === heroId)
                  if (hero) heroesAffected.add(hero.name)
                })
              }
            })
          }
          
          // Update the main party state with the modified party
          set({ party: updatedPartyFromEffects })
        }
      }

      // Create event log entry
      const eventLogEntry: import('@/types').EventLogEntry = {
        eventId: currentEvent.id,
        eventTitle: Array.isArray(currentEvent.title) ? currentEvent.title[0] : currentEvent.title,
        eventType: currentEvent.type,
        floor: state.dungeon.floor,
        depth: state.dungeon.depth,
        choiceMade: Array.isArray(choice.text) ? choice.text[0] : choice.text,
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
        eventTitle: Array.isArray(currentEvent.title) ? currentEvent.title[0] : currentEvent.title,
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
      let completedRun: Run | null = null
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
      const eventTypeStats: Partial<Run> = {}
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
      const completedRun: Run = {
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
        const completedRun: Run = {
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
        const completedRun: Run = {
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

  applyBossVictoryRewards: (bossEvent) =>
    set((state) => {
      if (!bossEvent || !bossEvent.choices[0] || !bossEvent.choices[0].outcome) {
        console.error('Invalid boss event for rewards')
        return state
      }

      // Use first choice's outcome as victory rewards
      const victoryOutcome = bossEvent.choices[0].outcome

      // Process rewards using event resolver
      const { updatedParty, updatedGold, metaXpGained, resolvedOutcome } = resolveEventOutcome(
        victoryOutcome,
        state.party,
        state.dungeon,
        bossEvent
      )

      // Track statistics from resolved outcome
      let damageDealt = 0
      let damageTaken = 0
      let healingReceived = 0
      let xpGained = metaXpGained
      let revivals = 0
      const heroesAffected = new Set<string>()

      resolvedOutcome.effects.forEach(effect => {
        if (effect.type === 'damage') {
          damageTaken += effect.value || 0
          if (effect.target) {
            effect.target.forEach((heroId: string) => {
              const hero = state.party.find(h => h?.id === heroId)
              if (hero) heroesAffected.add(hero.name)
            })
          }
        } else if (effect.type === 'heal') {
          healingReceived += effect.value || 0
          if (effect.target) {
            effect.target.forEach((heroId: string) => {
              const hero = state.party.find(h => h?.id === heroId)
              if (hero) heroesAffected.add(hero.name)
            })
          }
        } else if (effect.type === 'revive') {
          revivals += effect.target?.length || 0
          if (effect.target) {
            effect.target.forEach((heroId: string) => {
              const hero = updatedParty.find(h => h?.id === heroId)
              if (hero) heroesAffected.add(hero.name)
            })
          }
        } else if (effect.type === 'xp') {
          if (effect.target) {
            effect.target.forEach((heroId: string) => {
              const hero = state.party.find(h => h?.id === heroId)
              if (hero) heroesAffected.add(hero.name)
            })
          }
        }
      })

      // Update roster with modified party
      const updatedRoster = state.heroRoster.map(rosterHero => {
        const updatedVersion = updatedParty.find(h => h?.id === rosterHero.id)
        return updatedVersion || rosterHero
      })

      // Create event log entry
      const eventLogEntry: import('@/types').EventLogEntry = {
        eventId: bossEvent.id,
        eventTitle: Array.isArray(bossEvent.title) ? bossEvent.title[0] : bossEvent.title,
        eventType: bossEvent.type,
        floor: state.dungeon.floor,
        depth: state.dungeon.depth,
        choiceMade: 'Victory',
        outcomeText: `Defeated ${Array.isArray(bossEvent.title) ? bossEvent.title[0] : bossEvent.title}! ${resolvedOutcome.text}`,
        goldChange: updatedGold - state.dungeon.gold,
        itemsGained: resolvedOutcome.items.map(item => item.name),
        damageDealt,
        damageTaken,
        healingReceived,
        xpGained,
        heroesAffected: Array.from(heroesAffected)
      }

      // Update active run
      const updatedRun = state.activeRun ? {
        ...state.activeRun,
        finalDepth: state.dungeon.depth,
        finalFloor: state.dungeon.floor,
        eventsCompleted: state.activeRun.eventsCompleted + 1
      } : null

      return {
        party: updatedParty,
        heroRoster: updatedRoster,
        dungeon: {
          ...state.dungeon,
          gold: updatedGold,
          inventory: [...state.dungeon.inventory, ...resolvedOutcome.items],
          eventLog: [...state.dungeon.eventLog, eventLogEntry],
        },
        activeRun: updatedRun,
        lastOutcome: resolvedOutcome,
      }
    }),
})

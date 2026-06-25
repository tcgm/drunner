/**
 * Multiplayer service — all socket event listeners and Zustand subscriptions
 * live here, completely outside React.
 *
 * startMultiplayerService(role, roomCode) is called from multiplayerStore when
 * a room is created or joined.  stopMultiplayerService() is called on leaveRoom.
 *
 * Action helpers (claimSlot, releaseSlot, distributeRunEnd, pickDraftItem) are
 * plain exported functions that read from stores via getState() — no hooks.
 */

import { getSocket } from './socket'
import { useMultiplayerStore } from './multiplayerStore'
import { useGameStore } from '@/core/gameStore'
import { useSessionStore } from './sessionStore'
import { recordVote, initVotes, clearVotes, recordNodeVote, initNodeVotes, clearNodeVotes } from './voteManager'
import { initializeBossCombatState } from '@/systems/combat'
import { GAME_CONFIG } from '@/config/gameConfig'
import type { MultiplayerSyncState, GuestAction, DraftState, SlotAssignment, PlayerProfile } from './types'
import type { Hero, Item, DungeonEvent } from '@/types'

// ── Service lifecycle ─────────────────────────────────────────────────────────

let _stopService: (() => void) | null = null

export function startMultiplayerService(role: 'host' | 'guest', roomCode: string): void {
    if (_stopService) _stopService()

    const socket = getSocket()
    const cleanups: Array<() => void> = []

    // Helper: register listener and queue its removal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const on = (event: string, fn: (...args: any[]) => void) => {
        socket.on(event, fn)
        cleanups.push(() => socket.off(event, fn))
    }

    // ── Common: profile broadcast ─────────────────────────────────────────────
    const profileState = { prevSerialized: '' }

    const broadcastProfile = () => {
        if (!socket.id) return
        const { localPlayerName } = useMultiplayerStore.getState()
        const { party, bankGold } = useGameStore.getState()
        const profile: PlayerProfile = {
            playerId: socket.id,
            playerName: localPlayerName,
            heroRosterPreview: party
                .filter((h): h is Hero => h !== null)
                .map((h) => ({
                    id: h.id,
                    name: h.name,
                    className: h.class.name,
                    classIcon: h.class.icon,
                    level: h.level,
                })),
            bankGold,
            currentLocation: 'town',
        }
        const s = JSON.stringify(profile)
        if (s === profileState.prevSerialized) return
        profileState.prevSerialized = s
        useSessionStore.getState().updatePlayerProfile(socket.id, profile)
        socket.emit('broadcast-profile', { code: roomCode, profile })
    }

    on('profile-request', () => { profileState.prevSerialized = ''; broadcastProfile() })

    // Re-broadcast when party or gold changes
    cleanups.push(useGameStore.subscribe((s, prev) => {
        if (s.party !== prev.party || s.bankGold !== prev.bankGold) broadcastProfile()
    }))

    // ── Common: slot ownership + profile cleanup on player count change ────────
    useSessionStore.getState().initSlotOwnership(useMultiplayerStore.getState().players.length)
    cleanups.push(useMultiplayerStore.subscribe((s, prev) => {
        if (s.players.length === prev.players.length) return
        useSessionStore.getState().initSlotOwnership(s.players.length)
        const activeIds = s.players.map((p) => p.id)
        for (const pid of Object.keys(useSessionStore.getState().playerProfiles)) {
            if (!activeIds.includes(pid)) useSessionStore.getState().removePlayerProfile(pid)
        }
    }))

    // Initial profile broadcast
    broadcastProfile()

    // ── Role-specific setup ───────────────────────────────────────────────────
    if (role === 'host') {
        _setupHost(on, cleanups, socket, roomCode)
    } else {
        _setupGuest(on, cleanups, socket, roomCode)
    }

    _stopService = () => {
        for (const fn of cleanups) fn()
        _stopService = null
    }
}

export function stopMultiplayerService(): void {
    if (_stopService) _stopService()
}

// ── Host setup ────────────────────────────────────────────────────────────────

function _setupHost(
    on: (event: string, fn: (...args: unknown[]) => void) => void,
    cleanups: Array<() => void>,
    socket: ReturnType<typeof getSocket>,
    roomCode: string,
) {
    let prevGameSerialized = ''
    let prevEventId: string | null | undefined = undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prevFloorMap: any = undefined

    // Broadcast game state on every change
    cleanups.push(useGameStore.subscribe((state) => {
        const sync = _extractSync(state)
        const serialized = JSON.stringify(sync)
        if (serialized === prevGameSerialized) return
        prevGameSerialized = serialized
        socket.emit('state-update', { code: roomCode, state: sync })

        const eventId = state.dungeon.currentEvent?.id ?? null
        if (eventId !== prevEventId) {
            prevEventId = eventId
            if (eventId !== null) initVotes(useMultiplayerStore.getState().players.length, roomCode)
            else clearVotes()
        }

        const currentFloorMap = state.dungeon.floorMap ?? null
        if (currentFloorMap !== prevFloorMap) {
            prevFloorMap = currentFloorMap
            if (currentFloorMap !== null) initNodeVotes(useMultiplayerStore.getState().players.length, roomCode)
            else clearNodeVotes()
        }
    }))

    // Re-sync vote count when players join or leave
    cleanups.push(useMultiplayerStore.subscribe((s, prev) => {
        if (s.players.length === prev.players.length) return
        const currentEventId = useGameStore.getState().dungeon.currentEvent?.id ?? null
        if (currentEventId !== null) initVotes(s.players.length, roomCode)
        const currentFloorMap = useGameStore.getState().dungeon.floorMap ?? null
        if (currentFloorMap !== null) initNodeVotes(s.players.length, roomCode)
    }))

    // Initial vote sync if event or floor map is already active
    const currentEventId = useGameStore.getState().dungeon.currentEvent?.id ?? null
    if (currentEventId !== null) initVotes(useMultiplayerStore.getState().players.length, roomCode)
    const initialFloorMap = useGameStore.getState().dungeon.floorMap ?? null
    if (initialFloorMap !== null) initNodeVotes(useMultiplayerStore.getState().players.length, roomCode)

    cleanups.push(() => { clearVotes(); clearNodeVotes() })

    // Guest action requests
    on('guest-action', ({ action }: { playerId: string; playerName: string; action: GuestAction }) => {
        const store = useGameStore.getState()
        switch (action.type) {
            case 'advance-dungeon': store.advanceDungeon(); break
            case 'select-choice': {
                const event = store.dungeon.currentEvent
                if (event && action.choiceIndex >= 0 && action.choiceIndex < event.choices.length)
                    store.selectChoice(event.choices[action.choiceIndex])
                break
            }
            case 'select-map-node': store.selectMapNode(action.nodeId); break
            case 'retreat': store.retreatFromDungeon(); break
            case 'start-dungeon': store.startDungeon(action.startingFloor, action.alkahestCost); break
            case 'combat-action':
                useSessionStore.getState().setCombatQueueEntry(action.heroId, action.action)
                break
        }
    })

    on('cast-vote', ({ playerId, choiceIndex }: { playerId: string; choiceIndex: number }) => {
        recordVote(playerId, choiceIndex)
    })

    on('cast-node-vote', ({ playerId, nodeId }: { playerId: string; nodeId: string }) => {
        recordNodeVote(playerId, nodeId)
    })

    on('update-slot-hero', ({ playerId, slotIndex, hero }: { playerId: string; slotIndex: number; hero: Hero }) => {
        const assignment = useSessionStore.getState().slotAssignments[slotIndex]
        if (assignment?.playerId !== playerId) return
        useGameStore.getState().updateGuestHeroAtSlot(hero, slotIndex)
        const updatedAssignment = { ...assignment, heroSnapshot: hero }
        useSessionStore.getState().setSlotAssignment(slotIndex, updatedAssignment)
    })

    on('player-ready', ({ playerId }: { playerId: string }) => {
        const session = useSessionStore.getState()
        const updated = session.readyPlayers.includes(playerId)
            ? session.readyPlayers
            : [...session.readyPlayers, playerId]
        session.setReadyPlayers(updated)
        socket.emit('ready-update', { code: roomCode, readyPlayers: updated })
    })

    on('guest-slot-claimed', ({
        playerId, playerName, slotIndex, heroSnapshot, heroSourceId,
    }: {
        playerId: string; playerName: string; slotIndex: number
        heroSnapshot: Hero; heroSourceId: string
    }) => {
        useGameStore.getState().setGuestHeroAtSlot(heroSnapshot, slotIndex)
        const assignment: SlotAssignment = { playerId, playerName, heroSnapshot, heroSourceId }
        useSessionStore.getState().setSlotAssignment(slotIndex, assignment)
        const assignments = { ...useSessionStore.getState().slotAssignments, [slotIndex]: assignment }
        socket.emit('slot-assignments-update', { code: roomCode, assignments })
    })

    on('guest-slot-released', ({ playerId, slotIndex }: { playerId: string; slotIndex: number }) => {
        const assignment = useSessionStore.getState().slotAssignments[slotIndex]
        if (assignment?.playerId !== playerId) return
        useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
        useSessionStore.getState().setSlotAssignment(slotIndex, null)
        const assignments = { ...useSessionStore.getState().slotAssignments, [slotIndex]: null }
        socket.emit('slot-assignments-update', { code: roomCode, assignments })
    })

    on('request-boss-state', ({ requesterId }: { requesterId: string }) => {
        const { inBossCombat, bossEvent } = useMultiplayerStore.getState()
        if (!inBossCombat || !bossEvent) {
            console.log('[MultiplayerService] host: request-boss-state ignored, not in boss combat')
            return
        }
        const { combatState: _cs, ...ev } = bossEvent
        console.log('[MultiplayerService] host: sending boss state to', requesterId)
        socket.emit('boss-combat-start-to', { event: ev, targetId: requesterId })
    })

    // Also respond to late-joining players during active boss fight, and re-broadcast state
    on('player-joined', ({ player }: { player: { id: string } }) => {
        // Re-broadcast current game state so the new guest sees up-to-date party/dungeon immediately
        const sync = _extractSync(useGameStore.getState())
        socket.emit('state-update', { code: roomCode, state: sync })

        const { inBossCombat, bossEvent } = useMultiplayerStore.getState()
        if (!inBossCombat || !bossEvent) return
        const { combatState: _cs, ...ev } = bossEvent
        socket.emit('boss-combat-start-to', { event: ev, targetId: player.id })
    })

    on('player-profile-update', ({ playerId, profile }: { playerId: string; profile: PlayerProfile }) => {
        useSessionStore.getState().updatePlayerProfile(playerId, profile)
    })
}

// ── Guest setup ───────────────────────────────────────────────────────────────

function _setupGuest(
    on: (event: string, fn: (...args: unknown[]) => void) => void,
    cleanups: Array<() => void>,
    socket: ReturnType<typeof getSocket>,
    roomCode: string,
) {
    // Clear party slots that don't belong to this guest so stale heroes from previous
    // sessions don't appear in the host's slots until the first state-update arrives.
    const { players } = useMultiplayerStore.getState()
    const myPlayerIdx = players.findIndex((p) => p.id === socket.id)
    const session = useSessionStore.getState()
    const ownership = session.slotOwnershipByIndex
    if (myPlayerIdx >= 0 && ownership.length > 0) {
        for (let i = 0; i < ownership.length; i++) {
            if (ownership[i] !== myPlayerIdx) {
                useGameStore.getState().clearGuestHeroAtSlot(i)
            }
        }
    }

    // Boss state polling: if on a boss event but not in combat, poll every 2s
    let bossPollInterval: ReturnType<typeof setInterval> | null = null

    const stopBossPoll = () => {
        if (bossPollInterval) { clearInterval(bossPollInterval); bossPollInterval = null }
    }
    cleanups.push(stopBossPoll)

    const startBossPollIfNeeded = () => {
        const { inBossCombat: active, roomCode: rc } = useMultiplayerStore.getState()
        if (active) { stopBossPoll(); return }
        const ev = useGameStore.getState().dungeon.currentEvent
        const needsBoss = ev && ev.type === 'boss' &&
            (ev.isZoneBoss || ev.isFinalBoss || GAME_CONFIG.combat.turnBased.floorBossesHaveCombat)
        if (!needsBoss || !rc) { stopBossPoll(); return }
        if (bossPollInterval) return // already polling
        socket.emit('request-boss-state', { code: rc })
        bossPollInterval = setInterval(() => {
            const { inBossCombat: curr, roomCode: rc2 } = useMultiplayerStore.getState()
            if (curr || !rc2) { stopBossPoll(); return }
            socket.emit('request-boss-state', { code: rc2 })
        }, 2000)
    }

    cleanups.push(useGameStore.subscribe((s, prev) => {
        if (s.dungeon.currentEvent?.id !== prev.dungeon.currentEvent?.id) startBossPollIfNeeded()
    }))
    cleanups.push(useMultiplayerStore.subscribe((s, prev) => {
        if (s.inBossCombat !== prev.inBossCombat) startBossPollIfNeeded()
    }))

    on('state-update', (state: MultiplayerSyncState) => {
        const local = useGameStore.getState()
        if (state.activeRun?.result === 'active') {
            local.applyMultiplayerState(state)
        } else {
            // During prep: apply host's party for host-owned slots, keep local party for guest-owned slots.
            // This lets guests see the host's heroes in real-time while preserving their own claimed heroes.
            const session = useSessionStore.getState()
            const players = useMultiplayerStore.getState().players
            const myPlayerIdx = players.findIndex((p) => p.id === socket.id)
            const mySlots = myPlayerIdx >= 0
                ? session.slotOwnershipByIndex.reduce<number[]>((acc, owner, i) => {
                    if (owner === myPlayerIdx) acc.push(i)
                    return acc
                }, [])
                : []
            const mergedParty = state.party.map((hero, i) =>
                mySlots.includes(i) ? local.party[i] : hero
            ) as typeof state.party
            local.applyMultiplayerState({ ...state, party: mergedParty, dungeon: local.dungeon })
        }
    })

    on('node-vote-update', ({ votes, totalPlayers }: { votes: Record<string, string>; totalPlayers: number }) => {
        useSessionStore.getState().setNodeVoteState({ votes, totalPlayers })
    })

    on('vote-update', ({ votes, totalPlayers }: { votes: Record<string, number>; totalPlayers: number }) => {
        useSessionStore.getState().setVoteState({ votes, totalPlayers })
    })

    on('draft-start', (ds: Omit<DraftState, 'picks'> & { picks?: Record<string, Item[]> }) => {
        useSessionStore.getState().setDraftState({ ...ds, picks: ds.picks ?? {} } as DraftState)
    })

    on('draft-update', ({
        pool, picks, currentPickerIndex, order,
    }: {
        pool: DraftState['pool']; picks: DraftState['picks']
        currentPickerIndex: number; order: string[]
    }) => {
        const current = useSessionStore.getState().draftState
        if (!current) return
        useSessionStore.getState().setDraftState({ ...current, pool, picks, currentPickerIndex, order })
    })

    on('ready-update', ({ readyPlayers }: { readyPlayers: string[] }) => {
        useSessionStore.getState().setReadyPlayers(readyPlayers)
    })

    on('slot-assignments-update', ({ assignments }: { assignments: Record<number, SlotAssignment | null> }) => {
        useSessionStore.getState().setSlotAssignments(assignments)
    })

    on('run-ended', ({ heroReturns, loot, gold, run }: {
        heroReturns: Record<string, Hero>; loot: Item[]; gold: number; run: unknown
    }) => {
        const store = useGameStore.getState()
        for (const [heroSourceId, updatedHero] of Object.entries(heroReturns)) {
            store.applyHeroReturn(heroSourceId, updatedHero as Hero)
        }
        if (loot.length > 0 || gold > 0) store.applyRunLoot(loot as Item[], gold)
        if (run && typeof (store as Record<string, unknown>).processRunForQuests === 'function') {
            ; (store as Record<string, unknown>).processRunForQuests(run)
        }
    })

    on('player-profile-update', ({ playerId, profile }: { playerId: string; profile: PlayerProfile }) => {
        useSessionStore.getState().updatePlayerProfile(playerId, profile)
    })

    on('boss-combat-start', ({ event }: { event: DungeonEvent }) => {
        console.log('[MultiplayerService] guest received boss-combat-start', event?.id)
        try {
            const localDungeon = useGameStore.getState().dungeon
            useMultiplayerStore.getState().setBossCombat({
                ...event,
                combatState: initializeBossCombatState(event, localDungeon),
            })
        } catch (err) {
            console.error('[MultiplayerService] guest boss-combat-start failed:', err)
        }
    })

    on('boss-combat-end', () => {
        useMultiplayerStore.getState().clearBossCombat()
    })

    on('connect', () => {
        console.log('[MultiplayerService] guest reconnected, re-requesting boss state')
        socket.emit('request-boss-state', { code: roomCode })
    })

    // On service start, request current boss state in case we joined mid-fight
    socket.emit('request-boss-state', { code: roomCode })

    // Initial check in case we're already on a boss event
    startBossPollIfNeeded()
}

// ── Action helpers (called from UI, read from stores — no hooks) ──────────────

/** Guests call this after equipping/unequipping to keep the host's party slot in sync. */
export function syncGuestSlotHero(slotIndex: number, hero: Hero): void {
    const { role, roomCode } = useMultiplayerStore.getState()
    if (role !== 'guest' || !roomCode) return
    getSocket().emit('update-slot-hero', { code: roomCode, slotIndex, hero })
}

export function claimSlot(slotIndex: number, hero: Hero): void {
    const { role, roomCode } = useMultiplayerStore.getState()
    if (!roomCode) return
    const socket = getSocket()

    if (role === 'host') {
        useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
        useGameStore.getState().setGuestHeroAtSlot(hero, slotIndex)
        const assignment: SlotAssignment = {
            playerId: socket.id ?? 'host',
            playerName: useMultiplayerStore.getState().localPlayerName,
            heroSnapshot: hero,
            heroSourceId: hero.id,
        }
        useSessionStore.getState().setSlotAssignment(slotIndex, assignment)
        const assignments = { ...useSessionStore.getState().slotAssignments, [slotIndex]: assignment }
        socket.emit('slot-assignments-update', { code: roomCode, assignments })
    } else if (role === 'guest') {
        socket.emit('claim-slot', { code: roomCode, slotIndex, heroSnapshot: hero, heroSourceId: hero.id })
    }
}

export function releaseSlot(slotIndex: number): void {
    const { role, roomCode } = useMultiplayerStore.getState()
    if (!roomCode) return
    const socket = getSocket()

    if (role === 'host') {
        useGameStore.getState().clearGuestHeroAtSlot(slotIndex)
        useSessionStore.getState().setSlotAssignment(slotIndex, null)
        const assignments = { ...useSessionStore.getState().slotAssignments, [slotIndex]: null }
        socket.emit('slot-assignments-update', { code: roomCode, assignments })
    } else if (role === 'guest') {
        socket.emit('release-slot', { code: roomCode, slotIndex })
    }
}

export function distributeRunEnd(): void {
    const { role, roomCode, players } = useMultiplayerStore.getState()
    if (role !== 'host' || !roomCode) return

    const socket = getSocket()
    const gameState = useGameStore.getState()
    const sessionState = useSessionStore.getState()
    const assignments = sessionState.slotAssignments
    const dungeonItems = gameState.dungeon.inventory ?? []
    const dungeonGold = gameState.dungeon.gold ?? 0

    const heroReturnsByPlayer: Record<string, Record<string, Hero>> = {}
    for (const [slotStr, assignment] of Object.entries(assignments)) {
        if (!assignment) continue
        const slotIdx = Number(slotStr)
        const updatedHero = gameState.party[slotIdx]
        if (!updatedHero) continue
        const { playerId, heroSourceId } = assignment
        if (!heroReturnsByPlayer[playerId]) heroReturnsByPlayer[playerId] = {}
        heroReturnsByPlayer[playerId][heroSourceId] = updatedHero
    }

    const allPlayerIds = players.map((p) => p.id)
    const goldPerPlayer = Math.floor(dungeonGold / (allPlayerIds.length || 1))
    const goldByPlayer: Record<string, number> = {}
    for (const pid of allPlayerIds) goldByPlayer[pid] = goldPerPlayer

    const run = gameState.activeRun

    if (dungeonItems.length === 0) {
        _applyRunEnd(socket, roomCode, heroReturnsByPlayer, {}, goldByPlayer, run, allPlayerIds, sessionState)
        return
    }

    const draftState: DraftState = {
        pool: dungeonItems,
        picks: Object.fromEntries(allPlayerIds.map((id) => [id, []])) as Record<string, Item[]>,
        goldByPlayer,
        heroReturnsByPlayer,
        order: allPlayerIds,
        currentPickerIndex: 0,
        run,
    }

    sessionState.setDraftState(draftState)
    socket.emit('draft-start', {
        code: roomCode,
        pool: draftState.pool,
        picks: draftState.picks,
        goldByPlayer,
        heroReturnsByPlayer,
        order: draftState.order,
        run,
    })

    const handleDraftPick = ({ playerId, itemIndex }: { playerId: string; itemIndex: number }) => {
        const current = useSessionStore.getState().draftState
        if (!current) return
        const currentPicker = current.order[current.currentPickerIndex % current.order.length]
        if (playerId !== currentPicker) return
        _processDraftPick(socket, roomCode, current, itemIndex, useSessionStore.getState(), allPlayerIds, run)
    }

    socket.on('draft-pick', handleDraftPick)
        ; (socket as typeof socket & { _draftCleanup?: () => void })._draftCleanup =
            () => socket.off('draft-pick', handleDraftPick)

    sessionState.clearSlotAssignments()
}

export function pickDraftItem(itemIndex: number): void {
    const { role, roomCode, players } = useMultiplayerStore.getState()
    if (!roomCode) return

    const socket = getSocket()

    if (role === 'host') {
        const sessionState = useSessionStore.getState()
        const current = sessionState.draftState
        if (!current) return
        _processDraftPick(socket, roomCode, current, itemIndex, sessionState, players.map((p) => p.id), current.run)
    } else if (role === 'guest') {
        socket.emit('draft-pick', { code: roomCode, itemIndex })
    }
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function _extractSync(state: ReturnType<typeof useGameStore.getState>): MultiplayerSyncState {
    return {
        dungeon: state.dungeon,
        party: state.party,
        isGameOver: state.isGameOver,
        isPaused: state.isPaused,
        lastOutcome: state.lastOutcome,
        activeRun: state.activeRun,
    }
}

function _processDraftPick(
    socket: ReturnType<typeof getSocket>,
    roomCode: string,
    current: DraftState,
    itemIndex: number,
    sessionState: ReturnType<typeof useSessionStore.getState>,
    allPlayerIds: string[],
    run: unknown,
) {
    if (itemIndex < 0 || itemIndex >= current.pool.length) return

    const pickedItem = current.pool[itemIndex]
    const newPool = current.pool.filter((_, i) => i !== itemIndex)
    const currentPicker = current.order[current.currentPickerIndex % current.order.length]
    const newPicks = {
        ...current.picks,
        [currentPicker]: [...(current.picks[currentPicker] ?? []), pickedItem],
    }
    const newPickerIndex = current.currentPickerIndex + 1

    if (newPool.length === 0) {
        sessionState.setDraftState(null)
        const lootByPlayer: Record<string, Item[]> = Object.fromEntries(
            allPlayerIds.map((id) => [id, newPicks[id] ?? []]),
        )
        _applyRunEnd(socket, roomCode, current.heroReturnsByPlayer, lootByPlayer, current.goldByPlayer, run, allPlayerIds, sessionState)
        const s = socket as typeof socket & { _draftCleanup?: () => void }
        if (s._draftCleanup) { s._draftCleanup(); s._draftCleanup = undefined }
    } else {
        const updatedDraft: DraftState = {
            ...current,
            pool: newPool,
            picks: newPicks,
            currentPickerIndex: newPickerIndex,
        }
        sessionState.setDraftState(updatedDraft)
        socket.emit('draft-update', {
            code: roomCode,
            pool: newPool,
            picks: newPicks,
            currentPickerIndex: newPickerIndex,
            order: current.order,
        })
    }
}

function _applyRunEnd(
    socket: ReturnType<typeof getSocket>,
    roomCode: string,
    heroReturnsByPlayer: Record<string, Record<string, Hero>>,
    lootByPlayer: Record<string, Item[]>,
    goldByPlayer: Record<string, number>,
    run: unknown,
    allPlayerIds: string[],
    sessionState: ReturnType<typeof useSessionStore.getState>,
) {
    for (const pid of allPlayerIds) {
        if (!lootByPlayer[pid]) lootByPlayer[pid] = []
        if (!goldByPlayer[pid]) goldByPlayer[pid] = 0
    }

    socket.emit('draft-complete', { code: roomCode, heroReturnsByPlayer, lootByPlayer, goldByPlayer, run })

    const hostId = socket.id
    if (hostId) {
        useGameStore.getState().applyRunLoot(lootByPlayer[hostId] ?? [], goldByPlayer[hostId] ?? 0)
    }

    sessionState.clearSlotAssignments()
    sessionState.setDraftState(null)
}

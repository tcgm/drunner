# Combat System Refactoring Guide

## Problem: React Being React

The current `BossCombatScreen` component has too much business logic mixed with UI concerns, causing issues like:

- Victory checks blocked by `isUnmounting` flag
- Complex useEffect dependency chains
- State synchronization bugs between store and component
- Timing issues with setTimeout in React lifecycle
- Difficulty testing combat logic

## Solution: Separate Business Logic from UI

Extract combat state management into `BossCombatManager` (plain TypeScript class).

## Architecture

### Before (Current)
```
BossCombatScreen (React Component)
├── Combat state (local + store sync)
├── Victory/defeat detection (useEffect)
├── Timer management (setTimeout)
├── Boss turn processing
├── Hero action handling
└── UI rendering
```

### After (Refactored)
```
BossCombatManager (TypeScript Class)
├── Combat state management
├── Victory/defeat detection
├── Timer management
├── State machine (active/victory/defeat)
└── Callbacks for UI updates

BossCombatScreen (React Component)
├── Render UI based on manager state
├── Handle user input (clicks)
├── Display animations
└── Subscribe to manager updates
```

## Usage Example

### 1. Create Manager on Component Mount

```tsx
const BossCombatScreen = ({ event, dungeon, onVictory, onDefeat }) => {
    const managerRef = useRef<BossCombatManager | null>(null)
    const [combatState, setCombatState] = useState<BossCombatState>(event.combatState!)
    const party = useGameStore(state => state.party)

    // Initialize manager once
    useEffect(() => {
        const manager = createCombatManager(
            event,
            dungeon,
            party,
            {
                onVictory: () => {
                    console.log('[Manager] Victory!')
                    onVictory()
                },
                onDefeat: () => {
                    console.log('[Manager] Defeat!')
                    onDefeat()
                },
                onStateUpdate: (newState) => {
                    // Update React state for UI
                    setCombatState(newState)
                    // Also update store if needed
                    updateDungeon({ 
                        currentEvent: { ...event, combatState: newState }
                    })
                },
                onLog: (type, message) => {
                    addLogEntry(type, message)
                }
            }
        )
        
        managerRef.current = manager
        
        // Cleanup on unmount
        return () => {
            manager.destroy()
        }
    }, []) // Empty deps - initialize once

    // Update manager when party changes
    useEffect(() => {
        managerRef.current?.updateParty(party)
    }, [party])

    // Handle hero action
    const handleHeroAction = async (action: string) => {
        const manager = managerRef.current
        if (!manager || manager.isCurrentlyProcessing()) return

        manager.setProcessing(true)
        
        // Execute action (this updates combat state)
        const result = await executeHeroAction(action, combatState, party)
        
        // Update manager with new state
        manager.updateState(result.newState)
        
        // Process boss turn
        await processBossTurn(manager)
        
        manager.setProcessing(false)
    }

    // No more victory/defeat useEffect!
    // Manager handles it automatically on state updates

    return (
        // Render UI based on combatState
        // Display victory overlay based on manager.getStatus()
    )
}
```

### 2. DevTools Integration

```tsx
// DevTools.tsx
const handleInstantKillBoss = () => {
    const event = dungeon.currentEvent
    if (!event?.combatState) return

    const newState = {
        ...event.combatState,
        currentHp: 0
    }

    // Update store
    updateDungeon({
        currentEvent: { ...event, combatState: newState }
    })

    // If component has manager reference, force check
    // (or let the sync effect handle it)
}
```

## Benefits

### ✅ No More React Lifecycle Issues
- Manager doesn't care about mounting/unmounting
- Victory check runs cleanly after every state update
- No `isUnmounting` flag blocking victory detection

### ✅ Cleaner Component Code
- Component just renders UI and handles input
- No complex useEffect chains
- No manual timer management

### ✅ Easier Testing
- Test manager in isolation without React
- Test victory/defeat logic with simple assertions
- Mock callbacks easily

### ✅ Predictable State Flow
```
User Action → Manager Update → Victory Check → Callback → UI Update
```

### ✅ Single Source of Truth
- Manager owns the state machine
- Component reflects manager state
- No sync issues between store and component

## Migration Steps

1. ✅ Create `CombatManager` class (done)
2. ✅ Export from combat system (done)
3. ✅ Refactor `BossCombatScreen` to use manager (done)
4. ✅ Remove victory/defeat useEffect (done)
5. ✅ Remove `isUnmounting` flag (done - never existed)
6. ✅ Remove manual timer management (done)
7. ✅ Test victory/defeat flow (done)
8. ✅ Test DevTools instant kill (done)

## Status: ✅ COMPLETE

All migration steps have been completed. The combat manager is fully integrated into `BossCombatScreen` and handles:
- Combat state lifecycle management
- Victory/defeat detection via callbacks
- State updates without React lifecycle issues
- Proper cleanup on unmount

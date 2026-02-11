# Boss Combat System - Phase 3 Complete

## Overview

The combat system is now fully functional for turn-based boss battles with:

- ✅ **Speed-based turn order** - Fastest acts first, recalculated each round
- ✅ **Boss targeting intelligence** - Danger-scaled targeting (random → low HP → priority targets)
- ✅ **Frontline guard system** - Slots 0-1 protect slots 2-3
- ✅ **Boss abilities** - Cooldown-based with triggers (HP threshold, turn start, always, phase change)
- ✅ **Attack patterns** - Weighted selection with conditions (single, AOE, multi, cleave)
- ✅ **Phase transitions** - HP-threshold based with stat modifiers and ability changes
- ✅ **Effect tracking** - Buffs/debuffs/status effects with duration management
- ✅ **Passive healing** - Boss regeneration per turn
- ✅ **Cooldown system** - Abilities and items tracked separately during combat

## Module Structure

```
src/systems/combat/
├── dangerCalculation.ts   # Danger level calculation (floor + depth + combat depth)
├── bossStats.ts          # Boss stat scaling and recalculation
├── combatState.ts        # Combat state initialization
├── turnOrder.ts          # Speed-based turn order calculation
├── targeting.ts          # Intelligent boss targeting system
├── attackPatterns.ts     # Attack pattern selection and execution
├── abilities.ts          # Boss ability triggers and execution
├── phases.ts             # Phase transition system
├── effects.ts            # Buff/debuff/status effects and cooldowns
├── combatFlow.ts         # Main combat loop orchestration
├── examples.ts           # Usage examples
└── index.ts              # Public API exports
```

## Usage Example

```typescript
import {
    initializeBossCombatState,
    startCombatRound,
    processBossTurn,
    processRoundEnd,
    checkVictory,
    checkDefeat,
    getCurrentCombatant,
    advanceTurn,
    isCombatActive,
} from '@/systems/combat'

// 1. Initialize combat
const combatState = initializeBossCombatState(bossEvent, dungeon)
startCombatRound(combatState, party)

// 2. Combat loop
while (isCombatActive(combatState, party)) {
    const current = getCurrentCombatant(combatState)
    
    if (!current) {
        // Round ended - process effects
        processRoundEnd(combatState, party)
        continue
    }
    
    if (current.type === 'boss') {
        // Boss turn
        const result = processBossTurn(combatState, party)
        // Display results to UI
    } else {
        // Hero turn - wait for player input
        // (handled by UI layer)
    }
    
    // Advance to next combatant
    advanceTurn(combatState)
    
    // Check end conditions
    if (checkVictory(combatState)) {
        // Boss defeated!
        break
    }
    if (checkDefeat(party)) {
        // All heroes dead
        break
    }
}
```

## Boss Turn Flow

1. **Check phase transitions** - HP thresholds trigger phase changes
2. **Apply passive healing** - If `healPerTurn` is defined
3. **Check ability triggers** - Execute triggered abilities (respecting cooldowns)
4. **Select attack pattern** - Weighted random selection, filtered by conditions
5. **Execute attack** - Intelligent targeting, apply damage with crits/dodges

## Round End Flow

1. **Increment combat depth** - `combatDepth++`
2. **Process status effects** - Poison, regen, burn, etc. (custom behaviors)
3. **Process buff/debuff durations** - Decrement by 1, remove expired
4. **Decrement cooldowns** - Abilities and items
5. **Recalculate turn order** - Speed may have changed from buffs/debuffs

## Boss Targeting Intelligence

### Low Danger (Floors 1-20)
- Random targeting or highest HP
- No tactical priority

### Mid Danger (Floors 21-60)
- Prefer low HP targets
- 30% chance to target healers/support if backline exposed
- Some tactical awareness

### High Danger (Floors 61+)
- Prioritize: Healers > Support > Damage Dealers
- Always targets high-value backline if exposed
- Intelligent target selection

### Frontline Guard
- Slots 0-1 = frontline (must be attacked first)
- Slots 2-3 = backline (protected until frontline falls)
- AOE and special abilities can bypass guard

## Attack Pattern Types

### Single
- Targets one hero based on intelligence
- Can crit based on pattern `critChance` or boss luck
- Heroes can dodge based on their luck

### AOE
- Hits all alive heroes
- Reduced damage via `aoeDamageReduction` (e.g., 0.6 = 60% damage)
- Bypasses frontline guard

### Multi
- Hits N random heroes (can hit same hero multiple times)
- Configurable via `targetCount`
- Good for pressure/damage spread

### Cleave
- Hits only frontline heroes
- Full damage to all targeted
- Positional attack

## Phase Transitions

Phases trigger at HP thresholds:

```typescript
phases: [
    {
        phase: 2,
        hpThreshold: 0.66, // Activates at 66% HP
        name: 'Enraged Form',
        onEnter: [ENRAGE_ABILITY], // Execute on transition
        addAttackPatterns: [DEVASTATING_STRIKE], // Add new attack
        statModifiers: {
            attack: 20, // +20 base attack
            speed: 10,  // +10 base speed
        },
        healPerTurn: 50, // Start regenerating
    },
    {
        phase: 3,
        hpThreshold: 0.33, // Final phase at 33%
        name: 'Final Form',
        replaceAbilities: [ULTIMATE_ABILITY], // Replace all abilities
        healPerTurn: 100, // Faster regeneration
    },
]
```

## Boss Abilities

Abilities have triggers and cooldowns:

```typescript
{
    id: 'enrage',
    name: 'Enrage',
    cooldown: 3, // Turns between uses
    trigger: 'onHpThreshold',
    hpThreshold: 0.5, // Triggers at 50% HP
    effects: [
        { type: 'buff', value: 50, target: 'self', duration: 999 }
    ]
}
```

### Trigger Types
- `always` - Every turn (respecting cooldown)
- `onTurnStart` - At start of boss turn
- `onHpThreshold` - When HP crosses threshold (once)
- `onPhaseChange` - When entering a specific phase
- `onPlayerAction` - TODO: Implement

## Cooldown System

Cooldowns are tracked separately:
- `combatState.abilityCooldowns` - Boss ability cooldowns
- `combatState.itemCooldowns` - Item usage cooldowns during combat
- Decremented every round end
- Value of 0 = ready to use

## Status Effects

Flexible system supporting custom behaviors:

```typescript
{
    id: 'poison-1',
    type: 'status',
    name: 'Poisoned',
    duration: 5,
    target: 'hero-123',
    behavior: {
        type: 'damagePerTurn',
        damageAmount: 10,
        onRoundEnd: (combatant, state) => {
            // Custom logic here
        }
    }
}
```

### Behavior Types
- `damagePerTurn` - Deal true damage each round (ignores defense)
- `healPerTurn` - Heal each round
- `skipTurn` - Skip turns (stun effect)
- `custom` - Fully custom behavior

## Next Steps (Phase 4 & 5)

Phase 4 will add:
- Hero ability integration with combat
- Item usage during combat
- Revive mechanics (1 full turn action)
- Consumable action economy (1/3 turn actions)
- Flee action handler

Phase 5 will add:
- Combat UI components
- Turn order visualization
- Boss HP/stat display
- Phase transition animations
- Combat log/history

## Testing

Run examples to see the system in action:

```typescript
// In src/systems/combat/examples.ts
exampleCombatFlow() // Full combat simulation
```

## Performance Notes

- Base stats stored in combat state for quick recalculation
- Turn order recalculated only when needed (each round)
- Effects filtered by type before processing
- Stat scaling is deterministic and fast

## API Exports

All public functions are exported from `src/systems/combat/index.ts`:

- Danger calculation
- Boss stats (initial + dynamic recalculation)
- Combat state management
- Turn order calculation
- Attack pattern execution
- Ability execution
- Phase transitions
- Effect processing
- Combat flow orchestration

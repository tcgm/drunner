# Chance-Based Outcomes Implementation Summary

## What Was Added

The event system now supports three flexible ways to define outcomes:

### 1. **Single Guaranteed Outcome** (existing)
- Choice always produces the same result
- `outcome: EventOutcome`

### 2. **Weighted Random Outcomes** (new)
- Multiple possible results with probability weights
- `possibleOutcomes: Array<{ weight: number, outcome: EventOutcome }>`
- Higher weight = more likely to occur

### 3. **Success/Failure Checks** (new)
- Skill checks based on party stats
- `successChance`, `statModifier`, `successOutcome`, `failureOutcome`
- Each point in the stat adds 2% to success chance
- Uses average stat value across alive party members
- Maximum 95% success chance

## Files Modified

### Core System
- [types/index.ts](../src/types/index.ts) - Added new EventChoice fields
- [systems/events/eventResolver.ts](../src/systems/events/eventResolver.ts) - Added `resolveChoiceOutcome()` function
- [store/gameStore.ts](../src/store/gameStore.ts) - Updated `selectChoice` to use new resolver

### New Example Events
- [choice/ricketyBridge.ts](../src/data/events/choice/ricketyBridge.ts) - Speed check + weighted outcomes
- [choice/ancientRune.ts](../src/data/events/choice/ancientRune.ts) - Multiple stat checks + weighted outcomes
- [treasure/mysteriousChest.ts](../src/data/events/treasure/mysteriousChest.ts) - Luck check + weighted outcomes

### Documentation
- [chance-based-outcomes.md](chance-based-outcomes.md) - Complete guide with examples

## How It Works

When a player selects a choice, `resolveChoiceOutcome()` determines which outcome to use:

1. **Check for success/failure** - If `successOutcome` and `failureOutcome` exist, calculate success chance:
   - Base chance + (average party stat × 2%)
   - Roll random number, compare to success chance
   
2. **Check for weighted outcomes** - If `possibleOutcomes` exists:
   - Calculate total weight
   - Roll weighted random selection
   
3. **Use single outcome** - If `outcome` exists (original behavior)

4. **Fallback** - Return empty outcome if nothing configured

The selected outcome is then resolved normally through `resolveEventOutcome()`.

## Benefits

- **Replayability** - Events can play out differently each time
- **Stat importance** - Speed, Defense, Attack, Luck now affect event outcomes
- **Player choice** - Risk vs reward decisions become meaningful
- **Design flexibility** - Mix guaranteed and chance-based options in same event
- **Backward compatible** - All existing events still work with single outcomes

## Design Patterns

**High risk, high reward:**
```typescript
possibleOutcomes: [
  { weight: 20, outcome: { /* amazing reward */ } },
  { weight: 80, outcome: { /* bad result */ } }
]
```

**Stat-based challenge:**
```typescript
successChance: 0.3, // 30% base
statModifier: 'speed',
// Party with 20 average speed = 70% success
```

**Safe vs risky choices:**
```typescript
choices: [
  { text: 'Safe option', outcome: { /* guaranteed small reward */ } },
  { text: 'Risky gamble', possibleOutcomes: [ /* could be great or terrible */ ] }
]
```

## Future Enhancements

Possible additions:
- Multiple stat modifiers (e.g., speed OR luck)
- Party composition bonuses (e.g., having a Rogue increases success)
- Negative modifiers (stat decreases success chance)
- Critical success/failure (natural 1 or 20 style)
- Display success percentage to player before choosing

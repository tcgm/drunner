# Unique Item Effects System

## Overview

The unique item effects system provides a declarative way to add special mechanics to unique items without hardcoding logic throughout the codebase.

## Architecture

- **System Location**: `src/systems/items/uniqueEffects.ts`
- **Registry**: `UNIQUE_ITEM_EFFECTS` - Central registry of all unique item effects
- **Processor**: `processUniqueEffects()` - Automatically called at appropriate trigger points

## How It Works

1. Unique items define their effects in the `UNIQUE_ITEM_EFFECTS` registry
2. The game calls `processUniqueEffects()` at specific trigger points (e.g., boss defeat, combat start)
3. The system checks all equipped items and executes matching effects
4. Results are automatically integrated into the game state and displayed to the player

## Available Triggers

- `onBossDefeat` - After defeating a boss (before wipe check)
- `onCombatStart` - At the start of any combat
- `onCombatEnd` - After any combat (victory or defeat)
- `onDeath` - When the hero wearing this item dies
- `onHeroRevive` - When any hero is revived
- `onDamageTaken` - When the wearer takes damage
- `onDamageDealt` - When the wearer deals damage
- `onFloorAdvance` - When advancing to a new floor
- `onEventStart` - At the start of any event
- `onEventEnd` - At the end of any event
- `onItemFound` - When any item is found
- `onGoldGained` - When gold is gained
- `onHeal` - When the wearer is healed

## Adding a New Unique Effect

### Step 1: Define the Effect in the Registry

```typescript
// In src/systems/items/uniqueEffects.ts
export const UNIQUE_ITEM_EFFECTS: Record<string, {...}> = {
  'Your Item Name': {
    triggers: ['onBossDefeat', 'onCombatEnd'], // When to trigger
    description: 'What the effect does',
    handler: (context) => {
      const { party, sourceHero, eventType } = context
      
      // Your effect logic here
      
      // Return null if effect doesn't apply
      if (someCondition) {
        return null
      }
      
      // Modify party/heroes as needed
      const targetHero = party.find(h => h?.id === someId)
      if (targetHero) {
        targetHero.stats.hp += 50
      }
      
      return {
        party,
        message: 'Your effect message',
        additionalEffects: [{
          type: 'heal',
          target: [targetHero.id],
          value: 50,
          description: 'Detailed effect description'
        }]
      }
    }
  }
}
```

### Step 2: Update the Item Description

```typescript
// In your unique item file (e.g., src/data/items/uniques/...)
export const YOUR_ITEM: Omit<Item, 'id'> = {
  name: 'Your Item Name', // Must match registry key exactly!
  description: 'Item description. Special: Your effect description here.',
  // ... other properties
}
```

### Step 3: Add Trigger Calls (if new trigger type)

If you're using an existing trigger like `onBossDefeat`, it's already hooked up. If you need a new trigger:

```typescript
// In the appropriate game system (e.g., gameStore.ts)
processUniqueEffects(party, 'onYourNewTrigger', {
  eventType,
  floor,
  // ... other context
})
```

## Examples

### Heart of the Phoenix
**Trigger**: `onBossDefeat`  
**Effect**: Resurrects a random dead party member with 50% HP

```typescript
'Heart of the Phoenix': {
  triggers: ['onBossDefeat'],
  description: 'Resurrects a random dead party member with 50% HP after defeating a boss',
  handler: (context) => {
    const { party, sourceHero } = context
    
    if (!sourceHero || !sourceHero.isAlive) return null
    
    const deadHeroes = party.filter((h): h is Hero => h !== null && !h.isAlive)
    if (deadHeroes.length === 0) return null
    
    const randomDead = deadHeroes[Math.floor(Math.random() * deadHeroes.length)]
    const resurrectionHp = Math.floor(randomDead.stats.maxHp * 0.5)
    
    randomDead.isAlive = true
    randomDead.stats.hp = resurrectionHp
    
    return {
      party,
      message: `Heart of the Phoenix resurrects ${randomDead.name}!`,
      additionalEffects: [{
        type: 'revive',
        target: [randomDead.id],
        value: resurrectionHp,
        description: `Heart of the Phoenix resurrects ${randomDead.name} with ${resurrectionHp} HP!`
      }]
    }
  }
}
```

### More Ideas

- **Ring of Second Chance**: On death, survive with 1 HP (once per run)
- **Vampiric Blade**: On damage dealt, heal for 20% of damage
- **Guardian's Plate**: When ally takes fatal damage, redirect to wearer
- **Fortune's Favor**: Double gold gained from events
- **Experience Charm**: Grant +20% XP to all party members
- **Revenger's Cape**: Gain +50% damage when an ally dies

## Effect Types

- `heal` - Restore HP to target(s)
- `damage` - Deal damage to target(s)
- `revive` - Resurrect dead hero(es)
- `status` - Apply buff/debuff

## Context Properties

- `party` - Current party state (array of heroes)
- `trigger` - Which trigger activated this effect
- `eventType` - Type of current event ('boss', 'combat', etc.)
- `resolvedOutcome` - The current event outcome
- `floor` - Current floor number
- `sourceHero` - The hero wearing the item
- `targetHero` - Target of the effect (when applicable)
- `damageAmount` - Amount of damage (for damage triggers)
- `healAmount` - Amount of healing (for heal triggers)

## Best Practices

1. **Always check conditions** - Return `null` if effect shouldn't apply
2. **Match item names exactly** - Registry key must match item's `name` property
3. **Use immutability** - Spread arrays when modifying: `[...party]`
4. **Provide feedback** - Always include a `message` for player feedback
5. **Track statistics** - Use `additionalEffects` so stats are tracked properly
6. **Test edge cases** - What if party is wiped? What if hero is dead?
7. **Document in item description** - Players should know what the item does

## Testing

Test your unique effect by:

1. Spawning the item via DevTools
2. Equipping it to a hero
3. Triggering the appropriate event type
4. Verifying the effect occurs and displays properly
5. Checking edge cases (no targets, hero dead, etc.)

## Future Enhancements

- Per-run cooldowns (e.g., "once per run" effects)
- Charge-based effects (e.g., "3 charges per run")
- Stacking rules (what happens if multiple heroes have the same item?)
- Effect priorities/ordering
- Visual effects and animations for unique triggers
- Disabling/consuming items after use

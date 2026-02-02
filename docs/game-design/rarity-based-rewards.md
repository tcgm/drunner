# Rarity-Based Item Rewards System

## Overview
Events can now control the quality of item rewards through rarity constraints and depth boosts. This allows events to guarantee better loot for high-risk choices or difficult challenges.

## Item Stat Calculation Formula

**Current Formula (Version 1):**
```
Item Stat = Base Template Stat × Material Multiplier × Rarity Multiplier
Item Value = Base Value × Material Multiplier × Rarity Multiplier
```

**Example:**
- Iron Sword base template: 5 attack
- Iron material: 1.0× multiplier
- Legendary rarity: 4.0× multiplier
- Result: 5 × 1.0 × 4.0 = **20 attack**

**Stat Versioning:**
All items carry a `statVersion` field that tracks which formula was used to calculate their stats. When loading a save, items are checked against the current formula:
- If `statVersion` matches current version → no migration needed
- If `statVersion` is missing or outdated → item stats are recalculated using current formula
- Migration generates a "phantom copy" with correct stats and replaces the old version

This ensures items remain balanced even when the stat calculation formula changes in future updates.

## New Item Generation Parameters

### `minRarity`
Sets the minimum rarity tier for generated items.
```typescript
{ 
  type: 'item', 
  itemType: 'random',
  minRarity: 'rare' // Will never generate common/uncommon
}
```

### `maxRarity`
Sets the maximum rarity tier for generated items.
```typescript
{ 
  type: 'item', 
  itemType: 'random',
  maxRarity: 'epic' // Will never generate legendary/mythic
}
```

### `rarityBoost`
Increases effective depth for rarity calculation (each +1 = 1 deeper floor).
```typescript
{ 
  type: 'item', 
  itemType: 'random',
  rarityBoost: 15 // Treats as if 15 floors deeper
}
```

## Rarity Tiers
In order from worst to best:
1. `junk` - Vendor trash
2. `common` - Basic items (early game)
3. `uncommon` - Decent items (early-mid game)
4. `rare` - Good items (mid game)
5. `epic` - Powerful items (late game)
6. `legendary` - Very powerful items (deep floors)
7. `mythic` - Extremely rare, incredibly powerful

## Usage Patterns

### Guaranteed Quality (High-Skill Reward)
Reward players who use correct class or pass skill checks:
```typescript
{
  text: 'Expert technique (Rogue)',
  requirements: { class: 'Rogue' },
  outcome: {
    effects: [
      { 
        type: 'item',
        itemType: 'random',
        minRarity: 'rare', // At least rare!
        rarityBoost: 15    // Plus better quality
      }
    ]
  }
}
```

### Limited Risk (Damaged/Degraded)
Items that are broken or damaged can have capped quality:
```typescript
{
  text: 'Break it open',
  failureOutcome: {
    effects: [
      { 
        type: 'item',
        maxRarity: 'rare' // Damaged, no legendary
      }
    ]
  }
}
```

### High Risk, High Reward
Dangerous choices can guarantee excellent items:
```typescript
{
  text: 'Fight the dragon',
  outcome: {
    effects: [
      { type: 'damage', target: 'all', value: 80 },
      { 
        type: 'item',
        minRarity: 'legendary', // Guaranteed legendary!
        rarityBoost: 20
      }
    ]
  }
}
```

### Weighted Rarity Outcomes
Different outcomes can have different quality ranges:
```typescript
possibleOutcomes: [
  {
    weight: 10,
    outcome: {
      effects: [
        { 
          type: 'item',
          minRarity: 'epic',
          rarityBoost: 20 // Jackpot!
        }
      ]
    }
  },
  {
    weight: 40,
    outcome: {
      effects: [
        { 
          type: 'item',
          minRarity: 'uncommon',
          maxRarity: 'rare' // Normal reward
        }
      ]
    }
  },
  {
    weight: 50,
    outcome: {
      effects: [
        { 
          type: 'item',
          maxRarity: 'uncommon' // Poor outcome
        }
      ]
    }
  }
]
```

### Success/Failure Quality Difference
Skill checks can grant better quality on success:
```typescript
{
  text: 'Open carefully (Luck check)',
  successChance: 0.5,
  statModifier: 'luck',
  successOutcome: {
    effects: [
      { 
        type: 'item',
        minRarity: 'uncommon',
        rarityBoost: 10 // Better on success
      }
    ]
  },
  failureOutcome: {
    effects: [
      { 
        type: 'item',
        maxRarity: 'common' // Worse on failure
      }
    ]
  }
}
```

## Design Guidelines

### When to Use Rarity Constraints

**Use `minRarity` for:**
- Class-specific expert actions (Rogue lockpicking, Mage studying)
- High-risk choices that deserve guaranteed quality
- Late-game events (depth 15+) that should feel rewarding
- Success outcomes of difficult skill checks

**Use `maxRarity` for:**
- Damaged or broken treasure
- Low-effort safe choices
- Failure outcomes
- Restricted or cursed rewards

**Use `rarityBoost` for:**
- Elite enemies or dangerous encounters
- Perfect execution of risky strategies
- Legendary locations (dragon hoards, ancient vaults)
- Rewarding creative/clever play

### Rarity by Depth Guidelines

**Depth 1-5 (Early):**
- Default: common/uncommon
- Good choices: minRarity 'uncommon', rarityBoost +3-5
- Bad choices: maxRarity 'common'

**Depth 6-15 (Mid):**
- Default: uncommon/rare
- Good choices: minRarity 'rare', rarityBoost +5-10
- Bad choices: maxRarity 'uncommon'

**Depth 16-30 (Late):**
- Default: rare/epic
- Good choices: minRarity 'epic', rarityBoost +10-15
- Bad choices: maxRarity 'rare'

**Depth 31+ (Deep):**
- Default: epic/legendary
- Good choices: minRarity 'legendary', rarityBoost +15-25
- Bad choices: maxRarity 'epic'

### Balance Considerations

1. **Don't over-reward safe choices** - Easy options should give normal loot
2. **Risk should feel rewarding** - Dangerous choices deserve better items
3. **Skill matters** - Class abilities and stat checks should guarantee quality
4. **Failure shouldn't feel terrible** - Even failures can give decent items, just not amazing ones
5. **Rare is good enough** - Don't feel obligated to give legendary items constantly

## Examples in Practice

### Treasure Vault Event
```typescript
{
  text: 'Pick lock (Rogue)',
  requirements: { class: 'Rogue' },
  outcome: {
    effects: [
      { 
        type: 'item',
        minRarity: 'rare',    // Expertise guaranteed quality
        rarityBoost: 15       // Plus exceptional quality
      }
    ]
  }
}
```
**Why:** Rogues should excel at lockpicking and get the best loot.

### Dragon Hoard Event
```typescript
{
  text: 'Challenge the dragon',
  outcome: {
    effects: [
      { type: 'damage', target: 'all', value: 80 },
      { 
        type: 'item',
        minRarity: 'legendary', // Survive = legendary
        rarityBoost: 25         // Best possible quality
      }
    ]
  }
}
```
**Why:** Fighting a dragon is incredibly dangerous and should give the best rewards.

### Lucky Coin Flip Event
```typescript
successOutcome: {
  effects: [
    { 
      type: 'item',
      minRarity: 'epic',
      rarityBoost: 20
    }
  ]
},
failureOutcome: {
  effects: [] // Nothing
}
```
**Why:** All-or-nothing gambles should have extreme outcomes.

## Combining with Chance-Based Outcomes

You can combine rarity control with weighted outcomes or skill checks:

```typescript
{
  text: 'Open treasure chest (Luck check)',
  successChance: 0.5,
  statModifier: 'luck',
  successOutcome: {
    effects: [
      { type: 'item', minRarity: 'uncommon', rarityBoost: 10 }
    ]
  },
  failureOutcome: {
    possibleOutcomes: [
      {
        weight: 50,
        outcome: {
          effects: [
            { type: 'item', maxRarity: 'common' } // Got item but poor quality
          ]
        }
      },
      {
        weight: 50,
        outcome: {
          effects: [
            { type: 'damage', target: 'random', value: 20 } // Trap!
          ]
        }
      }
    ]
  }
}
```

This creates dynamic, replayable events where both chance AND reward quality vary!

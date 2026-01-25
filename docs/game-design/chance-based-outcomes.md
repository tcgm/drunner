# Chance-Based Event Outcomes

The event system now supports multiple ways to create dynamic, chance-based outcomes that make events more interesting and replayable.

## Three Ways to Define Outcomes

### 1. Single Guaranteed Outcome (Original)
The simplest form - a choice always produces the same result.

```typescript
{
  text: 'Open the door',
  outcome: {
    text: 'The door opens easily.',
    effects: [
      { type: 'xp', value: 10 }
    ]
  }
}
```

### 2. Weighted Random Outcomes
A choice can have multiple possible outcomes with different probabilities. Higher weight = more likely.

```typescript
{
  text: 'Pull the lever',
  possibleOutcomes: [
    {
      weight: 50,  // 50% chance (50 out of 100 total)
      outcome: {
        text: 'Nothing happens.',
        effects: []
      }
    },
    {
      weight: 30,  // 30% chance
      outcome: {
        text: 'Gold falls from above!',
        effects: [
          { type: 'gold', value: 100 }
        ]
      }
    },
    {
      weight: 20,  // 20% chance
      outcome: {
        text: 'A trap activates!',
        effects: [
          { type: 'damage', target: 'all', value: 25 }
        ]
      }
    }
  ]
}
```

### 3. Success/Failure Checks (Skill Checks)
A choice can test a stat with success and failure outcomes. Each point in the stat adds 2% to success chance (max 95%).

```typescript
{
  text: 'Climb the wall (Speed check)',
  successChance: 0.3,      // 30% base chance
  statModifier: 'speed',   // Speed affects success
  successOutcome: {
    text: 'You scale the wall with ease!',
    effects: [
      { type: 'xp', value: 50 }
    ]
  },
  failureOutcome: {
    text: 'You slip and fall!',
    effects: [
      { type: 'damage', target: 'random', value: 20 }
    ]
  }
}
```

**Available stat modifiers:**
- `attack` - Combat prowess
- `defense` - Physical toughness
- `speed` - Agility and reaction time
- `luck` - Fortune and chance
- `magicPower` - Magical ability (if implemented)

**Success calculation:** Uses the average stat value across all alive party members.
- Base: 30% + (average speed 10 × 2%) = 50% success chance
- Each hero's contribution makes the party stronger

## Complete Event Examples

### Example 1: Rickety Bridge
Combines skill checks and weighted outcomes:

```typescript
export const RICKETY_BRIDGE: DungeonEvent = {
  id: 'rickety-bridge',
  type: 'choice',
  title: 'Rickety Bridge',
  description: 'A rope bridge spans a deep chasm. It looks unstable but crossable.',
  choices: [
    {
      text: 'Cross carefully (Speed check)',
      successChance: 0.4,
      statModifier: 'speed',
      successOutcome: {
        text: 'Your party crosses the bridge safely!',
        effects: [{ type: 'xp', value: 50 }]
      },
      failureOutcome: {
        text: 'The bridge collapses!',
        effects: [{ type: 'damage', target: 'all', value: 30 }]
      }
    },
    {
      text: 'Cut the ropes (unpredictable)',
      possibleOutcomes: [
        {
          weight: 30,
          outcome: {
            text: 'Reveals hidden treasure!',
            effects: [
              { type: 'gold', value: 200 },
              { type: 'item', itemType: 'random' }
            ]
          }
        },
        {
          weight: 50,
          outcome: {
            text: 'Nothing of value below.',
            effects: [{ type: 'xp', value: 20 }]
          }
        },
        {
          weight: 20,
          outcome: {
            text: 'The bridge collapses on you!',
            effects: [{ type: 'damage', target: 'all', value: 40 }]
          }
        }
      ]
    }
  ],
  depth: 3
}
```

### Example 2: Mysterious Chest
Uses luck-based checks and random outcomes:

```typescript
{
  text: 'Open it carefully (Luck check)',
  successChance: 0.5,
  statModifier: 'luck',
  successOutcome: {
    text: 'No traps! Treasure inside.',
    effects: [
      { type: 'gold', value: 150 },
      { type: 'item', itemType: 'random' }
    ]
  },
  failureOutcome: {
    text: 'Poison dart trap!',
    effects: [
      { type: 'damage', target: 'random', value: 35 },
      { type: 'gold', value: 50 }
    ]
  }
}
```

## Design Tips

1. **Weighted outcomes are great for:**
   - Gambling/risky choices
   - Environmental hazards with unpredictable results
   - Loot boxes or random encounters

2. **Success/Failure checks are great for:**
   - Athletic challenges (speed)
   - Tough fights or endurance tests (defense/attack)
   - Trap detection (luck)
   - Puzzles or magical challenges (magicPower)

3. **Mix and match:**
   - Give players both safe options (guaranteed) and risky options (chance-based)
   - Reward high-stat parties with better success chances
   - Make failure interesting, not just "take damage"

4. **Balance:**
   - Success chances of 30-60% feel fair for skill checks
   - Higher rewards should have lower weights
   - Consider party progression - early game checks should be easier

## Notes

- You can still use class requirements with any outcome type
- Gold requirements work normally with all outcome types
- The system uses the party's **average** stat for checks, so a balanced party helps
- Maximum success chance is capped at 95% (even with high stats)

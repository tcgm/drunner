# Event Improvements: Chance-Based Outcomes Applied

## Summary
Reviewed all existing events and added chance-based outcomes to 12 events where uncertainty, skill checks, or risky choices made sense thematically.

## Events Updated

### Trap Events

#### 1. **Collapsing Ceiling** (`trap/collapsingCeiling.ts`)
- **"Run for cover!"** → Speed check (50% base)
  - Success: Escape unharmed with bonus XP
  - Failure: Take damage but gain some XP
  - *Why:* Quick reflexes should matter when dodging falling rocks

#### 2. **Pit Trap** (`trap/pitTrap.ts`)
- **"Jump across the pit"** → Speed check (45% base)
  - Success: Everyone makes it, better XP
  - Failure: Someone falls, less XP
  - *Why:* Athletic feat should depend on speed/agility

#### 3. **Poison Dart Trap** (`trap/poisonDartTrap.ts`)
- **"Carefully navigate around"** → Speed check (60% base)
  - Success: Perfect avoidance, good XP
  - Failure: Trigger one plate, light damage
  - *Why:* Careful movement benefits from dexterity

### Treasure Events

#### 4. **Ancient Chest** (`treasure/ancientChest.ts`)
- **"Kick it aggressively"** → Weighted outcomes (3 possibilities)
  - 30%: Breaks cleanly, good loot
  - 40%: Damages contents, moderate gold
  - 30%: It's a mimic! Takes damage
  - *Why:* Brute force is unpredictable and risky

#### 5. **Mysterious Fountain** (`treasure/mysteriousFountain.ts`)
- **"Drink the water"** → Weighted outcomes (4 possibilities)
  - 15%: Amazing blessing - full heal + XP
  - 45%: Good heal + some gold
  - 30%: Nothing special, just gold
  - 10%: Cursed! Take damage
  - *Why:* Magical water is unpredictable

### Choice Events

#### 6. **Prisoner's Dilemma** (`choice/prisonersDilemma.ts`)
- **"Free the first prisoner"** → Weighted outcomes
  - 60%: Genuine gratitude and knowledge
  - 40%: He's the monster! Attacks party
- **"Free the second prisoner"** → Weighted outcomes
  - 60%: Generous reward with gold
  - 40%: She's the monster! Attacks party
- *Why:* Both could be lying - creates real tension

#### 7. **Rival Adventurers** (`choice/rivalAdventurers.ts`)
- **"Sneak past them"** → Luck check (40% base)
  - Success: Perfect stealth, great XP
  - Failure: Spotted, backstabbed
  - *Why:* Stealth attempts should have risk/reward

#### 8. **Wounded Traveler** (`choice/woundedTraveler.ts`)
- **"Heal him for free"** → Weighted outcomes (3 possibilities)
  - 50%: Genuine blessing and knowledge
  - 30%: He shares hidden gold too
  - 20%: Shapeshifter trap! Attacks
  - *Why:* Good deed could be rewarded or exploited

### Rest Events

#### 9. **Mystical Garden** (`rest/mysticalGarden.ts`)
- **"Eat the fruit"** → Weighted outcomes (4 possibilities)
  - 15%: Incredible vitality, full heal
  - 60%: Normal healing effect
  - 20%: Makes you drowsy, light heal
  - 5%: Poisonous! Take damage
  - *Why:* Unknown magical fruit is risky

#### 10. **Shrine Maiden** (`rest/shrineMaiden.ts`)
- **"Pray for resurrection (without offering)"** → Luck check (30% base)
  - Success: Prayers answered, revive all
  - Failure: Only heals the living
  - *Why:* Divine intervention should favor the lucky

### Combat Events

#### 11. **Goblin Ambush** (`combat/goblinAmbush.ts`)
- **"Try to negotiate"** → Luck check (25% base)
  - Success: They accept bribe, leave
  - Failure: They attack with fury
  - *Why:* Goblins are unpredictable but greedy

#### 12. **Dark Cultists** (`combat/darkCultists.ts`)
- **"Join their chant"** → Weighted outcomes (3 possibilities)
  - 15%: Perfect! They think you're one of them
  - 35%: Confuses them, lighter attack
  - 50%: Angers them, dark magic unleashed
  - *Why:* Attempting dark rituals is dangerous

## Design Patterns Used

### Speed Checks (6 events)
Used for physical challenges: dodging, jumping, navigating, running
- Collapsing ceiling, pit trap, poison darts
- Makes speed stat valuable beyond combat

### Luck Checks (4 events)
Used for: stealth, negotiation, divine favor, detection
- Sneaking, negotiating with goblins, praying at shrine, finding traps
- Gives luck meaningful gameplay impact

### Weighted Outcomes (8 events)
Used for: unpredictable situations, moral choices, risky gambles
- Prisoner's dilemma, mysterious items, magical effects
- Creates replayability and tension

### Attack/Defense Checks
Not added yet but could be used for:
- Intimidation (attack stat)
- Endurance challenges (defense stat)
- Future consideration for more events

## Impact on Gameplay

**Stat Importance:**
- Speed now affects 6 events (escape, athletics, stealth)
- Luck now affects 4 events (chance, negotiation, divine)
- Makes party composition more strategic

**Replayability:**
- Same event can play out differently each time
- Players will try different options to see all outcomes

**Risk vs Reward:**
- Players can choose safe guaranteed options
- Or gamble on better rewards with chance-based choices

**Thematic Depth:**
- Events feel more alive and unpredictable
- Consequences feel more earned (based on party stats)
- Builds investment in character development

## Events That Intentionally Kept Simple

Some events remain with guaranteed outcomes because:
- They're designed as strategic resource trades (merchants)
- They have clear class-based solutions (Rogue disarming traps)
- The outcome is thematically certain (destroying altar)
- They serve as reliable "safe" options in the pool

Boss events remain unchanged - they're meant to be strategic challenges with clear outcomes based on party strength, not random chance.

## Future Opportunities

Additional events that could benefit from chance systems:
- More merchant events (haggling checks)
- Environmental hazards (survival checks)
- Social encounters (diplomacy vs intimidation)
- Puzzle rooms (intelligence-based checks if stat added)

# Events & Choices

Event types, examples, and design principles for Dungeon Runner's event system.

---

## Event Types Overview

| Event Type | Frequency | Primary Reward | Risk Level |
|------------|-----------|----------------|------------|
| Combat | 40% | XP, Loot, Gold | High |
| Treasure | 20% | Items, Gold | Medium |
| Choice | 20% | Varies | Medium |
| Rest | 10% | Healing, Buffs | None |
| Merchant | 5% | Shop Access | None |
| Trap | 5% | Situational | High |
| Boss | Special | Rare+ Loot, XP | Very High |

---

## Event Details

### 1. Combat Events (40%)

**Description:** Battle against monsters and enemies  
**Rewards:** XP, loot, gold  
**Risks:** HP damage, death  

**Example Event:**
> **Goblin Ambush**  
> Three goblins leap from the shadows!
> 
> **Choices:**
> - Fight head-on (STR check)
> - Ambush them first (SPD check)
> - Negotiate (LUCK check)
> - Flee (guaranteed escape, no rewards)

**Design Notes:**
- Most common event type
- Scales with dungeon depth
- Triggers combat system (stretch goal) or quick resolution

---

### 2. Treasure Events (20%)

**Description:** Find loot, chests, hidden caches  
**Rewards:** Items, gold  
**Risks:** Traps, curses  

**Example Event:**
> **Ancient Chest**  
> You discover an ornate chest covered in strange runes.
> 
> **Choices:**
> - Force it open (STR check - may trigger trap)
> - Pick the lock (LUCK check - better loot if succeed)
> - Leave it (safe but no reward)
> - Use Rogue's ability (auto-success if Rogue in party)

**Design Notes:**
- Risk/reward decision making
- Class abilities can provide advantages
- Higher depth = better loot potential

---

### 3. Choice Events (20%)

**Description:** Moral dilemmas, strategic decisions  
**Rewards:** Varies based on choice  
**Risks:** Unexpected consequences  

**Example Event:**
> **Wounded Traveler**  
> A bleeding traveler begs for help. He offers gold for healing.
> 
> **Choices:**
> - Heal him for free (lose potion, gain karma)
> - Accept his gold (gain gold, lose karma)
> - Rob him (gain gold + items, cursed)
> - Ignore him (no effect)

**Design Notes:**
- Add narrative depth
- Choices may have delayed consequences
- Moral decisions with gameplay impact

---

### 4. Rest Events (10%)

**Description:** Safe areas to recover and prepare  
**Rewards:** Healing, buffs  
**Risks:** None (safe zones)  

**Example Event:**
> **Campfire**  
> A warm fire crackles in a safe alcove.
> 
> **Choices:**
> - Rest fully (heal all HP, use time)
> - Quick rest (heal 50%, faster)
> - Cook food (make consumables if have ingredients)
> - Skip rest (continue immediately)

**Design Notes:**
- Guaranteed safe zones for resource management
- Strategic timing decisions
- Potential for crafting/preparation

---

### 5. Merchant Events (5%)

**Description:** Buy, sell, and trade items  
**Rewards:** Equipment upgrades  
**Risks:** Spending resources  

**Example Event:**
> **Wandering Merchant**  
> A cloaked merchant offers their wares.
> 
> **Actions:**
> - Browse items (view shop inventory)
> - Sell items (convert items to gold)
> - Special deal (random discount item)
> - Leave

**Design Notes:**
- Gold sink for economy balance
- Opportunity to optimize equipment
- Can sell unwanted loot

---

### 6. Trap Events (5%)

**Description:** Environmental hazards and dangerous situations  
**Rewards:** Sometimes treasure if avoided  
**Risks:** Damage, debuffs  

**Example Event:**
> **Spike Trap**  
> You notice pressure plates ahead. One wrong step...
> 
> **Choices:**
> - Carefully navigate (LUCK check)
> - Rush through (take damage, guaranteed pass)
> - Send Rogue (auto-success if Rogue in party)
> - Turn back (lose progress)

**Design Notes:**
- Tests different stats/abilities
- Class-specific solutions
- High risk but sometimes high reward

---

### 7. Boss Events (Special)

**Description:** Major encounters with powerful enemies  
**Rewards:** Guaranteed rare+ loot, major XP  
**Risks:** Difficult, can end run  
**Frequency:** Every 10 floors or at dungeon end

**Design Notes:**
- Milestone encounters
- Always rewarding if defeated
- Can include unique mechanics

---

## Event Design Principles

### 1. Clear Risk/Reward
Players should understand potential outcomes before choosing:
- Clearly stated stat checks
- Obvious danger vs. safety tradeoffs
- Transparent reward potential

### 2. Multiple Approaches
Different party builds should have different optimal choices:
- STR/ATK options for warriors
- LUCK options for rogues
- Class-specific abilities as shortcuts
- Conservative "safe" options

### 3. Meaningful Consequences
Choices should matter and affect the run:
- HP damage persists until rest
- Gold spent affects future purchases
- Items lost/gained change loadout
- Curses require special events to remove

### 4. Skill Expression
Players should improve by learning event patterns:
- Recognize high-risk choices
- Identify stat check thresholds
- Optimize for party composition
- Plan resource management

### 5. Variety & Surprise
Events should remain interesting across multiple runs:
- 50+ unique events at launch
- Random variations in outcomes
- Occasional unexpected twists
- New events added in updates

---

## Event Generation

### Selection Algorithm
1. Roll for event type based on frequency weights
2. Filter by dungeon depth and party state
3. Select specific event from template pool
4. Apply random variations if applicable
5. Present to player

### Context Awareness
Events can reference:
- Current dungeon depth
- Party composition and classes
- Party HP state (injured heroes trigger certain events)
- Inventory contents
- Previous choices (karma, curses)

### Scaling
Events scale with depth:
- **Floor 1-5:** Tutorial-level, low stakes
- **Floor 6-10:** Moderate difficulty
- **Floor 11-20:** High stakes, tough choices
- **Floor 21+:** Extreme risk/reward

---

## Content Goals

**MVP:**
- 50+ unique events (8-10 per type minimum)
- 150+ choice variations
- 5+ boss event templates

**Stretch Goals:**
- 100+ unique events
- Chaining events (choices lead to new events)
- Dynamic event generation based on run state
- Special "legendary" events (very rare)
- Community-created events (mod support)

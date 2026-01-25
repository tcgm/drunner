# Combat System (Stretch Goal)

Turn-based combat system with dynamic mid-battle events.

---

## Overview

Combat is a **stretch goal** feature that expands on combat event resolution. Instead of simple stat checks, players engage in tactical turn-based battles.

---

## Turn-Based Combat

### Initiative Order
Based on **Speed** stat (highest → lowest):
- Heroes and enemies act in speed order
- Recalculated each round if speeds change
- Ties broken randomly

### Player Actions (Per Turn)

1. **Attack**
   - Basic attack using equipped weapon
   - Damage = ATK - Enemy DEF
   - Always available

2. **Ability**
   - Use class-specific ability
   - Limited uses per dungeon or cooldowns
   - Powerful effects

3. **Item**
   - Use consumable from inventory
   - Instant effect (healing, buffs, etc.)
   - Doesn't end turn if setup allows

4. **Defend**
   - Reduce damage taken this turn by 50%
   - Grants shield/block bonus
   - Good for surviving big attacks

5. **Pass**
   - Skip turn voluntarily
   - May build resource/energy (future)
   - Speeds up combat

---

## Enemy AI Behaviors

### Aggressive
- Always attacks highest threat target
- Prioritizes heroes with low HP
- Ignores defense

### Defensive
- Uses defense when below 50% HP
- Focuses on survival
- May flee at low HP (future)

### Support
- Buffs allied enemies
- Debuffs player heroes
- Lower priority target

### Random
- Unpredictable actions
- Can be any of the above
- Adds chaos to fights

---

## Combat Flow

```
1. Combat Starts
   ↓
2. Initiative Calculated
   ↓
3. Turn Order Displayed
   ↓
4. Current Actor's Turn
   ↓
5. Action Selected & Resolved
   ↓
6. Check for Victory/Defeat
   ↓
7. Check for Combat Event (20% after round 3)
   ↓
8. Next Actor's Turn → Repeat from step 4
   ↓
9. Combat Ends → Distribute Rewards
```

---

## Combat Events (Mid-Battle)

Random events can occur during combat starting round 3:
- **20% chance** per round after round 3
- Adds variety and unpredictability
- Can help or hinder either side

### Example Combat Events

**Environmental Hazards:**
- "The ceiling crumbles!" - AOE damage to all combatants (5-10 dmg)
- "A gas leak!" - All units lose 3 HP per turn for 3 turns
- "Darkness falls!" - All attacks have 30% miss chance for 2 turns

**Tactical Opportunities:**
- "You spot a weakness!" - Next attack deals +50% damage
- "Rally!" - All heroes gain +5 ATK for 2 turns
- "Stumble!" - Enemy misses their next turn

**Reinforcements:**
- "Reinforcements arrive!" - 1-2 additional enemies spawn
- "Ally appears!" - Temporary NPC joins fight
- "Ambushed!" - New enemy with first turn bonus

**Random Bonuses:**
- "Healing spring appears!" - All heroes regen 5 HP/turn
- "Power surge!" - Random hero's abilities refresh
- "Treasure glimpsed!" - Bonus loot if you win

---

## Combat Stats

### Primary Combat Stats
- **HP:** Health points, reach 0 = death
- **Attack:** Damage dealt before defense
- **Defense:** Damage reduction
- **Speed:** Turn order position
- **Luck:** Critical hit chance, dodge chance

### Derived Stats
- **Crit Chance:** Luck / 10 (%)
- **Dodge Chance:** Speed / 20 (%)
- **Block Chance:** If shield equipped (10-30%)

---

## Damage Calculation

### Basic Attack
```
Damage = (Attacker ATK + Weapon Bonus) - (Defender DEF + Armor Bonus)
Minimum Damage = 1 (always deal at least 1)
```

### Critical Hit
```
Crit Chance = Attacker LUCK / 10
If Crit: Damage × 1.5
```

### Special Abilities
```
Ability Damage = Base Ability Power + (Relevant Stat × Multiplier)
Example: Fireball = 20 + (Magic Power × 1.5)
```

---

## Victory & Defeat

### Victory Conditions
- All enemies defeated
- All enemies fled (future)
- Boss defeated

### Victory Rewards
- **XP:** 50-100 per enemy
- **Gold:** 10-50 per enemy
- **Loot:** Random drops based on enemy type
- **Bonus:** Extra loot for flawless victory (no HP lost)

### Defeat Conditions
- All heroes reach 0 HP
- Special fail conditions (boss mechanics)

### Defeat Consequences
- Run ends (permadeath)
- View results screen
- Restart from main menu

---

## Combat UI Layout

```
┌─────────────────────────────────────────┐
│  Combat Status: Round 3                 │
├─────────────────────────────────────────┤
│  Enemies (Top)                          │
│  [Enemy1 HP: 45/60] [Enemy2 HP: 10/30] │
├─────────────────────────────────────────┤
│  Combat Log (Middle)                    │
│  > Hero attacks Enemy for 15 damage     │
│  > Enemy casts fireball!                │
│  > Event: "You spot a weakness!"        │
├─────────────────────────────────────────┤
│  Heroes (Bottom)                        │
│  [Hero1 HP: 80/100] [Hero2 HP: 50/80]  │
│                                         │
│  Actions:                               │
│  [Attack] [Ability ▼] [Item] [Defend]  │
└─────────────────────────────────────────┘
```

---

## Balance Considerations

### Combat Length
- Target: 5-10 rounds per fight
- Too fast = no strategy
- Too slow = tedious

### Difficulty Curve
- Floor 1-5: Easy tutorial fights
- Floor 6-10: Standard difficulty
- Floor 11-20: Challenging
- Floor 21+: Very hard, near-death experiences

### Resource Management
- Abilities with limited uses
- Healing items are precious
- Incentivize smart play

### Combat Event Balance
- 60% neutral or beneficial
- 30% environmental challenge
- 10% enemy advantage
- Never instant-loss events

---

## Future Enhancements

### Advanced Features
- Status effects (poison, burn, stun, freeze)
- Multi-target abilities
- Positioning/formation mechanics
- Combo attacks between party members
- Enemy special abilities and phases
- Environmental interaction (cover, hazards)

### Boss Mechanics
- Phase transitions at HP thresholds
- Unique attack patterns
- Scripted combat events
- Legendary rewards

---

## Implementation Priority

Since combat is a **stretch goal**, implement in phases:

**Phase 1 (MVP Alternative):**
- Simple stat-check resolution for combat events
- No turn-based system
- Quick results based on party stats

**Phase 2 (Combat Lite):**
- Basic turn-based combat
- Attack, Defend, Item only
- Simple AI

**Phase 3 (Full Combat):**
- All abilities enabled
- Combat events
- Advanced AI behaviors

**Phase 4 (Polish):**
- Animations
- Advanced mechanics
- Boss-specific features

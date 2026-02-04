# Progression System

Experience, leveling, abilities, and character growth.

---

## Experience & Leveling

### XP Sources

| Source | XP Amount | Notes |
|--------|-----------|-------|
| Combat victory | 50-100 per enemy | Scales with enemy level |
| Event success | 25-50 per choice | Stat check rewards |
| Floor completion | 100 per floor | Guaranteed progress |
| Boss defeat | 500-1000 | Major milestone |

### Level Up Formula

```
XP Required = Current Level × 100
```

**Examples:**
- Level 1 → 2: 100 XP
- Level 2 → 3: 200 XP
- Level 3 → 4: 300 XP
- Level 9 → 10: 900 XP
- Level 19 → 20: 1900 XP

**Total XP to Max Level (20):** 19,000 XP

### Level Up Rewards

Each level up grants:
- **Class-specific stat increases** (total 40 points per level, distributed uniquely per class)
- **+1 ability point** (unlock new abilities)
- **Full HP restore** (optional, currently disabled)

### Stat Gain Budget

**Design Rule:** Each class has **40 stat points** to distribute per level.
- Formula: **5 points × 8 stat types** = 40 total points
- 8 stats: maxHp, attack, defense, speed, luck, wisdom, charisma, magicPower

**Class Stat Gain Examples:**

| Class | HP | ATK | DEF | SPD | LUCK | WIS | CHA | MAG | Total |
|-------|-----|-----|-----|-----|------|-----|-----|-----|-------|
| Warrior | 10 | 7 | 8 | 4 | 3 | 2 | 4 | 2 | 40 |
| Mage | 3 | 2 | 2 | 5 | 6 | 8 | 4 | 10 | 40 |
| Rogue | 5 | 6 | 2 | 9 | 9 | 3 | 4 | 0 | 40* |
| Cleric | 6 | 2 | 4 | 4 | 5 | 8 | 6 | 7 | 40* |

*Note: Rogues without magicPower still total 38 points in non-magic stats*

---

## Stat Progression

### Base Stats (Level 1)
Total starting stats: **30-40 points** (varies by class)

**Example - Warrior:**
- HP: 100
- ATK: 12
- DEF: 10
- SPD: 5
- LUCK: 3

### Stats at Max Level (20)

Each class has unique stat growth based on their 40-point per level budget.

**Example - Warrior at Level 20:**
- maxHP: base + (19 × 10) = +190
- ATK: base + (19 × 7) = +133
- DEF: base + (19 × 8) = +152
- SPD: base + (19 × 4) = +76
- LUCK: base + (19 × 3) = +57

**Example - Mage at Level 20:**
- maxHP: base + (19 × 3) = +57
- MAGIC: base + (19 × 10) = +190
- WIS: base + (19 × 8) = +152
- LUCK: base + (19 × 6) = +114

### Stat Scaling Philosophy
- **Fixed 40-point budget** per level ensures balance across all classes
- **Class-specific distribution** creates unique long-term signatures
- Equipment provides additional scaling and customization
- Gear remains important at all levels

---

## Ability System

### Ability Unlocks

Heroes unlock abilities at specific levels:

| Level | Unlock |
|-------|--------|
| 1 | 3 starting abilities |
| 3 | 4th ability slot |
| 5 | 5th ability slot |
| 7 | Ultimate ability |
| 10 | Enhanced ability: Power boost to existing ability |
| 15 | Enhanced ability: Second boost |
| 20 | Mastery: All abilities enhanced |

### Ability Types

**Active Abilities:**
- Triggered by player
- Have cooldowns or limited uses
- Combat or event effects

**Passive Abilities:**
- Always active
- Modify stats or add mechanics
- No activation required

**Ultimate Abilities:**
- Unlock at level 7
- Most powerful ability
- Longer cooldown or limited uses per run

### Example Ability Progression (Warrior)

**Level 1:**
1. Power Strike (Active): Deal 150% weapon damage
2. Defend (Active): Reduce incoming damage by 50% for 1 turn
3. Taunt (Active): Force enemy to target you

**Level 3:**
4. Cleave (Active): Attack all enemies for 75% damage

**Level 5:**
5. Second Wind (Passive): Heal 10 HP per turn when below 30% HP

**Level 7:**
6. **ULTIMATE - Berserker Rage:** +50% ATK for 3 turns, take 10% more damage

**Level 10:**
- Power Strike → Power Strike II: Deal 200% damage (enhanced)

**Level 15:**
- Defend → Iron Defense: Reduce damage by 75% + gain shield (enhanced)

**Level 20:**
- All abilities enhanced to maximum power (Mastery)

---

## Trait System

### What Are Traits?
- Permanent modifiers that define character specialization
- Acquired through gameplay (future: at character creation)
- Provide unique bonuses or mechanics

### Example Traits

**Lucky:**
- +2 LUCK
- 10% bonus to loot rarity
- Affects: Event success chance, crit chance

**Tank:**
- +5 DEF, -1 SPD
- Take less damage, slightly slower
- Affects: Survivability

**Greedy:**
- Start with 50 extra gold
- Merchants cost 20% more
- Affects: Early game equipment

**Cautious:**
- Reveal trap events before triggering
- -5% combat damage
- Affects: Risk management

**Bloodthirsty:**
- +10% damage when below 50% HP
- Take 5% more damage
- Affects: High-risk gameplay

---

## Meta-Progression (Stretch Goal)

### Permanent Upgrades Between Runs

**Concept:** Unlock permanent bonuses that persist across runs

**Unlock Currency:**
- **Dungeon Tokens:** Earned based on depth reached
- **Boss Souls:** Earned from boss defeats
- **Achievement Points:** Complete challenges

**Upgrade Categories:**

1. **Starting Bonuses:**
   - Begin run with +10% stats
   - Start with common item equipped
   - Start with 50 gold

2. **Gameplay Modifiers:**
   - +10% XP gain
   - +5% loot quality
   - Extra inventory slot

3. **Class Unlocks:**
   - Unlock stretch goal classes
   - Unlock advanced starting abilities

4. **Quality of Life:**
   - Fast forward events seen before
   - Auto-sell junk items
   - Quick-equip best items

---

## Ability Design Principles

### Balance Guidelines

1. **Power Budget:**
   - Starting abilities: Low power, always available
   - Mid-level abilities: Medium power, situational
   - Ultimate abilities: High power, limited use

2. **Cooldown/Usage:**
   - No cooldown: Weaker abilities
   - 3-turn cooldown: Medium abilities
   - 5-turn cooldown: Strong abilities
   - 1-2 uses per dungeon: Ultimate abilities

3. **Synergy:**
   - Abilities should combo with class theme
   - Some abilities enable others
   - Party synergy (buffs help allies)

4. **Clarity:**
   - Clear, concise descriptions
   - Obvious when to use
   - Predictable outcomes

---

## Progression Pace

### Expected Timeline

**Floor 1-5:** Levels 1-3
- Learning basics
- First ability unlock

**Floor 6-10:** Levels 4-6
- Building power
- Second ability unlock + Ultimate

**Floor 11-20:** Levels 7-12
- Significant power spike
- Enhanced abilities

**Floor 21+:** Levels 13-20
- Endgame power
- Approaching mastery

### XP Distribution

Estimated XP per 5 floors: **~2000-3000 XP**
- 10 combat events: 750-1000 XP
- 10 successful choices: 250-500 XP
- 5 floor completions: 500 XP
- 1 boss (every 10 floors): 500-1000 XP

---

## Future Enhancements

### Skill Trees
- Branch ability paths
- Choose specializations
- Respec options (for gold)

### Prestige System
- Reset character with bonuses
- Unlock special cosmetics
- Leaderboard integration

### Ability Customization
- Modify ability effects
- Choose damage type (fire, ice, etc.)
- Upgrade paths

---

## Balance Goals

- **Early game:** Weak but learning
- **Mid game:** Gaining power, exciting upgrades
- **Late game:** Powerful but still challenged
- **Endgame:** Feel like a hero, but not invincible

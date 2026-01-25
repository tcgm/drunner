# Balance Guidelines

Game balance philosophy, scaling formulas, and tuning guidelines.

---

## Core Balance Philosophy

1. **Fair Challenge:** Difficult but not punishing
2. **Skill Expression:** Better decisions = better outcomes
3. **Build Diversity:** Multiple viable strategies
4. **Escalating Difficulty:** Smooth power curve
5. **Meaningful Choices:** No obvious "correct" answers

---

## Starting Content Goals

### MVP Targets

| Content Type | Target | Notes |
|-------------|--------|-------|
| **Classes** | 8 core | Balanced archetypes |
| **Events** | 50+ unique | 8-10 per event type |
| **Items** | 100+ | Across all rarities |
| **Enemies** | 20+ types | Varied behaviors |
| **Floors** | Endless | Scaling difficulty |
| **Boss Encounters** | 5+ templates | Every 10 floors |

### Stretch Goals
- 12 additional classes (20 total)
- 100+ events
- 200+ items
- 4 additional equipment slots
- Set items and cursed items

---

## Hero Stat Scaling

### Level 1 Base Stats
**Total Points:** 30-40 (varies by class)

**Distribution Examples:**

| Class | HP | ATK | DEF | SPD | LUCK |
|-------|-----|-----|-----|-----|------|
| Warrior | 100 | 12 | 10 | 5 | 3 |
| Mage | 60 | 5 | 3 | 8 | 4 |
| Rogue | 80 | 10 | 5 | 12 | 8 |
| Cleric | 90 | 6 | 7 | 6 | 6 |

### Level 20 Progression
**Per Level:** +5 to all stats  
**Total Gain:** +95 to all stats after 19 levels

**Level 20 Example (Warrior):**
- HP: 195 (100 + 95)
- ATK: 107 (12 + 95)
- DEF: 105 (10 + 95)
- SPD: 100 (5 + 95)
- LUCK: 98 (3 + 95)

**Total Level 20 Stats:** ~125-135 points

---

## Item Power Scaling

### By Rarity

| Rarity | Stat Bonus | Special Effects | Gold Value |
|--------|------------|-----------------|------------|
| Junk | +1 to +5 | None | 1-5 gold |
| Common | +5 to +15 | Rare | 10-30 gold |
| Uncommon | +15 to +30 | Sometimes | 30-80 gold |
| Rare | +30 to +50 | Usually | 80-200 gold |
| Epic | +50 to +80 | Always | 200-500 gold |
| Legendary | +80 to +120 | Multiple | 500-1500 gold |
| Mythic | +120 to +200 | Unique | 1500+ gold |

### Item Budget Formula

```
Item Power Budget = Base Stat Points + Special Effect Value

Common: 10-20 points
Uncommon: 20-40 points
Rare: 40-70 points
Epic: 70-110 points
Legendary: 110-160 points
Mythic: 160-250 points
```

**Example - Epic Sword:**
- +60 ATK (60 points)
- +10% crit chance (20 points)
- 10% fire damage on hit (15 points)
- **Total:** 95 points (within Epic budget)

---

## Enemy Scaling

### By Dungeon Depth

**Floors 1-5 (Early Game):**
- **Enemies:** Goblins, Rats, Bandits
- **HP:** 20-40
- **ATK:** 5-10
- **DEF:** 2-5
- **Rewards:** 50-75 XP, Junk/Common loot

**Floors 6-10 (Mid Game):**
- **Enemies:** Orcs, Spiders, Cultists
- **HP:** 40-80
- **ATK:** 10-20
- **DEF:** 5-10
- **Rewards:** 75-125 XP, Common/Uncommon loot

**Floors 11-20 (Late Game):**
- **Enemies:** Trolls, Demons, Dark Knights
- **HP:** 80-150
- **ATK:** 20-40
- **DEF:** 10-20
- **Rewards:** 125-200 XP, Rare/Epic loot

**Floors 21+ (Endgame):**
- **Enemies:** Dragons, Arch-Demons, Undead Lords
- **HP:** 150-300
- **ATK:** 40-80
- **DEF:** 20-40
- **Rewards:** 200-300 XP, Epic/Legendary loot

### Boss Multipliers
- **HP:** 3x normal enemy HP
- **ATK:** 1.5x normal enemy ATK
- **DEF:** 1.5x normal enemy DEF
- **Rewards:** 5-10x XP, Guaranteed Rare+ loot

---

## Loot Drop Rates

### By Dungeon Depth

**Floors 1-5:**
- Junk: 30%
- Common: 50%
- Uncommon: 20%
- Rare: 0%

**Floors 6-10:**
- Junk: 10%
- Common: 50%
- Uncommon: 30%
- Rare: 10%
- Epic: 0%

**Floors 11-20:**
- Common: 20%
- Uncommon: 40%
- Rare: 30%
- Epic: 10%
- Legendary: 0%

**Floors 21+:**
- Uncommon: 10%
- Rare: 30%
- Epic: 40%
- Legendary: 15%
- Mythic: 5%

### Boss Loot Guarantees
- Floors 1-10: Guaranteed Uncommon+
- Floors 11-20: Guaranteed Rare+
- Floors 21+: Guaranteed Epic+
- Every 50 floors: Guaranteed Legendary

---

## Economy Balance

### Gold Sources
- Combat: 10-50 gold per enemy
- Treasure events: 50-200 gold
- Selling items: 50% of item value

### Gold Sinks
- Merchant purchases (equipment)
- Event choices (bribes, tolls)
- Crafting/upgrading (stretch goal)

### Merchant Pricing
- Common: 20-60 gold
- Uncommon: 60-160 gold
- Rare: 160-400 gold
- Epic: 400-1000 gold
- Legendary: 1000+ gold

### Gold Accumulation Target
**Per 10 Floors:** ~500-1000 gold

**Spending Strategy:**
- Early game: Save for Uncommon weapon/armor
- Mid game: Invest in Rare gear
- Late game: Splurge on Epic/Legendary

---

## Difficulty Curve

### Damage Scaling

**Player Damage Output (vs standard enemy):**
- Floor 1-5: Kill in 3-5 hits
- Floor 6-10: Kill in 4-6 hits
- Floor 11-20: Kill in 5-8 hits
- Floor 21+: Kill in 8-12 hits

**Enemy Damage to Players:**
- Floor 1-5: 3-5 damage per hit (5% max HP)
- Floor 6-10: 8-15 damage per hit (10% max HP)
- Floor 11-20: 15-30 damage per hit (15% max HP)
- Floor 21+: 30-60 damage per hit (20% max HP)

### Healing Availability
- Rest events: Every 5-8 floors
- Health potions: ~2 per 10 floors
- Cleric healing: Limited uses

**Design Goal:** Players should feel pressure but not be unable to sustain.

---

## Class Balance

### Power Budget Allocation

All classes should have **equal total power** distributed differently:

**Tank (Warrior/Paladin/Knight):**
- 40% Defense (High HP, High DEF)
- 30% Offense (Medium ATK)
- 20% Utility (Taunt, protect)
- 10% Support

**DPS (Rogue/Ranger/Mage):**
- 50% Offense (High ATK or Magic)
- 20% Defense (Medium HP)
- 20% Utility (Speed, crits)
- 10% Support

**Support (Cleric/Bard):**
- 40% Support (Heals, buffs)
- 30% Utility (Versatility)
- 20% Defense (Survival)
- 10% Offense

**Hybrid (Paladin/Druid/Shaman):**
- 30% Offense
- 30% Defense
- 25% Support
- 15% Utility

---

## Event Balance

### Success Rates for Stat Checks

**Low Requirement (Party Average ≥ 70% of check):**
- Success Rate: 80%

**Medium Requirement (Party Average = 50-70% of check):**
- Success Rate: 50%

**High Requirement (Party Average ≤ 50% of check):**
- Success Rate: 20%

**Design Principle:** Parties should succeed more than they fail, but challenges should exist.

### Risk/Reward Ratio

**Safe Choice:**
- 100% success
- 50% reward value

**Moderate Risk:**
- 60-80% success
- 100% reward value

**High Risk:**
- 30-50% success
- 200% reward value

---

## Tuning Guidelines

### When Something is Too Strong
1. Reduce stat bonuses by 10-20%
2. Add cooldowns or usage limits
3. Increase costs (gold, resources)
4. Add downside/risk

### When Something is Too Weak
1. Increase stat bonuses by 10-20%
2. Reduce cooldowns
3. Add utility or flexibility
4. Lower costs

### Testing Checklist
- [ ] Can complete floors 1-10 with any class?
- [ ] Can reach floor 20 with optimal play?
- [ ] Are all 8 core classes viable?
- [ ] Do different party comps have different strategies?
- [ ] Are rare items exciting to find?
- [ ] Do events offer meaningful choices?

---

## Launch Targets

### Difficulty Goals
- **20% of runs:** Reach floor 20
- **5% of runs:** Reach floor 30
- **1% of runs:** Reach floor 50

### Average Run Length
- **Target:** 20-30 minutes
- **Floors per minute:** ~1 floor
- **Average death floor:** 8-12

### Player Satisfaction
- Losses should feel fair ("I made bad choices")
- Wins should feel earned ("My strategy worked")
- Variance should allow upsets (lucky/unlucky runs)

# Hero Classes

Complete breakdown of all 20 hero classes in Dungeon Runner.

> **Note:** This document consolidates and expands upon class definitions from the original `DESIGN.md` and `GAME_DESIGN.md` files. Class #11 was originally named "Berserker" (rage mechanic) in DESIGN.md but has been renamed to "Barbarian" for clarity, while "Berserker" (#19) focuses on dual-wielding mechanics.

---

## Core Classes (MVP - 8 Total)

### 1. Warrior
**Archetype:** Tank / Frontline Fighter  
**Playstyle:** Absorbs damage, deals consistent physical damage  
**Strengths:** High HP, High Defense, Strong Attack  
**Weaknesses:** Slow, Low Luck  
**Starting Abilities:**
- Power Strike (High damage single attack)
- Defend (Reduce incoming damage)
- Taunt (Draw enemy attention)

**Ideal For:** New players, defensive parties

---

### 2. Mage
**Archetype:** Glass Cannon / Burst Damage  
**Playstyle:** Devastating magical abilities but fragile  
**Strengths:** Highest Magic Power, Area damage  
**Weaknesses:** Lowest HP, Low Defense  
**Starting Abilities:**
- Fireball (Magic damage to enemy)
- Magic Missile (Guaranteed hit)
- Mana Shield (Temporary protection)

**Ideal For:** High-risk, high-reward gameplay

---

### 3. Rogue
**Archetype:** DPS / Critical Striker  
**Playstyle:** Fast, evasive, critical hit focused  
**Strengths:** Very High Speed, High Luck, High Crit Chance  
**Weaknesses:** Medium HP, Low Defense  
**Starting Abilities:**
- Backstab (High crit chance attack)
- Dodge (Avoid next attack)
- Poison Blade (Damage over time)

**Ideal For:** Players who like burst damage and evasion

---

### 4. Cleric
**Archetype:** Healer / Support  
**Playstyle:** Keeps party alive, provides buffs  
**Strengths:** Best healing, Defensive buffs  
**Weaknesses:** Low Attack, Slow  
**Starting Abilities:**
- Heal (Restore HP to ally)
- Bless (Buff stats)
- Holy Light (Damage + minor heal)

**Ideal For:** Essential for longer runs, sustain-focused parties

---

### 5. Ranger
**Archetype:** Balanced DPS / Ranged  
**Playstyle:** Consistent damage from range with utility  
**Strengths:** Balanced stats, High Speed, Good Luck  
**Weaknesses:** No major strengths or weaknesses  
**Starting Abilities:**
- Aimed Shot (High accuracy attack)
- Quick Shot (Fast, lower damage)
- Track (Reveal event information)

**Ideal For:** Versatile players, works in any party

---

### 6. Paladin
**Archetype:** Holy Tank / Hybrid  
**Playstyle:** Durable warrior with healing support  
**Strengths:** High HP, High Defense, Can Heal  
**Weaknesses:** Slow, Lower damage than Warrior  
**Starting Abilities:**
- Smite (Holy damage)
- Lay on Hands (Self or ally heal)
- Divine Shield (Temporary invulnerability)

**Ideal For:** Solo tank/healer hybrid builds

---

### 7. Necromancer
**Archetype:** Summoner / Debuffer  
**Playstyle:** Summons undead minions to fight alongside party  
**Strengths:** Summons, Debuffs, Damage over Time  
**Weaknesses:** Low HP, Weak direct damage  
**Starting Abilities:**
- Summon Skeleton (Create minion ally)
- Curse (Debuff enemy stats)
- Drain Life (Damage + self heal)

**Ideal For:** Players who like pet/minion gameplay

---

### 8. Bard
**Archetype:** Buffer / Utility Support  
**Playstyle:** Enhances allies, weakens enemies, versatile  
**Strengths:** Party-wide buffs, High Speed, High Luck  
**Weaknesses:** Low Attack, Low Defense  
**Starting Abilities:**
- Inspire (Buff all allies)
- Song of Rest (Heal over time)
- Discordant Note (Debuff enemies)

**Ideal For:** Team players, enables other classes

---

## Stretch Goal Classes (+12 More)

### 9. Artificer
**Archetype:** Crafter / Construct Master  
**Playstyle:** Deploys gadgets and mechanical constructs  
**Strengths:** Item synergy, Constructs, Utility  
**Weaknesses:** Weak without items/constructs  
**Starting Abilities:**
- Deploy Turret (Summon attacking construct)
- Repair (Heal constructs or heal party)
- Alchemical Bomb (AoE damage/effects)

**Special Mechanic:** Can enhance equipment quality and effects

**Ideal For:** Players who like item builds and minions

---

### 10. Sorcerer
**Archetype:** Wild Magic Caster  
**Playstyle:** Powerful but unpredictable magic  
**Strengths:** Highest raw magic damage, Random powerful effects  
**Weaknesses:** Unpredictable, Can backfire  
**Starting Abilities:**
- Chaos Bolt (High damage, random element)
- Wild Surge (Random powerful effect)
- Spell Flux (Reroll any magic effect)

**Special Mechanic:** All spells have chance for wild magic surge (bonus effect or mishap)

**Ideal For:** Players who embrace chaos and RNG

---

### 11. Barbarian
**Archetype:** Rage Tank  
**Playstyle:** Gains power as HP decreases, risk/reward tank  
**Base Stats:** Very High HP (100), High Attack (10), Medium Defense (6), Medium Speed (6), Low Luck (2)  
**Starting Abilities:**
- **Rage** - Gain +ATK as HP decreases (passive)
- **Reckless Attack** - High damage, lower defense this turn
- **Bloodlust** - Heal on kill

**Special Mechanic:** Below 50% HP: +5 ATK, +2 SPD. Below 25% HP: +10 ATK, +4 SPD  
**Ideal For:** Risk-takers who like aggressive, high-damage playstyles

---

### 12. Druid
**Archetype:** Shapeshifter / Nature Mage  
**Playstyle:** Transform into different forms, flexible hybrid  
**Base Stats:** Medium HP (80), Medium Attack (8), Medium Defense (6), Medium Speed (7), High Luck (9)  
**Starting Abilities:**
- **Wild Shape** - Transform to bear (tank), cat (DPS), or owl (support)
- **Thorn Whip** - Nature damage attack
- **Nature's Blessing** - Heal + buff

**Special Mechanic:** Each form has different stat bonuses (Bear +DEF, Cat +SPD/ATK, Owl +Magic)  
**Ideal For:** Versatile players who adapt to different situations

---

### 13. Monk
**Archetype:** Martial Artist / Unarmed Fighter  
**Playstyle:** High speed, counterattacks, unarmed combat  
**Base Stats:** Medium HP (75), Medium Attack (9), Low Defense (4), Very High Speed (12), Medium Luck (6)  
**Starting Abilities:**
- **Flurry of Blows** - Multi-hit attack
- **Deflect** - Counter enemy attacks on dodge
- **Ki Strike** - High damage using inner energy

**Special Mechanic:** 30% chance to counterattack when dodging. Unarmed damage scales with level  
**Ideal For:** Players who like speed, evasion, and reactive gameplay

---

### 14. Warlock
**Archetype:** Dark Pact Caster  
**Playstyle:** Sacrifice HP for powerful effects, high-risk magic  
**Base Stats:** Low HP (65), High Attack (11), Low Defense (3), Medium Speed (7), High Luck (8)  
**Starting Abilities:**
- **Eldritch Blast** - Consistent magic damage
- **Dark Pact** - Sacrifice 20 HP for massive damage
- **Life Sacrifice** - Spend HP to buff allies or debuff enemies

**Special Mechanic:** All abilities can use HP instead of mana. HP costs = double damage/effect  
**Ideal For:** High-risk players who embrace the dark side

---

### 15. Assassin
**Archetype:** Stealth Executioner  
**Playstyle:** Finish off weakened enemies, instant kills  
**Base Stats:** Low HP (70), High Attack (12), Low Defense (4), Very High Speed (13), Very High Luck (10)  
**Starting Abilities:**
- **Assassinate** - Instant kill if target below 20% HP
- **Vanish** - Stealth, guaranteed crit next turn
- **Shadow Step** - Reposition, gain evasion

**Special Mechanic:** 3x damage to targets below 30% HP. +50% crit chance from stealth  
**Ideal For:** Players who like burst damage and finishing blows

---

### 16. Shaman
**Archetype:** Elemental Totem Master  
**Playstyle:** Setup-based support/DPS, area buffs  
**Base Stats:** Medium HP (80), Medium Attack (8), Medium Defense (6), Low Speed (5), High Luck (9)  
**Starting Abilities:**
- **Lightning Bolt** - Elemental damage
- **Totem of Strength** - +ATK aura for party
- **Chain Heal** - Bouncing heal spell

**Special Mechanic:** Totems persist for 3 rounds, provide area buffs (+3 to chosen stat)  
**Ideal For:** Players who like setup strategies and persistent effects

---

### 17. Knight
**Archetype:** Ultimate Tank / Protector  
**Playstyle:** Maximum defense, redirects damage from allies  
**Base Stats:** Very High HP (110), Medium Attack (8), Very High Defense (12), Low Speed (4), Low Luck (3)  
**Starting Abilities:**
- **Shield Bash** - Attack + stun
- **Fortify** - Massively increase defense
- **Protect Ally** - Redirect damage from ally to self

**Special Mechanic:** Can intercept attacks targeting allies (50% chance). -50% damage when defending  
**Ideal For:** Team players who want to protect their party

---

### 18. Witch
**Archetype:** Chaos Caster  
**Playstyle:** Unpredictable magic, random effects  
**Base Stats:** Low HP (65), Medium Attack (9), Low Defense (3), High Speed (9), Very High Luck (11)  
**Starting Abilities:**
- **Hex** - Debuff + random penalty (slow, weak, blind)
- **Brew Potion** - Create random consumable
- **Wild Magic** - Random powerful effect (heal, damage, buff, debuff)

**Special Mechanic:** All abilities have 25% chance for bonus random effect (good or bad)  
**Ideal For:** Chaos enthusiasts who embrace RNG

---

### 19. Berserker
**Archetype:** Dual-Wield Warrior  
**Playstyle:** Savage, high offense, light/no armor bonus  
**Base Stats:** Very High HP (95), High Attack (11), Medium Defense (5), Medium Speed (7), Low Luck (3)  
**Starting Abilities:**
- **Dual Strike** - Attack twice with both weapons
- **Primal Roar** - Intimidate enemies, reduce their attack
- **Savage Charge** - Rush attack with knockback

**Special Mechanic:** +20% damage when wearing light/no armor. Can equip two weapons in Weapon + Offhand  
**Ideal For:** Aggressive players who prefer offense over defense

---

### 20. Alchemist
**Archetype:** Potion Master / Transmuter  
**Playstyle:** Craft consumables, explosive support/DPS  
**Base Stats:** Medium HP (75), Medium Attack (8), Low Defense (4), High Speed (9), High Luck (9)  
**Starting Abilities:**
- **Throw Flask** - Explosive AoE damage or heal
- **Transmute** - Convert items into gold or materials
- **Brew Potion** - Create consumables (health, buff, damage)

**Special Mechanic:** Can craft potions during dungeon runs. Starts with +2 random potions each run  
**Ideal For:** Players who like consumable-heavy builds and resource management

---

## Class Balance Philosophy

- **8 core classes** cover all major RPG archetypes
- **12 stretch classes** add unique mechanics and hybrid roles
- Each class should have clear strengths and weaknesses
- Multiple viable party compositions
- No "mandatory" classes, but synergies exist

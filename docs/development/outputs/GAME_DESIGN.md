# Dungeon Runner - Game Design Document

**Version:** 1.0  
**Date:** January 24, 2026  
**Type:** Event-Based Roguelike Dungeon Crawler  
**Platform:** Web Browser (Primary), Desktop via Electron (Optional)

---

## Table of Contents
1. [Game Overview](#game-overview)
2. [Core Gameplay Loop](#core-gameplay-loop)
3. [Hero Classes](#hero-classes)
4. [Equipment & Items](#equipment--items)
5. [Events & Choices](#events--choices)
6. [Combat System](#combat-system-stretch-goal)
7. [Progression](#progression)
8. [Game Flow](#game-flow)
9. [Content & Balance](#content--balance)
10. [Future Expansions](#future-expansions)

---

## Game Overview

### Concept
**Dungeon Runner** is a roguelike dungeon crawler where players create a party of customizable heroes and descend through procedurally generated dungeons. Each floor presents an event with meaningful choices that affect the party's fate. Success depends on strategic decision-making, party composition, equipment management, and a bit of luck.

### Core Pillars
1. **Meaningful Choices**: Every decision matters with clear risks and rewards
2. **Party Customization**: Build your ideal team with 9+ unique classes
3. **Procedural Generation**: Every run is unique with randomized events and loot
4. **Risk vs Reward**: Push deeper for better loot, but survival becomes harder
5. **Replayability**: Multiple classes, builds, and strategies to discover

### Target Experience
- **Session Length**: 20-30 minutes per run
- **Difficulty**: Challenging but fair, with skill expression through choices
- **Tone**: Dark fantasy with moments of humor and unexpected events
- **Pacing**: Quick event resolution (30-60 seconds each) with rhythm variation

---

## Core Gameplay Loop

```
Party Creation → Start Dungeon → Event Encounter → Make Choice → Resolve Outcome → 
Continue Deeper or Rest → Find Loot → Manage Equipment → Level Up → 
Face Harder Events → Boss Fight → Victory or Death → View Results → Retry
```

### Moment-to-Moment Gameplay
1. **Encounter Event**: Read description, assess situation
2. **Evaluate Choices**: Consider party stats, items, and risk/reward
3. **Make Decision**: Select choice based on strategy
4. **Experience Outcome**: See results (damage, healing, loot, new event)
5. **Manage Party**: Equip items, use consumables, check health
6. **Progress**: Descend deeper into dungeon

---

## Hero Classes

### Core Classes (MVP - 8 Total)

#### 1. Warrior
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

#### 2. Mage
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

#### 3. Rogue
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

#### 4. Cleric
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

#### 5. Ranger
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

#### 6. Paladin
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

#### 7. Necromancer
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

#### 8. Bard
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

### Stretch Goal Classes (+12 More)

#### 9. Artificer
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

#### 10. Sorcerer
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

#### 11. Barbarian
- **Theme:** Rage-fueled warrior
- **Mechanic:** Gains power as HP decreases
- **Risk/Reward:** Low HP = High damage

#### 12. Druid
- **Theme:** Nature magic and shapeshifting
- **Mechanic:** Transform into different forms (bear, cat, etc.)
- **Versatility:** Adapt to different situations

#### 13. Monk
- **Theme:** Martial artist, inner energy
- **Mechanic:** Counterattacks on dodge
- **Playstyle:** High speed, unarmed combat

#### 14. Warlock
- **Theme:** Dark pact magic
- **Mechanic:** Sacrifice HP for powerful effects
- **Risk/Reward:** High damage at a cost

#### 15. Assassin
- **Theme:** Stealth and execution
- **Mechanic:** Bonus damage vs low-HP targets
- **Playstyle:** Finish off weakened enemies

#### 16. Shaman
- **Theme:** Elemental magic and totems
- **Mechanic:** Place totems for persistent buffs
- **Support:** Area-wide effects

#### 17. Knight
- **Theme:** Ultimate defensive specialist
- **Mechanic:** Redirect damage from allies to self
- **Tank:** Protects entire party

#### 18. Witch
- **Theme:** Chaos and unpredictable magic
- **Mechanic:** Random bonus effects on abilities
- **High Variance:** High risk, high reward

#### 19. Berserker
- **Theme:** Primal warrior, savage combat
- **Mechanic:** Dual-wield weapons, bonus damage when unarmored
- **Playstyle:** High offense, medium defense

#### 20. Alchemist
- **Theme:** Potion and transmutation master
- **Mechanic:** Craft potions mid-dungeon, throw explosive flasks
- **Utility:** Resource generation, adaptable support/damage

---

## Equipment & Items

### Equipment Slots

#### Core Slots (MVP - 6 Total)

**1. Weapon Slot**
- Primary source of attack power
- Types: Swords, Axes, Staffs, Bows, Daggers, Maces
- Primary Stats: +Attack, +Magic Power
- Special: Elemental damage, on-hit effects

**Examples:**
- Rusty Sword (Junk): +1 ATK
- Iron Sword (Common): +5 ATK
- Flaming Blade (Epic): +20 ATK, 10% burn chance
- Godslayer (Mythic): +50 ATK, +10% crit, lifesteal

---

**2. Armor Slot**
- Body protection, main source of defense
- Types: Plate (heavy), Chain (medium), Leather (light), Robes (cloth)
- Primary Stats: +Defense, +HP
- Class Preference: Warriors prefer plate, Mages prefer robes

**Examples:**
- Torn Cloth (Junk): +1 DEF
- Leather Vest (Common): +5 DEF, +2 SPD
- Dragon Scale Armor (Legendary): +35 DEF, +50 HP, fire resist

---

**3. Helmet Slot**
- Head protection and stat bonuses
- Types: Helms, Hats, Hoods, Circlets
- Primary Stats: +Defense, +HP, +Resist

**Examples:**
- Wizard Hat (Uncommon): +8 Magic Power
- Iron Helm (Common): +3 DEF, +10 HP
- Crown of Kings (Mythic): +15 DEF, +20 to all stats

---

**4. Boots Slot**
- Footwear affecting movement and evasion
- Types: Boots, Shoes, Sandals
- Primary Stats: +Speed, +Evasion

**Examples:**
- Leather Boots (Common): +2 SPD
- Boots of Haste (Rare): +8 SPD
- Windwalker Boots (Legendary): +15 SPD, +20% evasion

---

**5 & 6. Accessory Slots (x2)**
- Rings, amulets, trinkets, charms
- Variety of bonuses for build customization
- Can stack two different accessories

**Examples:**
- Lucky Charm (Uncommon): +5 Luck
- Ring of Strength (Rare): +5 ATK
- Amulet of Health (Rare): +30 HP
- Phoenix Feather (Legendary): Auto-revive once per dungeon

---

#### Stretch Goal Slots (+4 Additional)

**7. Offhand Slot**
- Shields: +DEF, block chance
- Tomes: +Magic for casters
- Second Weapon: Dual-wield for DPS

**8. Belt Slot**
- Utility bonuses
- Quick-access potion slots
- Inventory expansion

**9. Cloak Slot**
- Movement and stealth bonuses
- Evasion and speed
- Special movement abilities

**10. Gloves Slot**
- Attack speed and precision
- Critical hit bonuses
- Dexterity bonuses

---

### Item Rarities

#### Core Rarities (7 Tiers)

| Rarity | Color | Drop % | Power Level | Description |
|--------|-------|--------|-------------|-------------|
| **Junk** | Dark Gray | 15% | 0-5 | Vendor trash, minimal stats |
| **Common** | Light Gray | 40% | 5-15 | Basic usable items |
| **Uncommon** | Green | 25% | 15-30 | Decent items with small bonuses |
| **Rare** | Blue | 12% | 30-50 | Good items with notable bonuses |
| **Epic** | Purple | 5% | 50-80 | Powerful items with special effects |
| **Legendary** | Orange | 2.5% | 80-120 | Very rare, very powerful items |
| **Mythic** | Red/Pink | 0.5% | 120-200 | Best in slot, extremely rare |

#### Stretch Goal Rarities

**Artifact (Gold, 0.1%)**
- Unique named items: "Excalibur", "Mjolnir", "The One Ring"
- Only ONE can exist per playthrough
- Guaranteed drops from specific bosses or depths
- Game-defining power

**Cursed (Dark Purple, Special)**
- Powerful stats but with significant drawbacks
- Example: "Blade of Madness" - +50 ATK but -20 HP per turn
- Can be purified through special events
- Risk/reward decision

**Set Items (Cyan, Special)**
- Part of themed equipment sets
- Wearing multiple pieces grants set bonuses:
  - 2-piece: Small bonus (+10 to stats)
  - 4-piece: Medium bonus (+20 to stats, special effect)
  - 6-piece: Large bonus (+30 to stats, unique ability)

---

### Consumable Items

**Potions:**
- Health Potion: Restore 50 HP
- Greater Health Potion: Restore 150 HP
- Mana Potion: Restore ability uses
- Speed Potion: +5 SPD for 3 turns
- Strength Potion: +10 ATK for 3 turns

**Scrolls:**
- Scroll of Town Portal: Return to safety
- Scroll of Identification: Reveal cursed items
- Scroll of Enchanting: Improve item quality

**Food:**
- Bread: Restore 20 HP
- Cooked Meat: Restore 40 HP, +5 STR for 1 event
- Mysterious Stew: Random effect

---

## Events & Choices

### Event Types

#### 1. Combat Events (40%)
**Description:** Battle against monsters and enemies  
**Rewards:** XP, loot, gold  
**Risks:** HP damage, death  

**Example:**
> **Goblin Ambush**
> Three goblins leap from the shadows!
> 
> Choices:
> - Fight head-on (STR check)
> - Ambush them first (SPD check)
> - Negotiate (LUCK check)
> - Flee (guaranteed escape, no rewards)

---

#### 2. Treasure Events (20%)
**Description:** Find loot, chests, hidden caches  
**Rewards:** Items, gold  
**Risks:** Traps, curses  

**Example:**
> **Ancient Chest**
> You discover an ornate chest covered in strange runes.
> 
> Choices:
> - Force it open (STR check - may trigger trap)
> - Pick the lock (LUCK check - better loot if succeed)
> - Leave it (safe but no reward)
> - Use Rogue's ability (auto-success if Rogue in party)

---

#### 3. Choice Events (20%)
**Description:** Moral dilemmas, strategic decisions  
**Rewards:** Varies based on choice  
**Risks:** Unexpected consequences  

**Example:**
> **Wounded Traveler**
> A bleeding traveler begs for help. He offers gold for healing.
> 
> Choices:
> - Heal him for free (lose potion, gain karma)
> - Accept his gold (gain gold, lose karma)
> - Rob him (gain gold + items, cursed)
> - Ignore him (no effect)

---

#### 4. Rest Events (10%)
**Description:** Safe areas to recover and prepare  
**Rewards:** Healing, buffs  
**Risks:** None (safe zones)  

**Example:**
> **Campfire**
> A warm fire crackles in a safe alcove.
> 
> Choices:
> - Rest fully (heal all HP, use time)
> - Quick rest (heal 50%, faster)
> - Cook food (make consumables if have ingredients)
> - Skip rest (continue immediately)

---

#### 5. Merchant Events (5%)
**Description:** Buy, sell, and trade items  
**Rewards:** Equipment upgrades  
**Risks:** Spending resources  

**Example:**
> **Wandering Merchant**
> A cloaked merchant offers their wares.
> 
> Actions:
> - Browse items (view shop inventory)
> - Sell items (convert items to gold)
> - Special deal (random discount item)
> - Leave

---

#### 6. Trap Events (5%)
**Description:** Environmental hazards and dangerous situations  
**Rewards:** Sometimes treasure if avoided  
**Risks:** Damage, debuffs  

**Example:**
> **Spike Trap**
> You notice pressure plates ahead. One wrong step...
> 
> Choices:
> - Carefully navigate (LUCK check)
> - Rush through (take damage, guaranteed pass)
> - Send Rogue (auto-success if Rogue in party)
> - Turn back (lose progress)

---

#### 7. Boss Events (Special)
**Description:** Major encounters with powerful enemies  
**Rewards:** Guaranteed rare+ loot, major XP  
**Risks:** Difficult, can end run  

**Frequency:** Every 10 floors or at dungeon end

---

### Choice Design Principles

1. **Clear Risk/Reward**: Players should understand potential outcomes
2. **Multiple Approaches**: Different party builds should have different optimal choices
3. **Meaningful Consequences**: Choices affect the run meaningfully
4. **Skill Expression**: Players improve by learning event patterns
5. **Variety**: Events should feel fresh across multiple runs

---

## Combat System (Stretch Goal)

### Turn-Based Combat

**Initiative Order:** Based on Speed stat (highest → lowest)

**Player Actions per Turn:**
- **Attack**: Basic attack using weapon
- **Ability**: Use class ability (limited uses)
- **Item**: Use consumable from inventory
- **Defend**: Reduce damage taken this turn
- **Pass**: Skip turn (builds resource/energy)

**Enemy AI Behaviors:**
- **Aggressive**: Always attacks highest threat
- **Defensive**: Uses defense when low HP
- **Support**: Buffs allies, debuffs heroes
- **Random**: Unpredictable actions

### Combat Events (Mid-Battle)

Random events can occur during combat to add variety:

**Examples:**
- "The ceiling crumbles!" - AOE damage to all combatants
- "Reinforcements arrive!" - Additional enemies spawn
- "You spot a weakness!" - Next attack deals bonus damage
- "A healing spring appears!" - Heroes regenerate HP

**Frequency:** 20% chance per round after round 3

---

## Progression

### Experience & Leveling

**XP Sources:**
- Combat victories: 50-100 XP per enemy
- Event successes: 25-50 XP per choice
- Floor completion: 100 XP per floor

**Level Up:**
- XP Required: `level × 100` (Level 2 = 200 XP, Level 3 = 300 XP, etc.)
- Rewards per level:
  - +5 to all base stats
  - +1 ability point (unlock new abilities)
  - Full HP restore

**Max Level:** 20 (for initial runs)

### Ability Unlocks

Heroes unlock new abilities at specific levels:
- **Level 1**: 3 starting abilities
- **Level 3**: Unlock 4th ability slot
- **Level 5**: Unlock 5th ability slot
- **Level 7**: Ultimate ability
- **Level 10+**: Enhanced versions of abilities

---

## Game Flow

### 1. Main Menu
- Start New Run
- Party Setup
- View Stats/Achievements (stretch)
- Settings
- Quit

### 2. Party Creation
- Select 1-4 heroes
- Choose class for each
- Customize name, icon, color
- View class stats and abilities
- Confirm and start

### 3. Dungeon Run
- Current floor/depth displayed
- Party status bar (HP, buffs)
- Event card appears
- Choose action
- Outcome resolves
- Loot/rewards distributed
- Repeat

### 4. Between Events
- Manage inventory
- Equip items
- Use consumables
- View party stats
- Continue to next event

### 5. Run End (Victory or Death)
- Summary screen
- Stats: Floors cleared, enemies defeated, treasure found
- Final party state
- XP earned (for meta-progression, stretch goal)
- Return to main menu

---

## Content & Balance

### Starting Content Goals

**Classes:** 8 core classes (20 with stretch goals)  
**Events:** 50+ unique events (10+ per event type)
**Items:** 100+ items across all rarities  
**Enemies:** 20+ enemy types  
**Floors:** Endless, scaling difficulty  

### Balance Guidelines

**Hero Stats Scaling:**
- Base stats at level 1: Total ~30-40 points
- Each level: +5 to stats
- Level 20: Total ~130-140 points

**Item Power:**
- Junk: +1-5 to stats
- Common: +5-15
- Uncommon: +15-30
- Rare: +30-50
- Epic: +50-80
- Legendary: +80-120
- Mythic: +120-200

**Enemy Scaling:**
- Floor 1-5: Weak enemies (goblins, rats)
- Floor 6-10: Medium enemies (orcs, spiders)
- Floor 11-20: Strong enemies (trolls, demons)
- Floor 21+: Boss-tier enemies

**Loot Quality by Depth:**
- Floor 1-5: Junk/Common (80%), Uncommon (20%)
- Floor 6-10: Common (60%), Uncommon (30%), Rare (10%)
- Floor 11-20: Uncommon (40%), Rare (40%), Epic (15%), Legendary (5%)
- Floor 21+: Rare (30%), Epic (40%), Legendary (20%), Mythic (10%)

---

## Future Expansions

### Phase 1 Additions
- Meta-progression system (permanent upgrades between runs)
- Daily challenge mode
- Achievements and milestones

### Phase 2 Additions
- Multiple dungeon themes (crypt, forest, volcano, ice cavern)
- New biome-specific events and enemies
- Boss rush mode

### Phase 3 Additions
- 8 additional classes (Berserker through Witch)
- Advanced equipment slots (Offhand, Belt, Cloak, Gloves)
- Set items and cursed items

### Phase 4 Additions
- Online leaderboards
- Shared party compositions
- Custom dungeon seeds
- Mod support (JSON-based event/item creation)

### Phase 5 Additions
- Story campaign mode
- Multiple dungeons with narrative
- Character relationships and party dynamics

---

## Conclusion

**Dungeon Runner** combines the strategic depth of party management, the excitement of roguelike procedural generation, and the satisfaction of meaningful choices into a replayable dungeon crawler experience. By focusing on event-driven gameplay over traditional combat, we create a unique experience that emphasizes decision-making and adaptation.

The modular design allows for easy expansion with new classes, items, and events while maintaining a focused core experience. Whether played in short 20-minute sessions or longer marathon runs, each descent into the dungeon offers fresh challenges and stories to discover.

---

**End of Game Design Document**

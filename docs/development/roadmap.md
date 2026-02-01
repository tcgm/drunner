# Development Roadmap

Phased development plan for Dungeon Runner.

---

## Phase 1: MVP Foundation (Core Gameplay)

**Goal**: Playable dungeon crawler with basic party, events, and loot.

### Features
- ✅ **Party Setup**
  - Create 1-4 heroes
  - Choose from 8 core classes (Warrior, Mage, Rogue, Cleric, Ranger, Paladin, Necromancer, Bard)
  - Customize name and appearance
  - View base stats

- ✅ **Event System**
  - 7 event types (Combat, Treasure, Choice, Rest, Merchant, Trap, Boss)
  - ~50 event templates (mix of all types)
  - Simple stat-based choices
  - Depth-based event scaling

- ✅ **Basic Combat**
  - Auto-resolve combat (no turn-based)
  - Damage calculation: `damage = attacker.attack - defender.defense/2`
  - Enemy scaling by floor
  - Victory/defeat conditions

- ✅ **Loot System**
  - 7 core rarities (Junk → Mythic)
  - 6 equipment slots (Weapon, Armor, Helmet, Boots, 2x Accessory)
  - Stat-based items
  - Depth-based power scaling

- ✅ **Progression**
  - XP from combat and events
  - Leveling formula: `level * 100` XP required
  - +5 all stats per level
  - Ability unlocks at levels 1, 3, 5, 7, 10, 15, 20

- ✅ **UI/UX**
  - Main menu
  - Party setup screen
  - Dungeon screen with event display
  - Inventory/equipment screen
  - Basic Chakra UI theming

**Estimated Duration**: 4-6 weeks

---

## Phase 2: Polish & Balance

**Goal**: Refined gameplay, balanced progression, improved UX.  
**Status**: ✅ COMPLETE (Feb 1, 2026)

### Features
- 🎨 **Enhanced UI** ✅ COMPLETE
  - ✅ Improved animations and transitions
  - ✅ Better visual feedback for choices
  - ✅ Rarity-colored item displays
  - ✅ Health/resource bars with animations
  - ✅ Floating damage numbers integrated

- ⚖️ **Balance Tuning** ⚠️ PARTIAL (50%)
  - ✅ Defense formula system (4 options)
  - ✅ Damage scaling configured
  - ✅ Loot drop rates by depth
  - ⚠️ Needs playtesting and fine-tuning
  - ⚠️ Class balance review needed
  - ⚠️ Difficulty curve validation

- 💾 **Save System** ✅ COMPLETE
  - ✅ Auto-save functionality
  - ✅ Automatic backups on load
  - ✅ Export/import save files
  - ✅ Save file management UI
  - ⚠️ Manual save slots not implemented (single auto-save)

- 📊 **Stats & Feedback** ✅ COMPLETE
  - ✅ Damage numbers display (integrated)
  - ✅ Combat log modal (detailed event tracking)
  - ✅ Comprehensive run statistics (20+ metrics)
  - ✅ Enhanced death/victory screens
  - ✅ Expanded run history display

- 🔊 **Audio** ❌ NOT STARTED (Optional - Deprioritized to Phase 3)
  - Background music
  - Sound effects for events
  - Volume controls

**Estimated Duration**: 2-3 weeks  
**Actual Duration**: ~1 week (with tuning remaining)

---

## Phase 3: Content Expansion

**Goal**: Add variety and replayability.

### Features
- 🎭 **More Classes**
  - Add 4-6 stretch classes (Sorcerer, Artificer, Barbarian, Druid, Monk, Warlock)
  - Unique mechanics for each

- 📜 **More Events**
  - Expand to 100+ event templates
  - Branching choice events
  - Multi-stage events
  - Rare/unique events

- 🏆 **Achievements** (Stretch)
  - Track milestones (reach depth 50, collect mythic item, etc.)
  - Achievement display in menu
  - Unlock rewards

- 🎨 **Visual Polish**
  - Custom icons for classes/abilities
  - Particle effects
  - Screen shake for combat
  - Themed backgrounds for event types

**Estimated Duration**: 3-4 weeks

---

## Phase 4: Stretch Goals

**Goal**: Advanced features for depth and replayability.

### Turn-Based Combat
- Initiative system
- 5 action types (Attack, Defend, Ability, Item, Pass)
- 4 AI behaviors
- Combat events (mid-battle occurrences)
- Tactical positioning (optional)

**Duration**: 2-3 weeks

### Advanced Items
- 4 additional equipment slots (Offhand, Belt, Cloak, Gloves)
- 3 special rarities (Artifact, Cursed, Set Items)
- Item effects (heal on hit, thorns, lifesteal, etc.)
- Cursed item mechanics (powerful but with drawbacks)
- Set bonuses for matched items

**Duration**: 2 weeks

### Meta-Progression
- Permanent unlocks between runs
- Currency for persistent upgrades
- New starting options (bonus gold, extra health, etc.)
- Unlock new classes via achievements

**Duration**: 2-3 weeks

### Additional Classes
- Expand to all 20 classes (add remaining 6-8 stretch classes)
- Unique passives and ultimate abilities
- Class-specific events

**Duration**: 1-2 weeks

### Modding Support
- JSON-based event templates
- Custom class definitions
- Item mods
- Community content loading

**Duration**: 2-3 weeks

---

## Phase 5: Electron Packaging (Optional)

**Goal**: Desktop application distribution.

### Features
- 🖥️ **Electron Integration**
  - Main and renderer process setup
  - File system save adapter
  - Native menus
  - Auto-updater

- 📦 **Distribution**
  - Windows installer
  - macOS DMG
  - Linux AppImage
  - Build pipeline with electron-builder

**Estimated Duration**: 1-2 weeks

---

## Total Timeline Estimate

- **Phase 1 (MVP)**: 4-6 weeks
- **Phase 2 (Polish)**: 2-3 weeks
- **Phase 3 (Content)**: 3-4 weeks
- **Phase 4 (Stretch)**: 6-10 weeks (if all implemented)
- **Phase 5 (Electron)**: 1-2 weeks

**Minimum Viable Product**: 6-9 weeks  
**Full Featured**: 16-25 weeks

---

## Development Priorities

### Must-Have (Phase 1-2)
1. Core event system with variety
2. Basic combat resolution
3. Loot generation and equipment
4. XP/leveling progression
5. Save/load functionality
6. Playable with 8 classes

### Should-Have (Phase 3)
1. Balanced gameplay (no grinding, satisfying progression)
2. Visual polish (animations, effects)
3. Content variety (100+ events)
4. 12+ classes for build diversity

### Nice-to-Have (Phase 4)
1. Turn-based combat
2. Advanced item mechanics
3. Meta-progression
4. All 20 classes
5. Modding support

### Optional (Phase 5)
1. Electron desktop app
2. Steam release
3. Achievements/cloud saves

---

## Testing Strategy

### Unit Tests
- Damage formulas
- Loot generation
- XP calculations
- Event scaling

### Integration Tests
- Full dungeon run simulation
- Combat encounters
- Save/load cycle
- Event resolution

### Manual Testing
- Play-testing for balance
- UX feedback
- Edge case discovery
- Performance on low-end hardware

---

See [setup.md](./setup.md) for development environment setup and [deployment.md](./deployment.md) for build instructions.

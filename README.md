# Dungeon Runner

A procedurally generated, event-based dungeon crawler built with React, TypeScript, and Chakra UI. Can run as a standalone web app or packaged as an Electron desktop application.

## Overview

Dungeon Runner is a roguelike dungeon crawler where you manage a party of customizable heroes as they descend through a procedurally generated dungeon filled with events, choices, treasures, and dangers. Make strategic decisions, collect loot, level up your heroes, and see how deep you can go!

## Documentation

📚 **Comprehensive documentation is available in the [`docs/`](./docs) directory:**

- **[Overview](./docs/OVERVIEW.md)** - High-level game concept and core pillars
- **Game Design** - Gameplay mechanics and content
  - [Hero Classes](./docs/game-design/classes.md) - All 20 classes with abilities
  - [Equipment System](./docs/game-design/equipment.md) - Items, slots, and rarities
  - [Events](./docs/game-design/events.md) - Event types and design principles
  - [Combat System](./docs/game-design/combat.md) - Turn-based combat (stretch goal)
  - [Progression](./docs/game-design/progression.md) - XP, leveling, and abilities
  - [Balance](./docs/game-design/balance.md) - Formulas and tuning guidelines
- **Technical** - Architecture and implementation
  - [Architecture](./docs/technical/architecture.md) - System design and data flow
  - [Data Models](./docs/technical/data-models.md) - TypeScript interfaces
  - [State Management](./docs/technical/state-management.md) - Zustand stores
  - [File Structure](./docs/technical/file-structure.md) - Project organization
  - [UI Design](./docs/technical/ui-design.md) - Chakra UI patterns
- **Development** - Setup and deployment
  - [Roadmap](./docs/development/roadmap.md) - Development phases
  - [Setup](./docs/development/setup.md) - Installation and configuration
  - [Deployment](./docs/development/deployment.md) - Build and publish

## Features

### Core Features (MVP)
- 🎭 **8 Hero Classes** - Warrior, Mage, Rogue, Cleric, Ranger, Paladin, Necromancer, Bard
- 🎲 **7 Event Types** - Combat, Treasure, Choice, Rest, Merchant, Trap, Boss
- ⚔️ **Auto-Resolve Combat** - Fast-paced battles with damage calculation
- 🎒 **Equipment System** - 6 slots (Weapon, Armor, Helmet, Boots, 2x Accessory)
- ✨ **7 Item Rarities** - Junk to Mythic with depth-based scaling
- 📈 **Progression** - XP, leveling (+5 stats per level), ability unlocks
- 💾 **Save System** - Auto-save and manual save slots

### Stretch Goals
- 🏹 **12 Additional Classes** - Sorcerer, Artificer, Barbarian, Druid, and more
- ⚡ **Turn-Based Combat** - Tactical battles with initiative, abilities, and AI
- 🎁 **Advanced Items** - Artifacts, Cursed items, Set bonuses
- 🔄 **Meta-Progression** - Permanent unlocks between runs
- 🛠️ **4 Extra Slots** - Offhand, Belt, Cloak, Gloves
- 🎮 **Combat Events** - Mid-battle dynamic occurrences

**See [Roadmap](./docs/development/roadmap.md) for detailed development phases.**

## Technology Stack

- **React 18+** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Chakra UI v2** - Accessible, themeable component library
- **react-icons/gi** - Game Icons for fantasy/RPG iconography
- **Zustand** - Lightweight state management
- **Vite** - Fast build tooling and dev server
- **Electron** (optional) - Cross-platform desktop packaging

**Web-first architecture:** Runs in any modern browser, with optional Electron packaging for desktop distribution.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```powershell
# Clone repository
git clone https://github.com/yourusername/drunner.git
cd drunner

# Install dependencies
npm install

# Run development server (web browser)
npm run dev
```

Open browser to `http://localhost:5173`

### Building

```powershell
# Build for web
npm run build

# Preview production build
npm run preview
```

**For Electron desktop app setup, see [Deployment Guide](./docs/development/deployment.md#electron-desktop-app).**

## Project Structure

```
drunner/
├── docs/                       # Documentation
│   ├── OVERVIEW.md             # Game concept
│   ├── game-design/            # Gameplay mechanics
│   ├── technical/              # Architecture & implementation
│   └── development/            # Setup, roadmap, deployment
│
├── src/
│   ├── components/             # React UI components
│   │   ├── screens/            # Full-screen views
│   │   ├── party/              # Hero management
│   │   ├── dungeon/            # Event & dungeon UI
│   │   └── ui/                 # Shared components
│   ├── systems/                # Core game logic
│   │   ├── events/             # Event generation
│   │   ├── combat/             # Combat engine (stretch)
│   │   ├── loot/               # Loot generation
│   │   └── progression/        # XP & leveling
│   ├── store/                  # Zustand state management
│   ├── data/                   # Static game data (classes, events, items)
│   ├── types/                  # TypeScript definitions
│   ├── utils/                  # Helper functions
│   ├── hooks/                  # Custom React hooks
│   └── theme/                  # Chakra UI theming
│
├── electron/                   # Electron app files (optional)
├── README.md                   # This file
└── package.json
```

**See [File Structure](./docs/technical/file-structure.md) for detailed organization.**

## Game Overview

### Hero Classes
**8 Core Classes (MVP):**
- **Warrior** - Frontline tank with high HP and attack
- **Mage** - Powerful spells, area damage
- **Rogue** - Speed and crits, high evasion
- **Cleric** - Healing and support
- **Ranger** - Balanced ranged fighter
- **Paladin** - Tanky hybrid with healing
- **Necromancer** - Summons undead minions
- **Bard** - Buffs and debuffs

**12 Stretch Classes:**
Artificer, Sorcerer, Barbarian, Druid, Monk, Warlock, Assassin, Shaman, Knight, Witch, Berserker, Alchemist

**[See all classes with full details →](./docs/game-design/classes.md)**

### Equipment & Loot
- **6 Core Slots**: Weapon, Armor, Helmet, Boots, 2× Accessory
- **4 Stretch Slots**: Offhand, Belt, Cloak, Gloves
- **10 Rarities**: Junk → Mythic (core), plus Artifact/Cursed/Set (stretch)
- **Depth-Based Scaling**: Items get stronger as you descend

**[Equipment system details →](./docs/game-design/equipment.md)**

### Events & Gameplay
- **Combat (40%)** - Fight enemies for XP and loot
- **Treasure (20%)** - Find chests and rewards
- **Choice (20%)** - Make strategic decisions with stat checks
- **Rest (10%)** - Heal and manage resources
- **Merchant (5%)** - Buy/sell items
- **Trap (5%)** - Avoid hazards
- **Boss (Special)** - Major encounters every 10 floors

**[Event system design →](./docs/game-design/events.md)**

## Development Status

**Current Phase:** Design & Documentation Complete

- [x] Game design documentation (20 classes, 7 events, equipment, combat)
- [x] Technical architecture and data models
- [x] Development roadmap and setup guides
- [ ] Project initialization and setup
- [ ] Core event system implementation
- [ ] Loot and progression systems
- [ ] UI/UX implementation
- [ ] Combat system (stretch goal)

**[View full roadmap →](./docs/development/roadmap.md)**

## Contributing

This is currently a personal project. Contributions, suggestions, and feedback are welcome via issues!

## License

MIT License - See LICENSE file for details

- Icons: [react-icons](https://react-icons.github.io/react-icons/) (game-icons via react-icons/gi)
- UI Framework: [Chakra UI](https://chakra-ui.com)

# Dungeon Runner

A procedurally generated, event-based dungeon crawler built with React, TypeScript, and Chakra UI. Can run as a standalone web app or packaged as an Electron desktop application.

## Overview

Dungeon Runner is a roguelike dungeon crawler where you manage a party of customizable heroes as they descend through a procedurally generated dungeon filled with events, choices, treasures, and dangers. Make strategic decisions, collect loot, level up your heroes, and see how deep you can go!

## Features

### Core Features (MVP)
- **Party Management**: Create and customize 1-4 heroes with unique classes, stats, and appearances
- **Procedural Generation**: Every dungeon run is unique with randomly generated events
- **Event-Based Gameplay**: Make meaningful choices at each encounter
- **Loot System**: Discover weapons, armor, accessories, and consumables
- **Progression**: Level up heroes, unlock abilities, and grow stronger
- **Inventory Management**: Equip items and manage resources

### Stretch Goals
- **Turn-Based Combat**: Tactical battles with enemy encounters
- **Combat Events**: Dynamic mid-battle events that change the tide
- **Advanced Abilities**: Special powers and skills for each class

## Technology Stack

- **React 18+**: Modern UI framework
- **TypeScript**: Type-safe development
- **Chakra UI v2**: Accessible, themeable component library
- **React-icons**: Icon library (includes game-icons via react-icons/gi)
- **Zustand**: Lightweight state management
- **Vite**: Fast build tooling
- **Electron** (optional): Package as cross-platform desktop application

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```powershell
# Install dependencies
npm install

# Run in development mode (web browser)
npm run dev

# Run as Electron app
npm run dev:electron

# Build for web
npm run build

# Build and package as Electron app
npm run build:electron
```

## Project Structure

```
drunner/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # React application
│   │   ├── components/ # UI components
│   │   ├── data/       # Game data (classes, events, items)
│   │   ├── engine/     # Game logic (generation, resolution)
│   │   ├── store/      # State management
│   │   ├── types/      # TypeScript definitions
│   │   ├── utils/      # Helper functions
│   │   └── theme/      # Chakra UI theming
│   └── assets/         # Icons, images, sounds
├── GAME_DESIGN.md      # Human-readable game design document
├── DESIGN.md           # Technical systems design document
└── README.md           # This file
```

## Game Concepts

### Hero Classes
- **Warrior**: High HP and attack, frontline fighter
- **Mage**: Powerful abilities, lower HP
- **Rogue**: High speed and luck, critical hits
- **Cleric**: Support and healing abilities
- **Ranger**: Balanced stats, critical strikes and evasion
- **Paladin**: Tanky with healing abilities, hybrid fighter
- **Necromancer**: Summons undead minions, debuffs and damage over time
- **Bard**: Buffs allies, versatile support

#### Additional Classes (Stretch Goals)
- **Artificer**: Crafts gadgets and mechanical constructs, item specialist
- **Sorcerer**: Raw magical power with wild magic surges
- **Barbarian**: Rage mechanic, gains power at low HP
- **Druid**: Shapeshifter with nature magic
- **Monk**: Unarmed combat, high evasion and counterattacks
- **Warlock**: Pact magic with risk/reward mechanics
- **Assassin**: Stealth specialist, instant-kill abilities
- **Shaman**: Elemental magic and totem buffs
- **Knight**: Defensive specialist with shield abilities
- **Witch**: Hexes, potions, and chaotic magic
- **Berserker**: Primal fury, dual-wield specialist
- **Alchemist**: Potion master, transmutation and explosive concoctions

### Event Types
- **Combat**: Battle enemies for XP and loot
- **Treasure**: Find chests and hidden caches
- **Choice**: Make strategic decisions with consequences
- **Rest**: Heal your party and manage resources
- **Merchant**: Buy and sell items
- **Trap**: Avoid or survive environmental hazards
- **Boss**: Major encounters with unique challenges

### Equipment Slots
**Core (MVP):**
- Weapon, Armor, Helmet, Boots, 2x Accessory slots

**Stretch Goals:**
- Offhand (shields/tomes/dual-wield), Belt, Cloak, Gloves

### Item Rarities
**Core (MVP):**
- Junk (Dark Gray) - Vendor trash
- Common (Gray) - Basic items
- Uncommon (Green) - Slightly better
- Rare (Blue) - Good items
- Epic (Purple) - Powerful items
- Legendary (Orange) - Very rare, powerful
- Mythic (Red/Pink) - Extremely rare, best in slot

**Stretch Goals:**
- Artifact (Gold) - Unique named items, one per game
- Cursed (Dark Purple) - Powerful with drawbacks
- Set Items (Cyan) - Themed sets with bonuses

## Development Roadmap

See [GAME_DESIGN.md](./GAME_DESIGN.md) for the complete game design and [DESIGN.md](./DESIGN.md) for technical systems architecture.

- [x] Phase 0: Design Document
- [ ] Phase 1: Core Foundation & Project Setup
- [ ] Phase 2: Event System
- [ ] Phase 3: Items & Progression
- [ ] Phase 4: Polish & Content
- [ ] Phase 5: Combat System (Stretch Goal)
- [ ] Phase 6: Advanced Features

## Contributing

This is currently a personal project, but feel free to fork and experiment!

## License

MIT License - See LICENSE file for details

## Credits

- Icons: [react-icons](https://react-icons.github.io/react-icons/) (game-icons via react-icons/gi)
- UI Framework: [Chakra UI](https://chakra-ui.com)

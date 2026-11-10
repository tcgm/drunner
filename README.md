# Dungeon Runner

An event-based, procedurally generated roguelike dungeon crawler built with React, TypeScript, and Chakra UI.

**Platform:** Web-first (browser-based), with optional Electron desktop packaging  
**Tech Stack:** React 18+, TypeScript, Chakra UI v2, Zustand, Vite, react-icons/gi

---

## 🚀 Quick Start

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to play the game.

---

## 📚 Documentation

### For Developers
- **[Development Guidelines](docs/GUIDELINES.md)** - 🔴 **START HERE** - Essential rules and patterns
- **[Setup Instructions](SETUP_INSTRUCTIONS.md)** - Initial project setup
- **[Project Handoff](HANDOFF.md)** - Current status and next steps

### Architecture & Technical
- **[Architecture](docs/technical/architecture.md)** - System design and directives
- **[File Structure](docs/technical/file-structure.md)** - Project organization
- **[Data Models](docs/technical/data-models.md)** - TypeScript interfaces
- **[State Management](docs/technical/state-management.md)** - Zustand patterns
- **[UI Design](docs/technical/ui-design.md)** - Chakra UI guidelines

### Game Design
- **[Overview](docs/OVERVIEW.md)** - High-level game concept
- **[Hero Classes](docs/game-design/classes.md)** - All 20 classes
- **[Equipment](docs/game-design/equipment.md)** - Items and rarities
- **[Events](docs/game-design/events.md)** - Event system
- **[Combat](docs/game-design/combat.md)** - Turn-based combat (stretch)
- **[Progression](docs/game-design/progression.md)** - XP and leveling
- **[Balance](docs/game-design/balance.md)** - Formulas and tuning

### Development
- **[Roadmap](docs/development/roadmap.md)** - 5-phase development plan
- **[Deployment](docs/development/deployment.md)** - Build and deploy guides
- **[Hosting the multiplayer relay](docs/development/hosting.md)** - LAN, Caddy + nginx, or an existing nginx

---

## 🎮 Current Features

✅ Party creation with 8 hero classes  
✅ Hero stats and abilities  
✅ Basic UI with navigation  
✅ Zustand state management  
✅ Chakra UI dark theme  

🚧 Event system (in progress)  
🚧 Loot generation (planned)  
🚧 Combat system (stretch goal)  

---

## 🔴 Critical Development Rules

**Individual File Principle:**
- ✅ One hero class per file: `warrior.ts`, `mage.ts`, etc.
- ✅ One event type per file: `combat.ts`, `treasure.ts`, etc.
- ✅ Use `index.ts` to aggregate and export
- ❌ NEVER create `allClasses.ts` or similar monolithic files

**See [docs/GUIDELINES.md](docs/GUIDELINES.md) for complete rules.**

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See the [LICENSE](LICENSE) file for the full license text.

**Key points:**
- You can freely use, modify, and distribute this software
- If you modify and deploy this on a network server, you must provide the source code to users
- Any modifications must also be licensed under AGPL-3.0

---

## 📦 Project Structure

```
src/
├── components/          # React components (screens, features, UI)
├── systems/            # Game logic (events, loot, combat)
├── store/              # Zustand state management
├── data/               # Static content (classes, events, items)
│   ├── classes/        # One file per class + index.ts
│   ├── events/         # One file per event type + index.ts
│   └── items/          # One file per item category + index.ts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── theme/              # Chakra UI theme customization
```

**See [docs/technical/file-structure.md](docs/technical/file-structure.md) for details.**

---

## 🛠️ Tech Stack Details

- **React 18+** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **@vitejs/plugin-react-swc** - Fast compilation with SWC
- **Chakra UI v2** - Component library with dark mode
- **Zustand** - Lightweight state management
- **react-icons/gi** - Game Icons for fantasy/RPG iconography
- **uuid** - Unique ID generation

---

## 📖 Legacy Files

The following files contain the original design documentation and can be archived:
- `DESIGN.md` (1062 lines) - Now split into `docs/technical/`
- `GAME_DESIGN.md` (723 lines) - Now split into `docs/game-design/`

All content has been migrated to the organized `docs/` structure with 100% parity.

---

## 🤝 Contributing

1. Read **[docs/GUIDELINES.md](docs/GUIDELINES.md)** first
2. Follow the individual file principle
3. Use TypeScript strictly
4. Test your changes
5. Keep commits focused and atomic

---

## 📄 License

[Add license information]

---

**Next Steps:** See [HANDOFF.md](HANDOFF.md) for current status and immediate next tasks.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Dungeon Runner - Project Overview

**Version:** 1.0  
**Date:** January 24, 2026  
**Type:** Event-Based Roguelike Dungeon Crawler  
**Platform:** Web Browser (Primary), Desktop via Electron (Optional)

---

## Game Concept

**Dungeon Runner** is a roguelike dungeon crawler where players create a party of customizable heroes and descend through procedurally generated dungeons. Each floor presents an event with meaningful choices that affect the party's fate. Success depends on strategic decision-making, party composition, equipment management, and a bit of luck.

## Core Pillars

1. **Meaningful Choices**: Every decision matters with clear risks and rewards
2. **Party Customization**: Build your ideal team with 20 unique classes
3. **Procedural Generation**: Every run is unique with randomized events and loot
4. **Risk vs Reward**: Push deeper for better loot, but survival becomes harder
5. **Replayability**: Multiple classes, builds, and strategies to discover

## Target Experience

- **Session Length**: 20-30 minutes per run
- **Difficulty**: Challenging but fair, with skill expression through choices
- **Tone**: Dark fantasy with moments of humor and unexpected events
- **Pacing**: Quick event resolution (30-60 seconds each) with rhythm variation

## Core Gameplay Loop

```
Party Creation → Start Dungeon → Event Encounter → Make Choice → Resolve Outcome → 
Continue Deeper or Rest → Find Loot → Manage Equipment → Level Up → 
Face Harder Events → Boss Fight → Victory or Death → View Results → Retry
```

## Moment-to-Moment Gameplay

1. **Encounter Event**: Read description, assess situation
2. **Evaluate Choices**: Consider party stats, items, and risk/reward
3. **Make Decision**: Select choice based on strategy
4. **Experience Outcome**: See results (damage, healing, loot, new event)
5. **Manage Party**: Equip items, use consumables, check health
6. **Progress**: Descend deeper into dungeon

## Technology Stack

- **React 18+**: Modern UI framework
- **TypeScript**: Type-safe development
- **Chakra UI v2**: Accessible, themeable component library
- **React-icons**: Icon library (includes game-icons via react-icons/gi)
- **Zustand**: Lightweight state management
- **Vite**: Fast build tooling
- **Electron** (optional): Package as cross-platform desktop application

## Documentation

- **Game Design**: See [game-design/](./game-design/) folder for gameplay systems
- **Technical**: See [technical/](./technical/) folder for architecture and implementation
- **Development**: See [development/](./development/) folder for setup and workflows

---

**For detailed information, explore the documentation folders linked above.**

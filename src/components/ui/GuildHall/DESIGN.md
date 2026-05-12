# GuildHall Component Split Design

## Goal

Break `GuildHallModal.tsx` (~800 lines) into focused files under `src/components/ui/GuildHall/`.  
The default export from the old path (`GuildHallModal.tsx`) is preserved via a re-export so no other file needs to change.

---

## Proposed File Structure

```
src/components/ui/
├── GuildHallModal.tsx        ← thin shell, re-exports GuildHallModal from ./GuildHall/GuildHallModal
└── GuildHall/
    ├── questHelpers.ts       ← constants + pure helpers
    ├── QuestCard.tsx         ← <QuestCard> component
    ├── RoomScene.tsx         ← <RoomScene> + <HeroToken>
    └── GuildHallModal.tsx    ← main modal component (imports the above)
```

---

## File Responsibilities

### `questHelpers.ts`
Pure data and utility functions - no React, no hooks.

Exports:
- `DIFFICULTY_COLOR: Record<QuestDifficulty, string>`
- `DIFFICULTY_LABEL: Record<QuestDifficulty, string>`
- `QUEST_TYPE_ICON: Record<QuestType, React.ElementType>`
- `formatTimeLeft(expiresAt: number): string`

### `QuestCard.tsx`
Self-contained quest card component.

Imports: `questHelpers`, rarity system, Chakra UI, react-icons.  
Props:
```ts
interface QuestCardProps {
  quest: Quest
  onAccept?: () => void
  onClaim?: () => void
}
```

### `RoomScene.tsx`
Immersive room view with wandering heroes.

Exports:
- `ROOM_SPOTS: RoomSpot[]`
- `heroLevelColor(level: number): string`
- `HeroToken` component (internal use only - not exported)
- `RoomScene` component (named export)

Props:
```ts
interface RoomSceneProps {
  heroRoster: Hero[]
  party: (Hero | null)[]
  isOpen: boolean
}
```

Owns all room animation state (`heroPositions`, `selectedHeroId`) via `useState` + `setInterval` wandering effect.

### `GuildHall/GuildHallModal.tsx`
The main modal shell.

- Reads Zustand store (`heroRoster`, `party`, `bankGold`, `metaXp`, `quests`, `questsLastRefreshed`)
- Calls `refreshQuestBoard` on open
- Renders: header + `<RoomScene>` (left 60%) + quest board with `<QuestCard>` list (right 40%)
- Handles `handleAccept` / `handleClaim` with toasts

### `GuildHallModal.tsx` (original path, kept as thin re-export)
```ts
export { GuildHallModal } from './GuildHall/GuildHallModal'
```

---

## Import Changes Required

| File | Change |
|------|--------|
| Any file importing `GuildHallModal` | **No change needed** - re-export preserves the path |

---

## Notes

- `useRef` is no longer needed after the lazy-init `useState` fix; drop it from imports.
- `React` default import is unused (JSX transform); drop it unless needed.
- The `key={isOpen ? 1 : 0}` prop on `<RoomScene>` stays in the modal shell to remount the scene on each open.

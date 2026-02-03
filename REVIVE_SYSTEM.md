# Revive Consumable System

## Overview
Added a new consumable effect type `revive` that allows resurrection of fallen heroes during dungeon runs.

## Implementation

### 1. ConsumableEffect Type
Added `'revive'` to the ConsumableEffect type union in `types/index.ts`:
```typescript
type: 'heal' | 'buff' | 'cleanse' | 'damage' | 'special' | 'revive'
```

### 2. Phoenix Down Base Consumable
Created a new consumable base in `data/consumables/bases/index.ts`:
- **Name**: Phoenix Down
- **Effect**: Resurrects a fallen hero
- **Base Value**: 30 HP restored on revive
- **Icon**: Phoenix icon (GiPhoenix)
- **Rarity Restriction**: Only generates at Rare rarity or higher

### 3. Consumable Usage Restrictions
Modified `PartyMemberCard.tsx` to implement dead hero restrictions:
- Consumable icons remain visible on dead heroes
- Non-revive consumables are disabled (50% opacity, not-allowed cursor)
- Only revive consumables can be used on dead heroes
- Type-safe check: `consumable?.effect?.type === 'revive'`

### 4. Revive Effect Handler
Added revive case to `consumableManager.ts`:
```typescript
case 'revive':
  if (!hero.isAlive && consumable.effect.value) {
    updatedHero.isAlive = true
    updatedHero.stats = {
      ...updatedHero.stats,
      hp: Math.min(consumable.effect.value, hero.stats.maxHp),
    }
    message = `${hero.name} was revived with ${consumable.effect.value} HP!`
  }
```

### 5. Generation Logic
Updated `consumableGenerator.ts`:
- Phoenix Down only generates when rarity is rare/epic/legendary/mythic
- If Phoenix Down is selected with common/uncommon rarity, re-rolls to a different base
- Description generation includes revive effect text
- Example: "Resurrects a fallen hero with 150 HP. Large size, potent concentration, rare quality."

## Gameplay Balance

### Rarity Distribution
Phoenix Down can only appear as:
- **Rare**: ~30% chance at floor 20+
- **Epic**: ~15% chance at floor 40+
- **Legendary**: ~5% chance at floor 60+

### HP Restoration Scaling
Base value of 30 HP scales with:
- Floor depth (0.5% per floor, max 3x at floor 400)
- Size multiplier (tiny 0.5x → superior 2.5x)
- Potency multiplier (diluted 0.5x → pure 2.0x)
- Rarity multiplier (rare 1.15x → legendary 1.5x)

Example values:
- Floor 20 Rare Small Normal: ~40 HP
- Floor 50 Epic Large Potent: ~120 HP
- Floor 80 Legendary Greater Pure: ~250 HP

## User Experience

### Visual Feedback
- Dead heroes show consumable slots with reduced opacity (0.5)
- Cursor changes to `not-allowed` for non-revive consumables
- Revive consumables remain fully clickable with `pointer` cursor

### Message System
- Revive success: "{Hero} was revived with {X} HP!"
- Already alive: "{Hero} is already alive!"
- Uses existing consumable message system

## Future Enhancements
- Add combat revive restrictions (if needed)
- Create different revive variants (scroll of resurrection, nectar of life, etc.)
- Add partial stat restoration on revive (e.g., restore energy/buffs)
- Implement auto-revive equipment/passive effects

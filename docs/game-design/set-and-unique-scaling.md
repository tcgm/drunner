# Set & Unique Effect Scaling

Design specification for how item rarity and unique status amplify set bonuses and unique triggered effects.

---

## Overview

All set bonuses and unique-item triggered effects scale based on the **rarity** of the individual item providing them, plus an additional boost if the item was generated as a **unique roll**. Common rarity is the design baseline (multiplier = 1.0).

This means higher-rarity copies of the same set or unique item are meaningfully more powerful — a Legendary Kitsune Hood contributes significantly more to the set bonus pool than a Common one.

---

## Rarity Multiplier Table

| Rarity    | `statMultiplierBase` | Unique Boost | Effective Multiplier (unique) |
|-----------|---------------------|--------------|-------------------------------|
| Junk      | 0.5                 | ×1.3         | 0.65                          |
| Common    | 1.0                 | ×1.3         | 1.30                          |
| Uncommon  | 1.5                 | ×1.3         | 1.95                          |
| Rare      | 2.0                 | ×1.3         | 2.60                          |
| Epic      | 3.5                 | ×1.3         | 4.55                          |
| Legendary | 4.0                 | ×1.3         | 5.20                          |
| Mythic    | 5.0                 | ×1.3         | 6.50                          |

Formula (implemented in `getEffectMultiplier` in `src/systems/items/uniqueEffects.ts`):

```
effectMultiplier = rarityConfig.statMultiplierBase × (isUnique ? 1.3 : 1.0)
```

---

## Set Bonuses — Per-Piece Stacking

### Design Model

Set bonuses are **not** applied once per set. Instead, **each equipped set piece independently contributes** `baseBonus × effectMultiplier(item)` to the hero's stats. Contributions stack additively.

This means:
- A party member running a full 6-piece Common set gets `6 × 1.0 × base` total.
- A party member running a full 6-piece Legendary set gets `6 × 4.0 × base = 24 × base` total.
- A mixed set (e.g. 4 Common + 2 Legendary) gets `(4×1.0 + 2×4.0) × base = 12 × base` for a 4-piece bonus.

### Set Bonus Base Values

Base values are tuned assuming Common rarity (×1.0). They are intentionally small because Legendary full sets multiply them by up to 24×.

**Authoring guideline:** Use single-digit base stats for primary bonuses. Values above 10 are reserved for HP/MP where those stats are naturally larger.

| Set      | 2-Piece (per piece)                    | 4-Piece (per piece)                          | 6-Piece (per piece)                                    |
|----------|----------------------------------------|----------------------------------------------|--------------------------------------------------------|
| Kitsune  | Speed +1, Luck +1                      | Speed +2, Luck +1, MP +2                     | Speed +3, Luck +2, MP +4, Attack +2                    |
| Titan    | Attack +3, Defense +2                  | Attack +5, Defense +4, HP +6                 | Attack +8, Defense +6, HP +10                          |
| Arcane   | MP +3, Wisdom +2                       | MP +5, Wisdom +3, Charisma +2                | MP +8, Wisdom +5, Charisma +4, Speed +2                |
| Draconic | HP +5, Defense +1                      | HP +9, Defense +2, Attack +3                 | HP +14, Defense +4, Attack +5, Magic Power +3          |
| Shadow   | Speed +2, Luck +2                      | Speed +4, Luck +3, Attack +3                 | Speed +7, Luck +5, Attack +5, Wisdom +3                |
| Bunny    | Charisma +2, Speed +1                  | Charisma +3, Speed +2, Luck +1               | Charisma +5, Speed +4, Luck +3, Defense +2             |
| Santa    | Luck +2, Charisma +1                   | Luck +3, Charisma +2, Speed +1               | Luck +5, Charisma +4, Speed +3, HP +4                  |

### Example: 6-Piece Legendary Titan Set

Base 6-piece values: Attack +8, Defense +6, HP +10  
Legendary multiplier: ×4.0  
Per-piece contribution: Attack +32, Defense +24, HP +40  
6 pieces × contribution: **Attack +192, Defense +144, HP +240 total**

---

## Unique Triggered Effects — Scaling

Unique item effects (procs triggered on kill, boss defeat, etc.) also scale by `effectMultiplier`. Each effect receives the multiplier from the specific item that triggered it via `UniqueEffectContext.effectMultiplier`.

### Opting In / Out of Scaling

Effect handlers can choose whether to use the multiplier. Most do; some intentionally do not (e.g. binary on/off effects or effects where scaling would break gameplay).

```typescript
// Opt in — scales with rarity
handler: (ctx) => {
  const { effectMultiplier = 1.0 } = ctx
  ctx.hero.attack += Math.floor(15 * effectMultiplier)
}

// Opt out — always same value regardless of rarity
handler: (ctx) => {
  ctx.hero.flags.push('PROTECTED')
}
```

### Dynamic Descriptions

`UniqueEffectDefinition.description` accepts either a plain string or an arrow function `(effectMultiplier: number) => string`. The arrow function form is preferred so the item modal and tooltip can show the actual scaled value for the specific item's rarity.

```typescript
description: (m) => `After defeating a boss, permanently gain +${Math.max(1, Math.floor(15 * m))} Magic Power`
```

Use `resolveEffectDescription(effect, effectMultiplier)` from `uniqueEffects.ts` to render the description anywhere in UI.

---

## Implementation Files

| Concern | File |
|---|---|
| `getEffectMultiplier` helper | `src/systems/items/uniqueEffects.ts` |
| `resolveEffectDescription` helper | `src/systems/items/uniqueEffects.ts` |
| `UniqueEffectContext` type | `src/systems/items/uniqueEffects.ts` |
| Per-piece stat application | `src/utils/statCalculator.ts` |
| Set bonus definitions | `src/data/items/sets/*/effects.ts` |
| Scaled modal display | `src/components/ui/ItemDetailModal.tsx` |
| Scaled tooltip display | `src/components/ui/ItemSlot.tsx` |

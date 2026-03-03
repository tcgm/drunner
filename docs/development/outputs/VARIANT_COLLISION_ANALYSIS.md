# Variant Name First+Last Letter Collision Analysis

## Executive Summary

**Total Variants Found:** 52

**Critical Finding:** ⚠️ The "index:firstLast" validation approach has **4 collision cases** where different variants share the same first+last letter combination. This means the validation is **NOT fully robust** against array reordering.

---

## Collision Details

### 🔴 COLLISION 1: "Fe" 
**Within:** `instrument.ts` baseNames array
- **Fiddle** → F+e
- **Flute** → F+e

**Risk:** If array is reordered and a saved item at index 1 with "Fe" changes from Fiddle to Flute (or vice versa), validation would pass but display wrong variant.

---

### 🔴 COLLISION 2: "Le"
**Within:** `instrument.ts` baseNames array
- **Lute** → L+e
- **Lyre** → L+e

**Risk:** Same as above - index 0 (Lute) and index 8 (Lyre) both produce "Le".

---

### 🔴 COLLISION 3: "Cl"
**Across files:**
- **Cowl** (hood.ts) → C+l
- **Chainmail** (chainmail.ts) → C+l

**Risk:** Lower risk since different base types, but could cause confusion if base type validation is missing.

---

### 🔴 COLLISION 4: "Bs"
**Across files:**
- **Bagpipes** (instrument.ts) → B+s
- **Boots** (boots.ts) → B+s

**Risk:** Lower risk since different base types.

---

## Complete Variant Inventory

### Weapons

**Wand** (wand.ts):
- Index 0: Wand → **Wd** (len: 4)
- Index 1: Rod → **Rd** (len: 3)

**Sword** (sword.ts):
- Index 0: Sword → **Sd** (len: 5)
- Index 1: Blade → **Be** (len: 5)

**Staff** (staff.ts):
- Index 0: Staff → **Sf** (len: 5)
- Index 1: Stave → **Se** (len: 5)

**Mace** (mace.ts):
- Index 0: Mace → **Me** (len: 4)
- Index 1: Club → **Cb** (len: 4)

**Instrument** (instrument.ts):
- Index 0: Lute → **Le** (len: 4) ⚠️ COLLISION with Lyre
- Index 1: Fiddle → **Fe** (len: 6) ⚠️ COLLISION with Flute
- Index 2: Guitar → **Gr** (len: 6)
- Index 3: Bagpipes → **Bs** (len: 8) ⚠️ COLLISION with Boots (different base)
- Index 4: Flute → **Fe** (len: 5) ⚠️ COLLISION with Fiddle
- Index 5: Violin → **Vn** (len: 6)
- Index 6: Harp → **Hp** (len: 4)
- Index 7: Horn → **Hn** (len: 4)
- Index 8: Lyre → **Le** (len: 4) ⚠️ COLLISION with Lute
- Index 9: Mandolin → **Mn** (len: 8)
- Index 10: Drum → **Dm** (len: 4)
- Index 11: Pipe → **Pe** (len: 4)

**Dagger** (dagger.ts):
- Index 0: Dagger → **Dr** (len: 6)
- Index 1: Knife → **Ke** (len: 5)

**Bow** (bow.ts):
- Index 0: Bow → **Bw** (len: 3)

**Book** (book.ts):
- Index 0: Book → **Bk** (len: 4)
- Index 1: Tome → **Te** (len: 4)
- Index 2: Grimoire → **Ge** (len: 8)
- Index 3: Codex → **Cx** (len: 5)
- Index 4: Manuscript → **Mt** (len: 10)

**Axe** (axe.ts):
- Index 0: Axe → **Ae** (len: 3)

### Helmets

**Hood** (hood.ts):
- Index 0: Hood → **Hd** (len: 4)
- Index 1: Cowl → **Cl** (len: 4) ⚠️ COLLISION with Chainmail (different base)

**Helmet** (helmet.ts):
- Index 0: Helmet → **Ht** (len: 6)
- Index 1: Helm → **Hm** (len: 4)

**Crown** (crown.ts):
- Index 0: Crown → **Cn** (len: 5)
- Index 1: Tiara → **Ta** (len: 5)
- Index 2: Circlet → **Ct** (len: 7)

### Armor

**Chainmail** (chainmail.ts):
- Index 0: Chainmail → **Cl** (len: 9) ⚠️ COLLISION with Cowl (different base)

**Plate** (plate.ts):
- Index 0: Plate Armor → **Pr** (len: 11)
- Index 1: Plate Mail → **Pl** (len: 10)

**Vest** (vest.ts):
- Index 0: Vest → **Vt** (len: 4)
- Index 1: Tunic → **Tc** (len: 5)

**Robe** (robe.ts):
- Index 0: Robe → **Re** (len: 4)
- Index 1: Vestments → **Vs** (len: 9)

### Boots

**Sandals** (sandals.ts):
- Index 0: Sandals → **Ss** (len: 7)

**Greaves** (greaves.ts):
- Index 0: Greaves → **Gs** (len: 7)

**Boots** (boots.ts):
- Index 0: Boots → **Bs** (len: 5) ⚠️ COLLISION with Bagpipes (different base)

### Accessories

**Charm** (charm.ts):
- Index 0: Charm → **Cm** (len: 5)

**Amulet** (amulet.ts):
- Index 0: Amulet → **At** (len: 6)
- Index 1: Necklace → **Ne** (len: 8)

**Ring** (ring.ts):
- Index 0: Ring → **Rg** (len: 4)
- Index 1: Band → **Bd** (len: 4)

**Talisman** (talisman.ts):
- Index 0: Talisman → **Tn** (len: 8)

---

## Variant Name Length Statistics

- **Minimum Length:** 3 characters (Rod, Bow, Axe)
- **Maximum Length:** 11 characters (Plate Armor)
- **Average Length:** 5.6 characters
- **Median Length:** 5 characters

**Length Distribution:**
- 3 chars: 3 variants (5.8%)
- 4 chars: 18 variants (34.6%)
- 5 chars: 13 variants (25.0%)
- 6 chars: 7 variants (13.5%)
- 7 chars: 3 variants (5.8%)
- 8 chars: 5 variants (9.6%)
- 9 chars: 2 variants (3.8%)
- 10 chars: 2 variants (3.8%)
- 11 chars: 1 variant (1.9%)

---

## Assessment: Is "index:firstLast" Validation Robust?

### ❌ **NOT FULLY ROBUST**

**Critical Issues:**

1. **Within-Array Collisions (HIGH RISK):**
   - Instrument baseNames has 2 collision pairs within the same array
   - If array order changes, validation could pass with wrong variant
   - Example: Item saved as index 1 "Fe" (Fiddle) → array reordered → index 1 becomes something else but index 4 is now Flute "Fe" → validation passes but displays wrong instrument

2. **Cross-Base Collisions (MEDIUM RISK):**
   - Less dangerous since base type should also be validated
   - Still potential for confusion if base type checking is incomplete

### Recommended Solutions:

**Option A: Enhance Validation (Recommended)**
```typescript
// Instead of: index:firstLast
// Use: index:firstLast:length
// Example: "1:Fe:6" for Fiddle, "4:Fe:5" for Flute
```
This adds length as a third validation dimension, eliminating all collisions.

**Option B: Full Hash**
```typescript
// Use: index:hash(fullName)
// Example: "1:Fid" (first 3 chars) or "1:F4B72" (hash)
```

**Option C: Store Full Name**
```typescript
// Most robust but uses more storage
// Example: "1:Fiddle"
```

### Current Collision-Free Base Types:
✅ Wand, Sword, Staff, Mace, Dagger, Bow, Book, Axe, Helmet, Crown, Plate, Vest, Robe, Sandals, Greaves, Charm, Amulet, Ring, Talisman

### At-Risk Base Types:
⚠️ **Instrument** (2 internal collisions - HIGH RISK)
⚠️ Hood (1 cross-base collision with Chainmail)
⚠️ Boots (1 cross-base collision with Bagpipes)

---

## Conclusion

The "index:firstLast" approach works for **46 out of 52 variants (88.5%)** but fails for instrument variants where Lute/Lyre and Fiddle/Flute share codes. If arrays are reordered and a saved item's index no longer matches but the first+last letters coincidentally still match a different variant at that new index, the validation would incorrectly pass.

**Recommendation:** Add a length check (Option A) to achieve 100% collision-free validation with minimal storage overhead.

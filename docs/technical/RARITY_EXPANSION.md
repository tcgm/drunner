# Rarity System Expansion & Integration

## Overview
Integration of extended 25-tier rarity system with current 9-tier dungeon runner system for better 100-floor progression coverage.

## Current System (9 tiers)
- junk, common, uncommon, rare, epic, legendary, mythic, artifact, set
- **Problem**: Only ~13 materials for floors 21-100 (80% of game)

## Extended System (25 tiers)
- Adds 16 new tiers between existing ones for smoother progression
- Each tier has associated colors, drop rates, and stat multipliers
- System exported in `src/systems/rarity/raritySystem.ts`

## Integration Strategy

### Phase 1: Type System Update (Backward Compatible)
```typescript
// Keep current ItemRarity as-is for compatibility
export type ItemRarity = 
  | 'junk' 
  | 'common' 
  | 'uncommon' 
  | 'rare' 
  | 'epic' 
  | 'legendary' 
  | 'mythic'
  | 'artifact'
  | 'set'

// Add extended rarities gradually
export type ExtendedItemRarity = ItemRarity 
  | 'abundant'      // Between junk and common
  | 'veryRare'      // Between rare and epic  
  | 'magical'       // Between rare and epic
  | 'elite'         // Between rare and epic
  | 'mythicc'       // Enhanced mythic
  | 'divine'        // Post-mythic
  | 'celestial'     // Post-mythic
  | 'realityAnchor' // Ultra tier
  | 'structural'    // Ultra tier
  | 'singularity'   // Ultra tier
  | 'void'          // Ultra tier
  | 'elder'         // God tier
  | 'layer'         // Meta tier
  | 'plane'         // Meta tier
  | 'author'        // Meta tier
  | 'cursed'        // Special (already exists)
```

### Phase 2: Material Creation (Recommended for 100 floors)

**Floors 1-10 (Low tier)** - SUFFICIENT
- Junk: 3 materials ✓
- Abundant: ADD 2 materials (Clay, Tin)
- Common: 3 materials ✓
- Uncommon: 3 materials ✓

**Floors 11-30 (Mid tier)** - NEEDS EXPANSION
- Rare: 3 materials ✓
- VeryRare: ADD 3 materials (Obsidian, Crystal, Moonstone)
- Magical: ADD 3 materials (Arcane, Spectral, Ethereal)
- Elite: ADD 3 materials (Masterwork, Royal, Imperial)

**Floors 31-60 (High tier)** - NEEDS EXPANSION  
- Epic: 3 materials ✓
- Legendary: 3 materials ✓
- Mythic: 4 materials ✓
- Mythicc: ADD 3 materials (Ascended, Transcendent, Apex)

**Floors 61-85 (Ultra tier)** - NEW CONTENT
- Artifact: ADD 4 materials (Reliquary, Chronos, Nexus, Aether)
- Divine: ADD 4 materials (Seraphic, Godforged, Sanctified, Blessed)
- Celestial: ADD 4 materials (Stellar, Nebula, Astral, Cosmic+ [rename existing])

**Floors 86-100 (God tier)** - NEW CONTENT
- RealityAnchor: ADD 3 materials (Foundational, Axiom, Truth)
- Structural: ADD 3 materials (Framework, Lattice, Matrix)
- Singularity: ADD 3 materials (Blackhole, Gravity, Collapse)
- Void: ADD 4 materials (Nullspace, Entropy, Oblivion, Abyss)
- Elder: ADD 3 materials (Primeval, Timeless, Ageless)

**Floors 96-100+ (Meta tier)** - ENDGAME ONLY
- Layer: ADD 2 materials (Dimensional, Planar)
- Plane: ADD 2 materials (Universal, Omniversal)
- Author: ADD 1 material (Narrative)

### Total Materials After Expansion
- **Current**: 22 materials
- **After expansion**: ~75 materials
- **Distribution**: Much better coverage across all 100 floors

## Implementation Steps

1. ✅ Create TypeScript rarity system (DONE)
2. Create new material files in expanded tier folders
3. Update ItemRarity type (gradual rollout)
4. Update loot generation weights to use new tiers
5. Update UI to support new rarity colors
6. Test depth scaling with new materials

## Backward Compatibility

All existing materials keep their current tier assignments. New materials slot into gaps:
- Events using `minRarity: 'rare'` still work
- Depth scaling automatically includes new tiers
- No breaking changes to existing saves

## Notes

- Cursed remains as modifier, not primary material rarity
- Set items continue using base materials
- New tiers optional - can enable progressively
- Colors and backgrounds from original C# system preserved

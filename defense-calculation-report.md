# Defense Calculation Report

**Generated**: 2/12/2026, 8:43:51 PM  
**Theoretical Max Defense**: 33760  
**Highest Rarity**: author (30x multiplier)

---

## Best-in-Slot Equipment

| Slot | Defense | Item | Type |
|------|---------|------|------|
| weapon | 1800 | narrative | procedural |
| armor | 13500 | narrative | procedural |
| helmet | 4500 | narrative | procedural |
| boots | 4500 | narrative | procedural |
| accessory1 | 4680 | frozenHeart.ts | unique |
| accessory2 | 4680 | frozenHeart.ts | unique |

**Total from Equipment**: 33660 defense

---

## Set Bonuses

Best set bonus found: **+100 defense** (Titan 6-piece)

---

## Defense Curve Preview

Using current configuration:
- **Curve Type**: logarithmic
- **Min Block**: 0%
- **Max Block**: 95%
- **Midpoint Ratio**: 0.4

| % of Max | Defense Value | Block % |
|----------|---------------|---------|
| 0% | 0 | 0.0% |
| 10% | 3376 | ~16.9% |
| 25% | 8440 | ~36.8% |
| 50% | 16880 | ~61.5% |
| 75% | 25320 | ~80.1% |
| 90% | 30384 | ~89.4% |
| 100% | 33760 | 95.0% |

---

## Available Rarities

| Rarity | Multiplier |
|--------|------------|
| author | 30x |
| plane | 25x |
| layer | 20x |
| elder | 18x |
| void | 15x |
| singularity | 12x |
| structural | 10x |
| realityAnchor | 9x |
| celestial | 8x |
| divine | 7x |
| artifact | 6x |
| mythicc | 5.5x |
| mythic | 5x |
| legendary | 4x |
| epic | 3.5x |
| elite | 3x |
| magical | 2.8x |
| veryRare | 2.5x |
| rare | 2x |
| uncommon | 1.5x |
| common | 1x |
| abundant | 0.8x |
| junk | 0.5x |

---

## Available Materials

| Material | Multiplier |
|----------|------------|
| narrative | 30x |
| nullspace | 15x |
| godforged | 7x |
| eternal | 6x |
| cosmic | 5.5x |
| ascended | 5.5x |
| primordial | 5x |
| adamantium | 4.8x |
| voidstone | 4.5x |
| ancient | 4.2x |
| divine | 4x |
| demon | 3.5x |
| celestial | 3.2x |
| arcane | 3x |
| spectral | 3x |

---

## How to Use This Report

1. **Review Best-in-Slot**: These are the highest defense items possible at maximum rarity
2. **Check Curve**: Verify the block percentage progression feels appropriate for your game
3. **Tune if Needed**: Edit `src/config/defenseConfig.ts` to adjust:
   - `curveType`: Change curve shape (linear, diminishing, logarithmic, exponential)
   - `midpointDefenseRatio`: Adjust where 50% block is reached
   - `maxBlockPercent`: Change the cap (default 95%)
4. **Rerun**: Execute `npm run calculate-max-defense` after adding items or changing values

---

*This report is regenerated each time you run the calculator script.*

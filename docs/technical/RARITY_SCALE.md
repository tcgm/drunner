# Rarity Scale & Floor Progression

## Complete Rarity Tiers

| Rarity | Min Floor | Tier | Description |
|--------|-----------|------|-------------|
| junk | 0 | Base | Broken/worthless items |
| abundant | 0 | Base | Common drops |
| common | 1 | Base | Standard items |
| uncommon | 5 | Base | Slightly better |
| rare | 10 | Mid | Notable quality |
| veryRare | 15 | Mid | Hard to find |
| magical | 20 | Mid | Enchanted items |
| elite | 25 | Mid | Superior quality |
| epic | 30 | High | Exceptional items |
| legendary | 40 | High | Famous artifacts |
| mythic | 50 | High | Items of legend |
| mythicc | 55 | High | Beyond mythic |
| artifact | 60 | Ultra | Ancient relics |
| divine | 65 | Ultra | God-touched |
| celestial | 70 | Ultra | Heaven-forged |
| realityAnchor | 75 | God | Reality-warping |
| structural | 80 | God | Fundamental forces |
| singularity | 85 | God | Universal constants |
| void | 90 | God | Beyond existence |
| elder | 93 | Meta | Primordial power |
| layer | 96 | Meta | Dimension-breaking |
| plane | 98 | Meta | Planar artifacts |
| author | 100 | Meta | Creator-level |

## Zone Boss Rarity Guidelines

Recommended min/max rarity ranges for zone bosses:

- **Floor 10**: uncommon → rare
- **Floor 20**: magical → elite
- **Floor 30**: elite → epic
- **Floor 40**: legendary → mythic
- **Floor 50**: mythic → mythicc
- **Floor 60**: artifact → divine
- **Floor 70**: celestial → realityAnchor
- **Floor 80**: structural → singularity
- **Floor 90**: void → elder

## Rarity Boost

The `rarityBoost` value is added to the floor level when calculating item rarity. Higher boosts increase the chance of getting better items within the min/max range.

Typical rarityBoost values:
- Zone bosses: 20-55 depending on floor and choice difficulty
- Regular bosses: 10-45 depending on floor
- Regular events: 0-20

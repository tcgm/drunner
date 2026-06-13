import type { ItemRarity } from '@/types'

export const LOOT_CONFIG = {
  baseItemValue: 50, // Base value for crafted items
  // Base chance to roll a unique instead of a procedural item when a given rarity is picked.
  // Items with a per-item `dropChance` field are excluded from this pool and roll independently.
  // Rarities omitted here (or set to 0) produce no uniques via the general pool.
  uniqueChances: {
    rare:          0.02, // 2%
    veryRare:      0.04, // 4%
    magical:       0.06, // 6%
    elite:         0.08, // 8%
    epic:          0.15, // 15%
    legendary:     0.30, // 30%
    mythic:        0.50, // 50%
    mythicc:       0.55, // 55%
    artifact:      0.60, // 60%
    divine:        0.65, // 65%
    celestial:     0.70, // 70%
    realityAnchor: 0.75, // 75%
    structural:    0.80, // 80%
    singularity:   0.85, // 85%
    void:          0.90, // 90%
    elder:         0.90, // 90%
    layer:         0.95, // 95%
    plane:         0.95, // 95%
    author:        1.00, // 100% – author-tier items are always unique
  } as Partial<Record<ItemRarity, number>>,
  setChance: 0.05, // 5% chance for set item drops

  // Rarities that can never appear in procedural loot drops regardless of floor
  excludedFromLoot: ['narrative', 'author', 'plane', 'layer', 'elder', 'void', 'singularity', 'structural', 'realityAnchor'] as const,

  // The available rarity list at a given floor (all rarities with minFloor <= floor,
  // minus excludedFromLoot) is divided into this many equal-size bucket segments,
  // ordered from lowest tier (bucket 0) to highest tier (bucket N-1).
  lootRarityBuckets: 4,

  // Floor bands: each band is active from minFloor until the next band's minFloor.
  // bucketWeights[0] = bottom segment of available rarities (lowest tiers),
  // bucketWeights[N-1] = top segment (highest tiers unlocked at this floor).
  // Values are relative weights - normalised automatically at runtime.
  // No rarity names needed: the bucket boundaries shift as new rarities unlock.
  floorBands: [
    { minFloor: 1,  bucketWeights: [70, 30,  0,  0] },
    { minFloor: 15, bucketWeights: [30, 45, 25,  0] },
    { minFloor: 30, bucketWeights: [ 5, 35, 45, 15] },
    { minFloor: 55, bucketWeights: [ 0, 10, 45, 45] },
    { minFloor: 80, bucketWeights: [ 0,  0, 30, 70] },
  ],
} as const

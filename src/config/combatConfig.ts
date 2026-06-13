export const COMBAT_CONFIG = {
  // Defense formula options
  defenseFormula: 'logarithmic' as 'flat' | 'percentage' | 'logarithmic' | 'hybrid',
  // 'flat': Simple flat reduction (defense * defenseReduction)
  // 'percentage': Diminishing returns (defense / (defense + percentageBase))
  // 'logarithmic': Armor formula ((defense * logFactor) / (1 + defense * logFactor))
  // 'hybrid': Capped percentage (min(maxReduction, defense / (defense + hybridBase)))

  // Flat formula settings
  defenseReduction: 0.5, // 50% of defense reduces damage (flat formula)

  // Percentage formula settings
  percentageBase: 200, // Base value for percentage formula (higher = less reduction per point)

  // Logarithmic formula settings
  logFactor: 0.025, // Scaling factor for logarithmic formula
  maxLogReduction: 0.90, // Maximum damage reduction cap for logarithmic formula (90%)

  // Hybrid formula settings
  hybridBase: 75, // Base value for hybrid formula
  maxReduction: 0.8, // Maximum damage reduction (80%) for hybrid formula

  mentorXpShare: 0.5, // 50% of overflow XP shared with lower level heroes
  defaultHealPercent: 0.5, // 50% max HP when no heal amount specified

  // Turn-based boss combat
  turnBased: {
    enabled: true, // Feature flag for turn-based combat
    floorBossesHaveCombat: false, // If false, only zone bosses and the final boss trigger turn-based combat

    // Boss base stats by tier
    bossStats: {
      floorBoss: {
        baseHp: 200,
        baseAttack: 30,
        baseDefense: 10,
        baseSpeed: 15,
        baseLuck: 10,
      },
      zoneBoss: {
        baseHp: 500,
        baseAttack: 50,
        baseDefense: 20,
        baseSpeed: 20,
        baseLuck: 15,
      },
      finalBoss: {
        baseHp: 2000,
        baseAttack: 100,
        baseDefense: 40,
        baseSpeed: 30,
        baseLuck: 25,
      },
    },

    // Danger contribution weights
    dangerWeights: {
      floor: 1.0, // Floors contribute 1:1 to danger
      depth: 0.05, // Events contribute minimally to danger
      combatDepth: 0.05, // Combat turns contribute same as events to danger
    },

    // Early boss scaling (reduced difficulty for floors 1-10, tapering)
    earlyBossScaling: {
      enabled: true,
      maxFloor: 10, // Scaling applies up to floor 10 (zone boss)
      baseReduction: 0.60, // Starting reduction at floor 1 (60%)
      taperPerFloor: 0.06, // Reduction decreases by 6% per floor (reaches 0% at floor 10)
      description: 'Early bosses are easier, tapering off until the first zone boss',
    },

    // Stat scaling per danger point
    bossScaling: {
      hp: 0.40, // 40% HP per danger point (fixed when combat begins)
      attack: 0.05, // 5% attack per danger point (recalculated each turn)
      defense: 0.9, // 9% defense per danger point (recalculated each turn)
      speed: 1, // 1% speed per danger point (recalculated each turn)
      luck: 2.5, // 2.5% luck per danger point (recalculated each turn)
    },
  },
} as const

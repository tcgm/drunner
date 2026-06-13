export const NEXUS_CONFIG = {
  /** Global multiplier applied to every tier's Meta XP cost. Tune globally here. */
  costMultiplier: 1.0,
  /** Global multiplier applied to every tier's stat bonus. */
  bonusMultiplier: 1.0,
  /** Number of upgrade tiers within each rarity phase before advancing to the next. */
  tiersPerRarity: 5,
  /**
   * Rarity phases in ascending order. Uses ItemRarity string values from the rarity system.
   * Each completed phase gates entry to the next at dramatically higher costs.
   */
  rarityProgression: [
    'common', 'uncommon', 'rare', 'elite',
    'epic', 'legendary', 'mythic', 'artifact',
  ] as const,
  /**
   * Exponent applied to the 1-based tier index within a rarity phase.
   * Formula: baseCost * magnitudeMultiplier^rarityIndex * tierWithinRarity^intraRarityExponent * costMultiplier
   * Higher value = steeper within-phase cost ramp.
   */
  intraRarityExponent: 1.8,
  /**
   * How many times more expensive each successive rarity phase is relative to the previous one.
   * 10 means Uncommon tier-1 costs 10× Common tier-1, Rare costs 100×, etc.
   */
  rarityMagnitudeMultiplier: 10,
} as const

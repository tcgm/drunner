export const SHOP_CONFIG = {
  priceMultiplier: 2.0, // Shop items cost 2x their base value
  refreshBaseCost: 50, // Base cost to refresh shop inventory
  refreshCostMultiplier: 0.25, // Multiplier of remaining unpurchased items value for refresh cost
  refreshCooldown: 600, // Cooldown in milliseconds before refresh button can be used again
  inventorySize: 6, // Number of potions in shop
  floorScaling: 3, // Multiplier for converting party level to effective floor for potion quality
} as const

export const MARKET_CONFIG = {
  priceMultipliers: {
    food: 1.3,     // Baker's Stall - cheapest (food items)
    supplies: 1.5, // General Goods - mid-range (supplies)
    premium: 5,    // Premium Provisions - most expensive (mixed high quality)
  },
  rarityChances: {
    food: {
      uncommon: 0.30, // 30% chance for uncommon in food stall
      rare: 0.05,     // 5% chance for rare in food stall
    },
    supplies: {
      uncommon: 0.10, // 10% chance for uncommon in supplies stall
      rare: 0.02,     // 2% chance for rare in supplies stall
    },
    premium: {
      uncommon: 0.80, // 80% chance for uncommon in premium stall
      rare: 0.60,     // 60% chance for rare in premium stall
      legendary: 0.35, // 35% chance for legendary in premium stall
      mythic: 0.15,   // 15% chance for mythic in premium stall
      mythicc: 0.05,  // 5% chance for mythic+ in premium stall (exclusive top-tier rarity)
    },
  },
  floorBonuses: {
    food: 0,      // No floor bonus for food stall
    supplies: 2,  // +2 floor bonus for supplies stall
    premium: 5,   // +5 floor bonus for premium stall
  },
  refreshBaseCost: 50, // Base cost to refresh market inventory (more stalls = higher cost)
  refreshCostMultiplier: 0.05, // Multiplier of remaining unpurchased items value for refresh cost
  refreshCooldown: 600, // Cooldown in milliseconds before refresh button can be used again
  stallSize: 7, // Number of items per stall
  stallCount: 3, // Number of stalls in the market
  floorScaling: 3, // Multiplier for converting party level to effective floor for item quality
} as const

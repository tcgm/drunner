/**
 * Game configuration and balance settings
 * Assembles all sub-configs into a single GAME_CONFIG export.
 * Edit individual config files in this folder to change specific settings.
 */

import { COLORS } from './colors'
import { FLOATING_NUMBERS_CONFIG } from './uiConfig'
import { LEVEL_UP_CONFIG, HERO_STATS_CONFIG, CHANCES_CONFIG } from './heroConfig'
import { COMBAT_CONFIG } from './combatConfig'
import { DUNGEON_CONFIG, MULTIPLIERS_CONFIG, SCALING_CONFIG, EVENTS_CONFIG, PARTY_CONFIG } from './dungeonConfig'
import { LOOT_CONFIG } from './lootConfig'
import { ITEMS_CONFIG, BANK_CONFIG, SHIFTY_GUY_CONFIG } from './economyConfig'
import { SHOP_CONFIG, MARKET_CONFIG } from './shopConfig'
import { DEATH_PENALTY_CONFIG } from './penaltyConfig'
import { NEXUS_CONFIG } from './nexusConfig'
import { FORGE_CONFIG } from './forgeConfig'

export const GAME_CONFIG = {
  colors: COLORS,
  floatingNumbers: FLOATING_NUMBERS_CONFIG,
  levelUp: LEVEL_UP_CONFIG,
  dungeon: DUNGEON_CONFIG,
  items: ITEMS_CONFIG,
  bank: BANK_CONFIG,
  hero: HERO_STATS_CONFIG,
  chances: CHANCES_CONFIG,
  combat: COMBAT_CONFIG,
  loot: LOOT_CONFIG,
  multipliers: MULTIPLIERS_CONFIG,
  scaling: SCALING_CONFIG,
  events: EVENTS_CONFIG,
  party: PARTY_CONFIG,
  shop: SHOP_CONFIG,
  market: MARKET_CONFIG,
  deathPenalty: DEATH_PENALTY_CONFIG,
  shiftyGuy: SHIFTY_GUY_CONFIG,
  nexus: NEXUS_CONFIG,
  forge: FORGE_CONFIG,
} as const

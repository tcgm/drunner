/**
 * Centralized Rarity Color Definitions
 * 
 * All rarity colors are defined here to ensure consistency across the application.
 * Each rarity has carefully selected colors that:
 * - Progress logically from common to ultra-rare
 * - Maintain at least 3.5:1 contrast ratio between adjacent tiers
 * - Use color temperature and hue to indicate power level
 * 
 * Color progression principle:
 * Gray → Green → Blue → Purple → Pink → Orange/Gold → Red → Yellow → Cyan → Special
 */

export interface RarityColorScheme {
  /** Primary border/text color (hex) */
  color: string
  /** Background color (hex) */
  backgroundColor: string
  /** Glow effect color with opacity (rgba) */
  glow: string
  /** Primary text color (hex) - usually lighter than border */
  text: string
  /** Light text variant (hex) - for emphasized text */
  textLight: string
  /** Background with opacity (rgba) - for containers */
  bg: string
  /** Gem/icon color (hex) - usually matches primary color */
  gem: string
  /** Border color (hex) - usually matches primary color */
  border: string
}

/**
 * Comprehensive rarity color definitions
 * Each tier is designed with proper visual hierarchy and contrast
 * Colors maintain at least 3.5:1 contrast with adjacent tiers for clear visual distinction
 * All backgrounds have 3.5:1+ contrast with white for readability
 * 
 * Color scheme follows traditional MMO/RPG conventions:
 * - Gray (junk) → Green (common) → Blue (uncommon) → Purple (rare) → Pink (epic) 
 * - → Orange (legendary) → Gold (mythic) → Special cosmic tiers
 */
export const RARITY_COLORS: Record<string, RarityColorScheme> = {
  // Tier 0: Junk - Gray (traditional trash tier)
  junk: {
    color: '#9CA3AF',        // Gray-400 (medium gray)
    backgroundColor: '#1F2937', // Gray-800 (L=0.0263)
    glow: 'rgba(156, 163, 175, 0.4)',
    text: '#D1D5DB',         // Gray-300
    textLight: '#E5E7EB',    // Gray-200
    bg: 'rgba(156, 163, 175, 0.1)',
    gem: '#8FB3EF',          // HSL(218°, 75%, 75%) - bright blue-gray
    border: '#9CA3AF',
  },

  // Tier 1: Abundant - Very dark green
  abundant: {
    color: '#14532D',        // Green-900 (very dark green)
    backgroundColor: '#052E16', // Green-950 (L=0.0165)
    glow: 'rgba(20, 83, 45, 0.5)',
    text: '#22C55E',         // Green-500
    textLight: '#4ADE80',    // Green-400
    bg: 'rgba(20, 83, 45, 0.1)',
    gem: '#8FEFB3',          // HSL(142°, 75%, 75%) - bright green
    border: '#14532D',
  },

  // Tier 2: Common - Bright green (traditional MMO common)
  common: {
    color: '#86EFAC',        // Green-300 (bright green)
    backgroundColor: '#14532D', // Green-900 (L=0.0454)
    glow: 'rgba(134, 239, 172, 0.5)',
    text: '#BBF7D0',         // Green-200
    textLight: '#DCFCE7',    // Green-100
    bg: 'rgba(134, 239, 172, 0.1)',
    gem: '#8EF0B2',          // HSL(142°, 77%, 75%) - bright green
    border: '#86EFAC',
  },

  // Tier 3: Uncommon - Dark blue (traditional MMO uncommon)
  uncommon: {
    color: '#1E3A8A',        // Blue-900 (dark blue)
    backgroundColor: '#1E293B', // Slate-800 (L=0.0407)
    glow: 'rgba(30, 58, 138, 0.5)',
    text: '#3B82F6',         // Blue-500
    textLight: '#60A5FA',    // Blue-400
    bg: 'rgba(30, 58, 138, 0.1)',
    gem: '#83B9FB',          // HSL(213°, 94%, 75%) - bright blue
    border: '#1E3A8A',
  },

  // Tier 4: Rare - Light purple (traditional MMO rare)
  rare: {
    color: '#C084FC',        // Purple-400 (light purple)
    backgroundColor: '#581C87', // Purple-900 (L=0.0465)
    glow: 'rgba(192, 132, 252, 0.5)',
    text: '#E9D5FF',         // Purple-200
    textLight: '#F3E8FF',    // Purple-100
    bg: 'rgba(192, 132, 252, 0.1)',
    gem: '#C084FC',
    border: '#C084FC',
  },

  // Tier 5: Very Rare - Very dark purple
  veryRare: {
    color: '#581C87',        // Purple-900 (very dark purple)
    backgroundColor: '#3B0764', // Purple-950 (L=0.0192)
    glow: 'rgba(88, 28, 135, 0.5)',
    text: '#A855F7',         // Purple-500
    textLight: '#C084FC',    // Purple-400
    bg: 'rgba(88, 28, 135, 0.1)',
    gem: '#C185F9',          // HSL(271°, 91%, 75%) - bright purple
    border: '#581C87',
  },

  // Tier 6: Magical - Bright fuchsia (magical/mystical)
  magical: {
    color: '#F0ABFC',        // Fuchsia-300 (bright fuchsia)
    backgroundColor: '#701A75', // Fuchsia-900 (L=0.0547)
    glow: 'rgba(240, 171, 252, 0.5)',
    text: '#F5D0FE',         // Fuchsia-200
    textLight: '#FAE8FF',    // Fuchsia-100
    bg: 'rgba(240, 171, 252, 0.1)',
    gem: '#F0ABFC',
    border: '#F0ABFC',
  },

  // Tier 7: Elite - Very dark rose
  elite: {
    color: '#881337',        // Rose-900 (very dark rose)
    backgroundColor: '#4C0519', // Rose-950 (L=0.0089)
    glow: 'rgba(136, 19, 55, 0.5)',
    text: '#E11D48',         // Rose-600
    textLight: '#F43F5E',    // Rose-500
    bg: 'rgba(136, 19, 55, 0.1)',
    gem: '#FC8395',          // HSL(351°, 95%, 75%) - bright rose
    border: '#881337',
  },

  // Tier 8: Epic - Light pink (traditional MMO epic)
  epic: {
    color: '#FBCFE8',        // Pink-200 (light pink)
    backgroundColor: '#831843', // Pink-900 (L=0.0404)
    glow: 'rgba(251, 207, 232, 0.5)',
    text: '#FCE7F3',         // Pink-100
    textLight: '#FDF2F8',    // Pink-50
    bg: 'rgba(251, 207, 232, 0.1)',
    gem: '#FBCFE8',
    border: '#FBCFE8',
  },

  // Tier 9: Legendary - Dark amber (traditional MMO legendary/orange)
  legendary: {
    color: '#92400E',        // Amber-900 (dark amber)
    backgroundColor: '#431407', // Orange-950 (L=0.0109)
    glow: 'rgba(146, 64, 14, 0.5)',
    text: '#F59E0B',         // Amber-500
    textLight: '#FBBF24',    // Amber-400
    bg: 'rgba(146, 64, 14, 0.1)',
    gem: '#FCDA82',          // HSL(43°, 96%, 75%) - bright amber
    border: '#92400E',
  },

  // Tier 10: Mythic - Very bright gold (traditional MMO mythic/gold)
  mythic: {
    color: '#FEF08A',        // Yellow-200 (very bright gold)
    backgroundColor: '#713F12', // Yellow-900 (L=0.0621)
    glow: 'rgba(254, 240, 138, 0.6)',
    text: '#FEF9C3',         // Yellow-100
    textLight: '#FEFCE8',    // Yellow-50
    bg: 'rgba(254, 240, 138, 0.1)',
    gem: '#FEF08A',
    border: '#FEF08A',
  },

  // Tier 11: Mythicc - Very dark red (extreme power)
  mythicc: {
    color: '#7F1D1D',        // Red-900 (very dark red)
    backgroundColor: '#450A0A', // Red-950 (L=0.0089)
    glow: 'rgba(127, 29, 29, 0.5)',
    text: '#DC2626',         // Red-600
    textLight: '#EF4444',    // Red-500
    bg: 'rgba(127, 29, 29, 0.1)',
    gem: '#F98585',          // HSL(0°, 91%, 75%) - bright red
    border: '#7F1D1D',
  },

  // Tier 12: Artifact - Bright amber/gold (ancient treasures)
  artifact: {
    color: '#FDE68A',        // Amber-200 (bright amber)
    backgroundColor: '#78350F', // Amber-900 (L=0.0712)
    glow: 'rgba(253, 230, 138, 0.6)',
    text: '#FEF3C7',         // Amber-100
    textLight: '#FFFBEB',    // Amber-50
    bg: 'rgba(253, 230, 138, 0.1)',
    gem: '#FDE68A',
    border: '#FDE68A',
  },

  // Tier 13: Divine - Dark cyan (divine waters)
  divine: {
    color: '#0E7490',        // Cyan-700 (dark cyan)
    backgroundColor: '#083344', // Cyan-950 (L=0.0217)
    glow: 'rgba(14, 116, 144, 0.6)',
    text: '#06B6D4',         // Cyan-500
    textLight: '#22D3EE',    // Cyan-400
    bg: 'rgba(14, 116, 144, 0.1)',
    gem: '#88E7F6',          // HSL(188°, 86%, 75%) - bright cyan
    border: '#0E7490',
  },

  // Tier 14: Celestial - Very bright sky (heavenly)
  celestial: {
    color: '#E0F2FE',        // Sky-100 (very bright sky)
    backgroundColor: '#0C4A6E', // Sky-900 (L=0.0610)
    glow: 'rgba(224, 242, 254, 0.6)',
    text: '#F0F9FF',         // Sky-50
    textLight: '#FFFFFF',    // White
    bg: 'rgba(224, 242, 254, 0.1)',
    gem: '#E0F2FE',
    border: '#E0F2FE',
  },

  // Tier 15: Reality Anchor - Very dark indigo (anchoring reality)
  realityAnchor: {
    color: '#312E81',        // Indigo-900 (very dark indigo)
    backgroundColor: '#1E1B4B', // Indigo-950 (L=0.0206)
    glow: 'rgba(49, 46, 129, 0.6)',
    text: '#6366F1',         // Indigo-500
    textLight: '#818CF8',    // Indigo-400
    bg: 'rgba(49, 46, 129, 0.1)',
    gem: '#8792F8',          // HSL(234°, 89%, 75%) - bright indigo
    border: '#312E81',
  },

  // Tier 16: Structural - Bright violet (fundamental structure)
  structural: {
    color: '#DDD6FE',        // Violet-200 (bright violet)
    backgroundColor: '#4C1D95', // Violet-900 (L=0.0459)
    glow: 'rgba(221, 214, 254, 0.6)',
    text: '#EDE9FE',         // Violet-100
    textLight: '#F5F3FF',    // Violet-50
    bg: 'rgba(221, 214, 254, 0.1)',
    gem: '#DDD6FE',
    border: '#DDD6FE',
  },

  // Tier 17: Singularity - Dark violet (cosmic singularity)
  singularity: {
    color: '#4C1D95',        // Violet-900 (dark violet)
    backgroundColor: '#2E1065', // Violet-950 (L=0.0193)
    glow: 'rgba(76, 29, 149, 0.6)',
    text: '#7C3AED',         // Violet-600
    textLight: '#8B5CF6',    // Violet-500
    bg: 'rgba(76, 29, 149, 0.1)',
    gem: '#A78BFA',          // Violet-400 (bright)
    border: '#4C1D95',
  },

  // Tier 18: Void - Light gray (void paradox - emptiness as lightness)
  void: {
    color: '#D1D5DB',        // Gray-300 (light gray)
    backgroundColor: '#1F2937', // Gray-800 (L=0.0263)
    glow: 'rgba(209, 213, 219, 0.5)',
    text: '#E5E7EB',         // Gray-200
    textLight: '#F3F4F6',    // Gray-100
    bg: 'rgba(209, 213, 219, 0.1)',
    gem: '#B8D0F5',          // HSL(216°, 75%, 84%) - bright blue-gray
    border: '#D1D5DB',
  },

  // Tier 19: Elder - Dark red (ancient power)
  elder: {
    color: '#7F1D1D',        // Red-900 (dark red)
    backgroundColor: '#450A0A', // Red-950 (L=0.0089)
    glow: 'rgba(127, 29, 29, 0.6)',
    text: '#DC2626',         // Red-600
    textLight: '#EF4444',    // Red-500
    bg: 'rgba(127, 29, 29, 0.1)',
    gem: '#F98585',          // HSL(0°, 91%, 75%) - bright red
    border: '#7F1D1D',
  },

  // Tier 20: Layer - Bright yellow (reality layers)
  layer: {
    color: '#FDE047',        // Yellow-300 (bright yellow)
    backgroundColor: '#713F12', // Yellow-900 (L=0.0621)
    glow: 'rgba(253, 224, 71, 0.6)',
    text: '#FEF08A',         // Yellow-200
    textLight: '#FEF9C3',    // Yellow-100
    bg: 'rgba(253, 224, 71, 0.1)',
    gem: '#FEE981',          // HSL(50°, 98%, 75%) - bright yellow
    border: '#FDE047',
  },

  // Tier 21: Plane - Dark blue (planar existence)
  plane: {
    color: '#0C4A6E',        // Sky-900 (dark blue)
    backgroundColor: '#082F49', // Sky-950 (L=0.0285)
    glow: 'rgba(12, 74, 110, 0.6)',
    text: '#0EA5E9',         // Sky-500
    textLight: '#38BDF8',    // Sky-400
    bg: 'rgba(12, 74, 110, 0.1)',
    gem: '#84D7FB',          // HSL(198°, 93%, 75%) - bright sky blue
    border: '#0C4A6E',
  },

  // Tier 22: Author - Pure white (transcendent)
  author: {
    color: '#FFFFFF',        // Pure white
    backgroundColor: '#000000', // Pure black (L=0.0000)
    glow: 'rgba(255, 255, 255, 0.8)',
    text: '#FFFFFF',         // White
    textLight: '#FFFFFF',    // White
    bg: 'rgba(255, 255, 255, 0.15)',
    gem: '#F6FAFE',          // HSL(210°, 75%, 98%) - bright white-blue
    border: '#FFFFFF',
  },

  // Special: Set Items - Teal, denotes item sets
  set: {
    color: '#14B8A6',        // Teal-500
    backgroundColor: '#134E4A', // Teal-900
    glow: 'rgba(20, 184, 166, 0.5)',
    text: '#5EEAD4',         // Teal-300
    textLight: '#CCFBF1',    // Teal-100
    bg: 'rgba(20, 184, 166, 0.1)',
    gem: '#8CF2E6',          // HSL(173°, 80%, 75%) - bright teal
    border: '#14B8A6',
  },

  // Special: Cursed Items - Dark, ominous
  cursed: {
    color: '#4B5563',        // Gray-600
    backgroundColor: '#111827', // Gray-900
    glow: 'rgba(75, 85, 99, 0.4)',
    text: '#6B7280',         // Gray-500
    textLight: '#9CA3AF',    // Gray-400
    bg: 'rgba(75, 85, 99, 0.1)',
    gem: '#8FB7EF',          // HSL(215°, 75%, 75%) - bright blue-gray
    border: '#4B5563',
  },
}

/**
 * Get rarity colors for a specific rarity tier
 * @param rarity The rarity ID
 * @returns The color scheme for that rarity, or a fallback if not found
 */
export function getRarityColors(rarity: string): RarityColorScheme {
  return RARITY_COLORS[rarity] || RARITY_COLORS.junk
}

/**
 * Get just the primary color for a rarity
 * @param rarity The rarity ID
 * @returns The hex color string
 */
export function getRarityColor(rarity: string): string {
  return RARITY_COLORS[rarity]?.color || RARITY_COLORS.junk.color
}

/**
 * Get the background color for a rarity
 * @param rarity The rarity ID
 * @returns The hex color string
 */
export function getRarityBackgroundColor(rarity: string): string {
  return RARITY_COLORS[rarity]?.backgroundColor || RARITY_COLORS.junk.backgroundColor
}

/**
 * Get the glow color for a rarity (with alpha)
 * @param rarity The rarity ID
 * @returns The rgba color string
 */
export function getRarityGlow(rarity: string): string {
  return RARITY_COLORS[rarity]?.glow || RARITY_COLORS.junk.glow
}

/**
 * Get Chakra UI color token for a rarity (for use with Chakra components)
 * Maps hex colors to approximate Chakra color tokens
 */
export const RARITY_CHAKRA_COLORS: Record<string, string> = {
  junk: 'gray.500',
  abundant: 'emerald.500',
  common: 'green.400',
  uncommon: 'blue.400',
  rare: 'purple.400',
  veryRare: 'fuchsia.400',
  magical: 'violet.400',
  elite: 'rose.400',
  epic: 'pink.400',
  legendary: 'orange.400',
  mythic: 'red.400',
  mythicc: 'red.500',
  artifact: 'yellow.400',
  divine: 'amber.300',
  celestial: 'cyan.400',
  realityAnchor: 'sky.400',
  structural: 'indigo.400',
  singularity: 'violet.500',
  void: 'slate.500',
  elder: 'violet.600',
  layer: 'pink.600',
  plane: 'rose.600',
  author: 'white',
  set: 'teal.400',
  cursed: 'gray.600',
}

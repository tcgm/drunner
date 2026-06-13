export const COLORS = {
  // Resource colors
  hp: {
    base: 'green.400',
    light: 'green.300',
    dark: 'green.500',
    glow: 'rgba(72, 187, 120, 0.8)', // #48bb78
    hex: '#48bb78',
  },
  gold: {
    base: 'yellow.400',
    light: 'yellow.300',
    dark: 'yellow.500',
    glow: 'rgba(246, 224, 94, 0.8)', // #f6e05e
    hex: '#f6e05e',
  },
  xp: {
    base: 'cyan.400',
    light: 'cyan.300',
    dark: 'cyan.500',
    glow: 'rgba(56, 189, 248, 0.8)', // #38bdf8
    hex: '#38bdf8',
  },
  alkahest: {
    base: 'purple.400',
    light: 'purple.300',
    dark: 'purple.500',
    glow: 'rgba(191, 90, 242, 0.8)', // #bf5af2
    hex: '#bf5af2',
  },
  damage: {
    base: 'red.400',
    light: 'red.300',
    dark: 'red.500',
    glow: 'rgba(245, 101, 101, 0.8)', // #f56565
    hex: '#f56565',
  },
  heal: {
    base: 'green.400',
    light: 'green.300',
    dark: 'green.500',
    glow: 'rgba(72, 187, 120, 0.8)', // #48bb78
    hex: '#48bb78',
  },
  // Stat colors (for consistent stat display across UI)
  stats: {
    attack: {
      icon: 'red.500',
      text: 'red.300',
      base: 'red.400',
    },
    defense: {
      icon: 'blue.500',
      text: 'blue.300',
      base: 'blue.400',
    },
    speed: {
      icon: 'green.500',
      text: 'green.300',
      base: 'green.400',
    },
    luck: {
      icon: 'yellow.500',
      text: 'yellow.300',
      base: 'yellow.400',
    },
    magicPower: {
      icon: 'purple.500',
      text: 'purple.300',
      base: 'purple.400',
    },
    wisdom: {
      icon: 'cyan.500',
      text: 'cyan.300',
      base: 'cyan.400',
    },
    charisma: {
      icon: 'pink.500',
      text: 'pink.300',
      base: 'pink.400',
    },
  },
  // Rarity colors (Chakra tokens - map to closest Chakra colors)
  rarity: {
    junk: 'gray.300',
    abundant: 'teal.700',
    common: 'lime.300',
    uncommon: 'blue.700',
    rare: 'purple.200',
    veryRare: 'fuchsia.800',
    magical: 'cyan.200',
    elite: 'rose.800',
    epic: 'pink.200',
    legendary: 'orange.800',
    mythic: 'yellow.100',
    mythicc: 'red.800',
    artifact: 'amber.200',
    divine: 'emerald.800',
    celestial: 'sky.200',
    realityAnchor: 'indigo.800',
    structural: 'violet.200',
    singularity: 'violet.800',
    void: 'lime.200',
    elder: 'slate.950',
    layer: 'rose.300',
    plane: 'teal.800',
    author: 'white',
  },
  // UI element colors
  ui: {
    level: 'orange.300',
    positive: 'green.400',
    negative: 'red.400',
    neutral: 'gray.400',
    highlight: 'orange.400',
  },
  teleport: {
    base: 'blue.400',
    light: 'blue.300',
    dark: 'blue.500',
    glow: 'rgba(104, 153, 255, 0.8)', // #6899ff
    hex: '#6899ff',
  },
} as const

// Convenience exports for common use cases
export const HP_COLOR = COLORS.hp.base
export const XP_COLOR = COLORS.xp.base
export const GOLD_COLOR = COLORS.gold.base
export const DAMAGE_COLOR = COLORS.damage.base
export const HEAL_COLOR = COLORS.heal.base

// Rarity colors
export const RARITY_COLORS = COLORS.rarity

// Stat colors
export const STAT_COLORS = COLORS.stats

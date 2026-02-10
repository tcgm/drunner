/**
 * Dynamically inject rarity colors as CSS custom properties
 * This ensures CSS always matches the TypeScript color definitions
 */

import { RARITY_COLORS } from '@/systems/rarity/raritySystem'

/**
 * Convert rgba string to its components for CSS manipulation
 */
function extractRgbaComponents(rgba: string): { rgb: string; alpha: string } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (!match) return null
  
  const [, r, g, b, a = '1'] = match
  return {
    rgb: `${r}, ${g}, ${b}`,
    alpha: a
  }
}

/**
 * Inject rarity color CSS variables into the document
 * Call this once at app startup
 */
export function injectRarityColorVars(): void {
  const root = document.documentElement
  
  // Inject all rarity colors as CSS variables
  Object.entries(RARITY_COLORS).forEach(([rarityName, colors]) => {
    const prefix = `--rarity-${rarityName}`
    
    // Set basic color properties
    if (colors.color) root.style.setProperty(`${prefix}-color`, colors.color)
    if (colors.backgroundColor) root.style.setProperty(`${prefix}-bg-color`, colors.backgroundColor)
    if (colors.border) root.style.setProperty(`${prefix}-border`, colors.border)
    if (colors.text) root.style.setProperty(`${prefix}-text`, colors.text)
    if (colors.textLight) root.style.setProperty(`${prefix}-text-light`, colors.textLight)
    if (colors.gem) root.style.setProperty(`${prefix}-gem`, colors.gem)
    
    // Set glow (rgba)
    if (colors.glow) {
      root.style.setProperty(`${prefix}-glow`, colors.glow)
      
      // Also set RGB components for easier manipulation
      const glowComponents = extractRgbaComponents(colors.glow)
      if (glowComponents) {
        root.style.setProperty(`${prefix}-glow-rgb`, glowComponents.rgb)
        root.style.setProperty(`${prefix}-glow-alpha`, glowComponents.alpha)
      }
    }
    
    // Set bg (rgba)
    if (colors.bg) {
      root.style.setProperty(`${prefix}-bg`, colors.bg)
      
      const bgComponents = extractRgbaComponents(colors.bg)
      if (bgComponents) {
        root.style.setProperty(`${prefix}-bg-rgb`, bgComponents.rgb)
        root.style.setProperty(`${prefix}-bg-alpha`, bgComponents.alpha)
      }
    }
  })
  
  if (import.meta.env.DEV) {
    console.log(`✨ Injected CSS variables for ${Object.keys(RARITY_COLORS).length} rarity types`)
  }
}

/**
 * Get a CSS variable reference for a rarity property
 * Usage: getCssVar('epic', 'border') returns 'var(--rarity-epic-border)'
 */
export function getRarityCssVar(rarity: string, property: 'color' | 'bg-color' | 'border' | 'text' | 'text-light' | 'gem' | 'glow' | 'bg' | 'glow-rgb' | 'glow-alpha' | 'bg-rgb' | 'bg-alpha'): string {
  return `var(--rarity-${rarity}-${property})`
}

/**
 * Build a box-shadow using rarity glow with custom opacity
 * Usage: getRarityBoxShadow('epic', 0.5) 
 * Returns: '0 0 8px rgba(var(--rarity-epic-glow-rgb), 0.5)'
 */
export function getRarityBoxShadow(rarity: string, opacity: number, blur: number = 8, spread: number = 0): string {
  return `0 0 ${blur}px ${spread}px rgba(var(--rarity-${rarity}-glow-rgb), ${opacity})`
}

/**
 * Build a radial gradient using rarity glow
 */
export function getRarityRadialGradient(rarity: string, opacity: number, stop: number = 70): string {
  return `radial-gradient(circle, rgba(var(--rarity-${rarity}-glow-rgb), ${opacity}) 0%, transparent ${stop}%)`
}

// Enable HMR for rarity system changes
if (import.meta.hot) {
  import.meta.hot.accept('@/systems/rarity/raritySystem', async (newModule) => {
    // Use dynamic import to get fresh RARITY_COLORS without causing React remounts
    const { RARITY_COLORS: freshColors } = await import('@/systems/rarity/raritySystem')
    
    // Re-inject colors manually with fresh data
    const root = document.documentElement
    Object.entries(freshColors).forEach(([rarityName, colors]) => {
      const prefix = `--rarity-${rarityName}`
      
      if (colors.color) root.style.setProperty(`${prefix}-color`, colors.color)
      if (colors.backgroundColor) root.style.setProperty(`${prefix}-bg-color`, colors.backgroundColor)
      if (colors.border) root.style.setProperty(`${prefix}-border`, colors.border)
      if (colors.text) root.style.setProperty(`${prefix}-text`, colors.text)
      if (colors.textLight) root.style.setProperty(`${prefix}-text-light`, colors.textLight)
      if (colors.gem) root.style.setProperty(`${prefix}-gem`, colors.gem)
      
      if (colors.glow) {
        root.style.setProperty(`${prefix}-glow`, colors.glow)
        const match = colors.glow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (match) {
          const [, r, g, b, a = '1'] = match
          root.style.setProperty(`${prefix}-glow-rgb`, `${r}, ${g}, ${b}`)
          root.style.setProperty(`${prefix}-glow-alpha`, a)
        }
      }
      
      if (colors.bg) {
        root.style.setProperty(`${prefix}-bg`, colors.bg)
        const match = colors.bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (match) {
          const [, r, g, b, a = '1'] = match
          root.style.setProperty(`${prefix}-bg-rgb`, `${r}, ${g}, ${b}`)
          root.style.setProperty(`${prefix}-bg-alpha`, a)
        }
      }
    })
    
    console.log('🔄 Rarity colors updated via HMR')
  })
}

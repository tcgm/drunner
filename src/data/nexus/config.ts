import type { NexusCategory } from './types'

/** Display metadata for each upgrade category */
export const NEXUS_CATEGORY_META: Record<NexusCategory, { label: string; color: string }> = {
  fortune:    { label: 'Fortune',    color: '#D4AF37' },
  combat:     { label: 'Combat',     color: '#FC8181' },
  resilience: { label: 'Resilience', color: '#68D391' },
  arcane:     { label: 'Arcane',     color: '#D6BCFA' },
}

/** Ordered list of categories for UI rendering */
export const NEXUS_CATEGORY_ORDER: NexusCategory[] = ['fortune', 'combat', 'resilience', 'arcane']

import type { Building } from './types'
import { shop } from './shop'
import { market } from './market'
import { bank } from './bank'
import { forge } from './forge'
import { tower } from './tower'
import { nexus } from './nexus'
import { temple } from './temple'
import { castle } from './castle'
import { dungeonEntrance } from './dungeonEntrance'

/** Number of columns in the town grid */
export const townGridCols = 9

/**
 * CSS sizes for each row, front-to-back depth ordering:
 *   index 0 → row 1 (back)
 *   index 1 → row 2 (mid)
 *   index 2 → row 3 (front)
 */
export const townGridRowSizes = ['10%', '40%', '50%']

/** Mobile portrait grid: 3 columns */
export const mobileTownGridCols = 3
export const mobileTownGridRowSizes = ['20%', '35%', '35%']

/**
 * Visual depth scale per row – row 1 is furthest back (smallest), row 3 is foreground.
 * Used by BuildingCard via framer-motion so that framer-motion fully owns the transform.
 */
export const townRowDepthScale: Record<number, number> = {
  1: 0.85,
  2: 0.93,
  3: 1.0,
}

/**
 * A single building's placement in the town grid.
 */
export interface BuildingPlacement {
  building: Building
  /** 1-based grid column (1 – townGridCols) */
  col: number
  /** 1-based grid row (1 – townGridRowSizes.length) */
  row: number
  /** Which side of the layout – drives slight perspective tilt on the icon */
  side: 'left' | 'right'
  /** Number of columns to span (gridColumn: col / span colSpan) */
  colSpan?: number
  /** Render as a background decoration: blurred, no label, no interaction */
  decorative?: boolean
  /** Explicit opacity for decorative elements */
  opacity?: number
  /** Special click action (overrides handleBuildingClick) */
  action?: 'enter-dungeon'
  /** Override placement on mobile portrait (≤768px). Set hidden:true to omit entirely. */
  mobile?: { col: number; row: number; colSpan?: number; hidden?: boolean }
}

export const townLayout: BuildingPlacement[] = [
  // ── Back row (row 1) ──────────────────────────────────────────────
  { building: castle,          col: 4, row: 1, side: 'left',  colSpan: 5, decorative: true, opacity: 0.4,
    mobile: { col: 1, row: 1, colSpan: 3 } },
  { building: nexus,           col: 1, row: 1, side: 'left',
    mobile: { col: 1, row: 1 } },
  { building: temple,          col: 8, row: 1, side: 'right',
    mobile: { col: 3, row: 1 } },

  // ── Mid row (row 2) ───────────────────────────────────────────────
  { building: shop,            col: 4, row: 1, side: 'left',
    mobile: { col: 1, row: 2 } },
  { building: market,          col: 3, row: 2, side: 'left',
    mobile: { col: 2, row: 2 } },
  { building: forge,           col: 8, row: 3, side: 'right',
    mobile: { col: 3, row: 2 } },
  { building: tower,           col: 7, row: 2, side: 'right',
    mobile: { col: 3, row: 3 } },

  // ── Front row (row 3) ─────────────────────────────────────────────
  { building: bank,            col: 2, row: 3, side: 'left',
    mobile: { col: 1, row: 3 } },
  { building: dungeonEntrance, col: 5, row: 3, side: 'left', action: 'enter-dungeon',
    mobile: { col: 2, row: 3 } },
]

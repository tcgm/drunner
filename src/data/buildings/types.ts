import type { IconType } from 'react-icons'

/**
 * Represents a building in the town hub
 */
export interface Building {
  id: string
  /** react-icons component or an SVG asset import (string URL) */
  icon: IconType | string
  label: string
  color: string
  description: string
  disabled?: boolean
  /** Multiplier applied to the base 120px icon size. Defaults to 1. */
  sizeMultiplier?: number
  /** Font size for the label (Chakra size token). Defaults to 'sm'. */
  labelSize?: string
}

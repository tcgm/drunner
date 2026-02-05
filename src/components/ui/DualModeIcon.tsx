import { Icon as ChakraIcon } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import type { CSSProperties } from 'react'

interface DualModeIconProps {
  // The icon component (could be from react-icons or rpgawesome)
  icon: IconType | React.ComponentType<any>
  // Chakra UI boxSize prop (for Chakra icons)
  boxSize?: string | number
  // Color for the icon
  color?: string
  // CSS fontSize (for rpgawesome icons)
  fontSize?: string
  // Additional style overrides
  style?: CSSProperties
  // Chakra props for margin, etc.
  mb?: number | string
  mr?: number | string
  ml?: number | string
  mt?: number | string
  className?: string
}

/**
 * A flexible icon component that automatically detects and renders both:
 * - Standard react-icons (using Chakra's Icon component)
 * - RPG Awesome icons (using direct rendering with style prop)
 * 
 * This prevents "Element type is invalid" errors when mixing icon types.
 */
export function DualModeIcon({
  icon: IconComponent,
  boxSize,
  color,
  fontSize,
  style = {},
  mb,
  mr,
  ml,
  mt,
  className,
}: DualModeIconProps) {
  // Safety check: ensure IconComponent exists and is valid
  if (!IconComponent || typeof IconComponent !== 'function') {
    console.warn('DualModeIcon: Invalid icon component provided', IconComponent)
    return null
  }

  // Check if this is an RPG Awesome icon (function name starts with 'RpgIcon')
  const isRpgAwesomeIcon = (IconComponent as any).displayName?.startsWith('RpgIcon')

  if (isRpgAwesomeIcon) {
    // Render RPG Awesome icon with inline styles
    const marginStyles: CSSProperties = {}
    if (mb !== undefined) marginStyles.marginBottom = typeof mb === 'number' ? `${mb * 0.25}rem` : mb
    if (mr !== undefined) marginStyles.marginRight = typeof mr === 'number' ? `${mr * 0.25}rem` : mr
    if (ml !== undefined) marginStyles.marginLeft = typeof ml === 'number' ? `${ml * 0.25}rem` : ml
    if (mt !== undefined) marginStyles.marginTop = typeof mt === 'number' ? `${mt * 0.25}rem` : mt

    return (
      <IconComponent
        style={{
          fontSize: fontSize || (typeof boxSize === 'string' ? boxSize : `${boxSize}px`) || '1em',
          color: color || 'currentColor',
          ...marginStyles,
          ...style,
        }}
        className={className}
      />
    )
  }

  // Render standard react-icon with Chakra Icon wrapper
  return (
    <ChakraIcon
      as={IconComponent}
      boxSize={boxSize}
      color={color}
      mb={mb}
      mr={mr}
      ml={ml}
      mt={mt}
      style={style}
      className={className}
    />
  )
}

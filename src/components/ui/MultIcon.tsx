import { Icon as ChakraIcon } from '@chakra-ui/react'
import type { IconType } from 'react-icons'
import type { CSSProperties } from 'react'

interface IconProps {
  style?: CSSProperties
  className?: string
}

interface MultIconProps {
  // The icon component (could be from react-icons, rpgawesome, or a local SVG string)
  icon: IconType | React.ComponentType<IconProps> | string
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
export function MultIcon({
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
}: MultIconProps) {
  // Safety check: ensure IconComponent exists and is valid
  if (!IconComponent) {
    console.warn('MultIcon: No icon component provided')
    return null
  }

  // Check if icon is a string (SVG path from import)
  if (typeof IconComponent === 'string') {
    // Render as an image (local SVG)
    const imgStyle: CSSProperties = {
      width: typeof boxSize === 'string' ? boxSize : `${boxSize || 24}px`,
      height: typeof boxSize === 'string' ? boxSize : `${boxSize || 24}px`,
      display: 'inline-block',
      verticalAlign: 'middle',
      marginBottom: mb !== undefined ? (typeof mb === 'number' ? `${mb * 0.25}rem` : mb) : undefined,
      marginRight: mr !== undefined ? (typeof mr === 'number' ? `${mr * 0.25}rem` : mr) : undefined,
      marginLeft: ml !== undefined ? (typeof ml === 'number' ? `${ml * 0.25}rem` : ml) : undefined,
      marginTop: mt !== undefined ? (typeof mt === 'number' ? `${mt * 0.25}rem` : mt) : undefined,
      ...style,
    }
    
    return <img src={IconComponent} alt="" style={imgStyle} className={className} />
  }

  // Check if icon is an empty object (failed restoration)
  const componentAny = IconComponent as unknown as Record<string, unknown>
  if (typeof IconComponent === 'object' && Object.keys(componentAny).length === 0) {
    console.warn('MultIcon: Icon is an empty object (failed restoration)')
    return null
  }

  // Additional safety check: ensure IconComponent is a function or has $$typeof (React component)
  const isReactComponent = 
    typeof IconComponent === 'function' || 
    componentAny.$$typeof || 
    componentAny.render

  if (!isReactComponent) {
    console.warn(`MultIcon: Invalid icon type, not a React component`)
    return null
  }

  // Check if this is an RPG Awesome icon (function name starts with 'RpgIcon')
  const componentDisplayName = componentAny.displayName
  const isRpgAwesomeIcon = typeof componentDisplayName === 'string' && componentDisplayName.startsWith('RpgIcon')

  if (isRpgAwesomeIcon) {
    // Render RPG Awesome icon directly - exact pattern from old working ItemSlot code
    const finalStyle: CSSProperties = {
      fontSize: fontSize || (typeof boxSize === 'string' ? boxSize : `${boxSize}px`) || '1em',
      color: color || 'currentColor',
      marginBottom: mb !== undefined ? (typeof mb === 'number' ? `${mb * 0.25}rem` : mb) : undefined,
      marginRight: mr !== undefined ? (typeof mr === 'number' ? `${mr * 0.25}rem` : mr) : undefined,
      marginLeft: ml !== undefined ? (typeof ml === 'number' ? `${ml * 0.25}rem` : ml) : undefined,
      marginTop: mt !== undefined ? (typeof mt === 'number' ? `${mt * 0.25}rem` : mt) : undefined,
      ...style,
    }

    const Component = IconComponent as React.ComponentType<IconProps>
    return <Component style={finalStyle} />
  }

  // Render standard react-icon with Chakra Icon wrapper
  return (
    <ChakraIcon
      as={IconComponent as IconType}
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

import { Box, Icon, Image } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { HeroSpecies } from '@/types'
import { SPECIES_DEFINITIONS } from '@/data/heroes/species'
import type { IconOffset } from '@/data/heroes/species'

interface HeroIconProps extends Omit<BoxProps, 'position' | 'display' | 'color'> {
  /** A react-icons-style component, a react-icons/gi name, or an image filename under src/assets/icons/classes/ - from HeroClass.icon */
  classIcon: IconType | string
  /** Species id - if present, its background/foreground icons are layered with the class icon */
  species?: HeroSpecies
  /** HeroClass.id - selects a per-class background/foreground offset override, if the species defines one */
  classId?: string
  boxSize?: string | number
  color?: string
  backgroundColor?: string
  foregroundColor?: string
}

// Eagerly maps every class icon image asset to its resolved URL, keyed by filename
// (e.g. 'warrior.svg'), so HeroClass.icon can reference a custom image instead of
// a react-icons/gi name.
const CLASS_ICON_IMAGES = import.meta.glob<string>('/src/assets/icons/classes/*.{svg,png}', {
  eager: true,
  import: 'default',
})

// The SVGs have no fill of their own (see scripts/fix-class-icon-colors.mjs) so
// they can be tinted via CSS, but that only works if the markup is inlined into
// the document - an <img src> renders the SVG in an isolated context that
// doesn't inherit page CSS. So we also glob the raw markup for inline
// rendering, keyed by filename like above.
const CLASS_ICON_SVG_SOURCES = import.meta.glob<string>('/src/assets/icons/classes/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function resolveIcon(name: string | undefined): IconType | undefined {
  return name ? ((GameIcons as Record<string, IconType>)[name] as IconType | undefined) : undefined
}

// HeroClass.icon may already be a component (e.g. a hand-authored class icon
// built with react-icons' GenIcon) rather than a string name.
function resolveClassComponent(value: IconType | string | undefined): IconType | undefined {
  return typeof value === 'function' ? value : resolveIcon(typeof value === 'string' ? value : undefined)
}

// Bare SVG filenames (e.g. 'warrior.svg') render inline so they can inherit
// `fill` from CSS; anything else (PNGs, already-resolved asset imports) falls
// back to resolveClassImage and renders as a plain <img>.
function resolveClassSvgMarkup(value: IconType | string | undefined): string | undefined {
  if (typeof value !== 'string' || value.startsWith('data:') || value.includes('/')) return undefined
  const entry = Object.entries(CLASS_ICON_SVG_SOURCES).find(([path]) => path.endsWith(`/${value}`))
  return entry?.[1]
}

function resolveClassImage(value: IconType | string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined
  // Already a resolved asset (HeroClass.icon imported the file directly) - use as-is.
  if (value.startsWith('data:') || value.includes('/')) return value
  // Otherwise treat it as a bare filename and look it up in the glob.
  const entry = Object.entries(CLASS_ICON_IMAGES).find(([path]) => path.endsWith(`/${value}`))
  return entry?.[1]
}

function offsetTransform(offset: IconOffset | undefined): string {
  const { x = 0, y = 0, scale = 1 } = offset ?? {}
  return `translate(${x}%, ${y}%) scale(${scale})`
}

/** A species' offset for a given class: the per-class override if one exists, else the species default. */
function resolveOffset(
  defaultOffset: IconOffset | undefined,
  byClass: Record<string, IconOffset> | undefined,
  classId: string | undefined
): IconOffset | undefined {
  return (classId && byClass?.[classId]) || defaultOffset
}

/**
 * Renders a hero's class icon sandwiched between the species' background and
 * foreground icons - background sits literally behind the class icon (full
 * size, lower opacity), the class icon sits in the middle, and an optional
 * foreground icon renders on top.
 */
export function HeroIcon({
  classIcon,
  species,
  classId,
  boxSize = 6,
  color = 'orange.400',
  backgroundColor,
  foregroundColor,
  flexShrink = 0,
  ...rest
}: HeroIconProps) {
  const classSvgMarkup = resolveClassSvgMarkup(classIcon)
  const classImage = classSvgMarkup ? undefined : resolveClassImage(classIcon)
  const ClassIconComponent = (resolveClassComponent(classIcon) ?? GameIcons.GiSwordman) as IconType
  const speciesDef = species ? SPECIES_DEFINITIONS[species] : undefined
  const BackgroundIconComponent = resolveIcon(speciesDef?.backgroundIcon)
  const ForegroundIconComponent = resolveIcon(speciesDef?.foregroundIcon)
  const backgroundOffset = resolveOffset(speciesDef?.backgroundOffset, speciesDef?.backgroundOffsetsByClass, classId)
  const foregroundOffset = resolveOffset(speciesDef?.foregroundOffset, speciesDef?.foregroundOffsetsByClass, classId)

  backgroundColor = backgroundColor || color || 'orange.400'
  foregroundColor = foregroundColor || color || 'orange.400'

  return (
    <Box position="relative" display="inline-flex" boxSize={boxSize} flexShrink={flexShrink} {...rest}>
      {speciesDef?.backgroundImage ? (
        <Image
          src={speciesDef.backgroundImage}
          position="absolute"
          inset={0}
          boxSize="100%"
          objectFit="contain"
          zIndex={0}
          style={{ transform: offsetTransform(backgroundOffset) }}
        />
      ) : (
        BackgroundIconComponent && (
          <Icon
            as={BackgroundIconComponent}
            position="absolute"
            inset={0}
            boxSize="100%"
            color={backgroundColor}
            opacity={1}
            zIndex={0}
          />
        )
      )}
      {classSvgMarkup ? (
        <Box
          position="absolute"
          boxSize="80%"
          top="10%"
          left="10%"
          zIndex={1}
          color={color}
          sx={{ fill: 'currentColor', svg: { width: '100%', height: '100%', display: 'block' } }}
          dangerouslySetInnerHTML={{ __html: classSvgMarkup }}
        />
      ) : classImage ? (
        <Image
          src={classImage}
          position="absolute"
          boxSize="80%"
          top="10%"
          left="10%"
          objectFit="contain"
          zIndex={1}
        />
      ) : (
        <Icon
          as={ClassIconComponent}
          position="absolute"
          boxSize="80%"
          top="10%"
          left="10%"
          color={color}
          zIndex={1}
        />
      )}
      {speciesDef?.foregroundImage ? (
        <Image
          src={speciesDef.foregroundImage}
          position="absolute"
          inset={0}
          boxSize="100%"
          objectFit="contain"
          zIndex={2}
          style={{ transform: offsetTransform(foregroundOffset) }}
        />
      ) : (
        ForegroundIconComponent && (
          <Icon
            as={ForegroundIconComponent}
            position="absolute"
            inset={0}
            boxSize="100%"
            color={foregroundColor}
            zIndex={2}
          />
        )
      )}
    </Box>
  )
}

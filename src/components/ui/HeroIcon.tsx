import { Box, Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { IconType } from 'react-icons'
import type { HeroSpecies } from '@/types'
import { SPECIES_DEFINITIONS } from '@/data/heroes/species'

interface HeroIconProps {
  /** react-icons/gi name from HeroClass.icon */
  classIcon: string
  /** Species id - if present, its background/foreground icons are layered with the class icon */
  species?: HeroSpecies
  boxSize?: string | number
  color?: string
  backgroundColor?: string
  foregroundColor?: string
}

function resolveIcon(name: string | undefined): IconType | undefined {
  return name ? ((GameIcons as Record<string, IconType>)[name] as IconType | undefined) : undefined
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
  boxSize = 6,
  color = 'orange.400',
  backgroundColor = 'gray.500',
  foregroundColor = 'gray.300',
}: HeroIconProps) {
  const ClassIconComponent = (resolveIcon(classIcon) ?? GameIcons.GiSwordman) as IconType
  const speciesDef = species ? SPECIES_DEFINITIONS[species] : undefined
  const BackgroundIconComponent = resolveIcon(speciesDef?.backgroundIcon)
  const ForegroundIconComponent = resolveIcon(speciesDef?.foregroundIcon)

  return (
    <Box position="relative" display="inline-flex" boxSize={boxSize} flexShrink={0}>
      {BackgroundIconComponent && (
        <Icon
          as={BackgroundIconComponent}
          position="absolute"
          inset={0}
          boxSize="100%"
          color={backgroundColor}
          opacity={1}
          zIndex={0}
        />
      )}
      <Icon
        as={ClassIconComponent}
        position="absolute"
        boxSize="80%"
        top="10%"
        left="10%"
        color={color}
        zIndex={1}
      />
      {ForegroundIconComponent && (
        <Icon
          as={ForegroundIconComponent}
          position="absolute"
          inset={0}
          boxSize="100%"
          color={foregroundColor}
          zIndex={2}
        />
      )}
    </Box>
  )
}

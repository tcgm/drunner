/**
 * HeroName – inline display of a hero's name.
 * When the hero has been renamed (name ≠ class name) the class icon
 * is shown just before the name so the class is still identifiable.
 *
 * Usage (drop-in replacement for `{hero.name}` inside any Text):
 *   <Text fontWeight="bold"><HeroName hero={hero} /></Text>
 *   <Text>{hero.name}'s Equipment</Text>  →  <Text><HeroName hero={hero} />'s Equipment</Text>
 */
import { Icon } from '@chakra-ui/react'
import * as GameIcons from 'react-icons/gi'
import type { Hero } from '@/types'

interface HeroNameProps {
  hero: Hero
}

export function HeroName({ hero }: HeroNameProps) {
  const isRenamed = hero.name !== hero.class.name
  if (!isRenamed) return <>{hero.name}</>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman

  return (
    <>
      <Icon
        as={IconComponent}
        boxSize="0.9em"
        color="gray.400"
        opacity={0.8}
        verticalAlign="middle"
        mr="3px"
        flexShrink={0}
      />
      {hero.name}
    </>
  )
}

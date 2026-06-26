/**
 * HeroName – inline display of a hero's name.
 * When the hero has been renamed (name ≠ class name) the class icon
 * is shown just before the name so the class is still identifiable.
 *
 * Usage (drop-in replacement for `{hero.name}` inside any Text):
 *   <Text fontWeight="bold"><HeroName hero={hero} /></Text>
 *   <Text>{hero.name}'s Equipment</Text>  →  <Text><HeroName hero={hero} />'s Equipment</Text>
 */
import type { Hero } from '@/types'
import { HeroIcon } from '@/components/ui/HeroIcon'

interface HeroNameProps {
  hero: Hero
}

export function HeroName({ hero }: HeroNameProps) {
  const isRenamed = hero.name !== hero.class.name
  if (!isRenamed) return <>{hero.name}</>

  return (
    <>
      <HeroIcon
        classIcon={hero.class.icon}
        classId={hero.class.id}
        species={hero.species}
        boxSize="0.9em"
        color="gray.400"
      />
      {hero.name}
    </>
  )
}

import type { HeroClass } from '@/types'

// Auto-discover all hero class modules
const classModules = import.meta.glob<{ default?: HeroClass; [key: string]: unknown }>('./*.ts', { eager: true })

// Extract all exported HeroClass objects
const allClasses: HeroClass[] = Object.values(classModules)
  .filter(module => module !== undefined)
  .flatMap(module => 
    Object.values(module).filter((exp): exp is HeroClass => 
      exp !== null && 
      typeof exp === 'object' && 
      'name' in exp && 
      'baseStats' in exp
    )
  )

// Core classes (MVP) - automatically discovered
export const CORE_CLASSES: HeroClass[] = allClasses

// Stretch goal classes (to be added later) - will auto-discover when added
export const STRETCH_CLASSES: HeroClass[] = []

// All classes
export const ALL_CLASSES: HeroClass[] = [...CORE_CLASSES, ...STRETCH_CLASSES]

// Helper function to get a class by ID
export function getClassById(id: string): HeroClass | undefined {
  return ALL_CLASSES.find(c => c.id === id)
}

// Helper function to get a random class
export function getRandomClass(): HeroClass {
  return ALL_CLASSES[Math.floor(Math.random() * ALL_CLASSES.length)]
}

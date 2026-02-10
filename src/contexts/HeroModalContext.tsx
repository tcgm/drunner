import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Hero } from '@/types'
import HeroModal from '@/components/party/HeroModal'

interface HeroModalContextType {
  openHeroModal: (hero: Hero, isDungeon?: boolean) => void
  closeHeroModal: () => void
}

const HeroModalContext = createContext<HeroModalContextType | undefined>(undefined)

interface HeroModalProviderProps {
  children: ReactNode
}

export function HeroModalProvider({ children }: HeroModalProviderProps) {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [isDungeon, setIsDungeon] = useState(false)

  const openHeroModal = useCallback((hero: Hero, isDungeon = false) => {
    setSelectedHero(hero)
    setIsDungeon(isDungeon)
  }, [])

  const closeHeroModal = useCallback(() => {
    setSelectedHero(null)
    setIsDungeon(false)
  }, [])

  return (
    <HeroModalContext.Provider value={{ openHeroModal, closeHeroModal }}>
      {children}
      {selectedHero && (
        <HeroModal
          hero={selectedHero}
          isOpen={true}
          onClose={closeHeroModal}
          isDungeon={isDungeon}
        />
      )}
    </HeroModalContext.Provider>
  )
}

export function useHeroModal() {
  const context = useContext(HeroModalContext)
  if (!context) {
    throw new Error('useHeroModal must be used within HeroModalProvider')
  }
  return context
}

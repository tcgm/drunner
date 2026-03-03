import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Hero } from '@/types'
import HeroModal from '@/components/party/HeroModal'
import { useGameStore } from '@/core/gameStore'

// HMR: context identity must be stable — force full page reload when this module changes
if (import.meta.hot) {
  import.meta.hot.decline()
}

interface HeroModalContextType {
  openHeroModal: (hero: Hero, isDungeon?: boolean) => void
  closeHeroModal: () => void
}

const HeroModalContext = createContext<HeroModalContextType | undefined>(undefined)

interface HeroModalProviderProps {
  children: ReactNode
}

export function HeroModalProvider({ children }: HeroModalProviderProps) {
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const [isDungeon, setIsDungeon] = useState(false)

  // Derive the live hero from the store so equipment updates are reflected immediately
  const liveHero = useGameStore(useCallback(
    (state) => selectedHeroId
      ? (state.party.find(h => h?.id === selectedHeroId) ?? null)
      : null,
    [selectedHeroId]
  ))

  const openHeroModal = useCallback((hero: Hero, isDungeon = false) => {
    setSelectedHeroId(hero.id)
    setIsDungeon(isDungeon)
  }, [])

  const closeHeroModal = useCallback(() => {
    setSelectedHeroId(null)
    setIsDungeon(false)
  }, [])

  return (
    <HeroModalContext.Provider value={{ openHeroModal, closeHeroModal }}>
      {children}
      {liveHero && (
        <HeroModal
          hero={liveHero}
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

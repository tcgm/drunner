import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OrientationContextType {
  isPortrait: boolean
}

const OrientationContext = createContext<OrientationContextType | undefined>(undefined)

export function OrientationProvider({ children }: { children: ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(/*indow.innerWidth <= 768 &&*/ window.matchMedia('(orientation: portrait)').matches)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

  return (
    <OrientationContext.Provider value={{ isPortrait }}>
      {children}
    </OrientationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrientation() {
  const context = useContext(OrientationContext)
  if (context === undefined) {
    throw new Error('useOrientation must be used within an OrientationProvider')
  }
  return context
}

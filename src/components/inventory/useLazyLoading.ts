import { useState, useEffect } from 'react'

interface UseLazyLoadingProps {
  isOpen: boolean
  totalItems: number
  initialCount?: number
  batchSize?: number
  batchDelay?: number
}

export function useLazyLoading({
  isOpen,
  totalItems,
  initialCount = 20,
  batchSize = 100,
  batchDelay = 32
}: UseLazyLoadingProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount)

  // Reset on close, load progressively when open
  useEffect(() => {
    if (!isOpen) {
      const resetTimer = setTimeout(() => setVisibleCount(initialCount), 0)
      return () => clearTimeout(resetTimer)
    }
    
    if (visibleCount < totalItems) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + batchSize, totalItems))
      }, batchDelay)
      return () => clearTimeout(timer)
    }
  }, [isOpen, visibleCount, totalItems, initialCount, batchSize, batchDelay])

  return visibleCount
}

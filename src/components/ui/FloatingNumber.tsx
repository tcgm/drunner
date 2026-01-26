import { Box, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const MotionBox = motion.create(Box)

interface FloatingNumberProps {
  value: number
  type: 'damage' | 'heal' | 'xp' | 'gold'
  onComplete?: () => void
}

const TYPE_CONFIG = {
  damage: {
    color: '#f56565',
    prefix: '-',
    fontSize: 'xl',
    glow: '0 0 8px rgba(245, 101, 101, 0.8), 0 0 16px rgba(245, 101, 101, 0.4)'
  },
  heal: {
    color: '#48bb78',
    prefix: '+',
    fontSize: 'lg',
    glow: '0 0 8px rgba(72, 187, 120, 0.8), 0 0 16px rgba(72, 187, 120, 0.4)'
  },
  xp: {
    color: '#38bdf8',
    prefix: '+',
    fontSize: 'md',
    glow: '0 0 6px rgba(56, 189, 248, 0.8)'
  },
  gold: {
    color: '#f6e05e',
    prefix: '+',
    fontSize: 'md',
    glow: '0 0 6px rgba(246, 224, 94, 0.8)'
  }
}

export function FloatingNumber({ value, type, onComplete }: FloatingNumberProps) {
  const config = TYPE_CONFIG[type]
  const [randomX] = useState(() => (Math.random() - 0.5) * 30) // Random horizontal drift
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])
  
  return (
    <MotionBox
      position="absolute"
      top="50%"
      left="50%"
      pointerEvents="none"
      zIndex={1000}
      initial={{ 
        opacity: 0, 
        y: 0,
        x: '-50%',
        scale: 0.3
      }}
      animate={{ 
        opacity: [0, 1, 1, 0.8, 0],
        y: -80,
        x: `calc(-50% + ${randomX}px)`,
        scale: [0.3, 1.3, 1, 0.95, 0.8]
      }}
      exit={{ 
        opacity: 0,
        scale: 0.5
      }}
      transition={{
        duration: 1.5,
        ease: [0.34, 1.56, 0.64, 1], // Custom easing curve for bounce
        opacity: {
          times: [0, 0.1, 0.5, 0.8, 1],
          ease: "easeOut"
        },
        scale: {
          times: [0, 0.15, 0.3, 0.6, 1],
          ease: "easeOut"
        }
      }}
    >
      <Text
        fontSize={config.fontSize}
        fontWeight="black"
        color={config.color}
        textShadow={`${config.glow}, 0 2px 6px rgba(0,0,0,0.9), 0 0 2px black, 2px 0 2px black, -2px 0 2px black, 0 2px 2px black, 0 -2px 2px black`}
        userSelect="none"
        style={{
          WebkitTextStroke: '1px rgba(0,0,0,0.8)',
        }}
      >
        {config.prefix}{Math.abs(value)}
      </Text>
    </MotionBox>
  )
}

import { Box, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

const MotionBox = motion.create(Box)

interface FloatingNumberProps {
  value: number
  type: 'damage' | 'heal' | 'xp' | 'gold'
  isVisible: boolean
  delay?: number
}

const TYPE_CONFIG = {
  damage: {
    color: '#f56565',
    prefix: '-',
    fontSize: 'xl'
  },
  heal: {
    color: '#48bb78',
    prefix: '+',
    fontSize: 'lg'
  },
  xp: {
    color: '#9f7aea',
    prefix: '+',
    fontSize: 'md'
  },
  gold: {
    color: '#f6e05e',
    prefix: '+',
    fontSize: 'md'
  }
}

export function FloatingNumber({ value, type, isVisible, delay = 0 }: FloatingNumberProps) {
  const config = TYPE_CONFIG[type]
  
  return (
    <AnimatePresence>
      {isVisible && (
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
            scale: 0.5
          }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            y: -60,
            scale: [0.5, 1.2, 1, 0.8]
          }}
          exit={{ 
            opacity: 0,
            scale: 0.5
          }}
          transition={{
            duration: 1.5,
            delay,
            ease: "easeOut"
          }}
        >
          <Text
            fontSize={config.fontSize}
            fontWeight="bold"
            color={config.color}
            textShadow={`0 0 8px ${config.color}, 0 2px 4px rgba(0,0,0,0.8)`}
            userSelect="none"
          >
            {config.prefix}{Math.abs(value)}
          </Text>
        </MotionBox>
      )}
    </AnimatePresence>
  )
}

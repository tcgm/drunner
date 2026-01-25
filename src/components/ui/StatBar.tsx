import { Box, HStack, Text, Progress } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MotionBox = motion.create(Box)

interface StatBarProps {
  label: string
  current: number
  max: number
  colorScheme?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showValues?: boolean
  valueSize?: string
}

export default function StatBar({ 
  label, 
  current, 
  max, 
  colorScheme, 
  size = 'xs',
  showValues = true,
  valueSize = '2xs'
}: StatBarProps) {
  const [displayValue, setDisplayValue] = useState(current)
  const [prevValue, setPrevValue] = useState(current)
  const percent = (current / max) * 100
  
  // Animate health changes
  useEffect(() => {
    if (current !== prevValue) {
      const startValue = displayValue
      const endValue = current
      const duration = 500 // ms
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const newValue = Math.round(startValue + (endValue - startValue) * easeProgress)
        
        setDisplayValue(newValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setPrevValue(current)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [current, prevValue, displayValue])
  
  // Auto-determine color scheme based on percentage if not provided
  const getColorScheme = () => {
    if (colorScheme) return colorScheme
    if (percent > 50) return 'green'
    if (percent > 25) return 'yellow'
    return 'red'
  }

  const isHealing = current > prevValue
  const isDamaged = current < prevValue

  return (
    <MotionBox
      animate={{
        scale: isHealing ? [1, 1.03, 1] : isDamaged ? [1, 0.97, 1] : 1
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <MotionBox
        position="relative"
        overflow="hidden"
        animate={{
          boxShadow: isHealing 
            ? ['0 0 0px rgba(72, 187, 120, 0)', '0 0 8px rgba(72, 187, 120, 0.6)', '0 0 0px rgba(72, 187, 120, 0)']
            : isDamaged
            ? ['0 0 0px rgba(245, 101, 101, 0)', '0 0 8px rgba(245, 101, 101, 0.6)', '0 0 0px rgba(245, 101, 101, 0)']
            : undefined
        }}
        transition={{
          duration: 0.5
        }}
      >
        <Progress 
          value={percent} 
          size={size}
          colorScheme={getColorScheme()}
          borderRadius="full"
          bg="gray.700"
          sx={{
            '& > div': {
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }
          }}
        />
      </MotionBox>
      {showValues && (
        <HStack justify="space-between" mt={0.5}>
          <Text fontSize={valueSize} color="gray.500">{label}</Text>
          <MotionBox
            key={displayValue}
            initial={current !== prevValue ? { scale: 1.2, color: isHealing ? '#48bb78' : '#f56565' } : false}
            animate={{ scale: 1, color: '#A0AEC0' }}
            transition={{ duration: 0.3 }}
          >
            <Text fontSize={valueSize} color="gray.400">
              {displayValue}/{max}
            </Text>
          </MotionBox>
        </HStack>
      )}
    </MotionBox>
  )
}

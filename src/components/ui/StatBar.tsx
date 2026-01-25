import { Box, HStack, Text, Progress } from '@chakra-ui/react'

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
  const percent = (current / max) * 100
  
  // Auto-determine color scheme based on percentage if not provided
  const getColorScheme = () => {
    if (colorScheme) return colorScheme
    if (percent > 50) return 'green'
    if (percent > 25) return 'yellow'
    return 'red'
  }

  return (
    <Box>
      <Progress 
        value={percent} 
        size={size}
        colorScheme={getColorScheme()}
        borderRadius="full"
        bg="gray.700"
      />
      {showValues && (
        <HStack justify="space-between" mt={0.5}>
          <Text fontSize={valueSize} color="gray.500">{label}</Text>
          <Text fontSize={valueSize} color="gray.400">
            {current}/{max}
          </Text>
        </HStack>
      )}
    </Box>
  )
}

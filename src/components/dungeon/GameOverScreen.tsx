import { Button, Flex, Box, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useGameStore } from '@/core/gameStore'
import { GiCastle } from 'react-icons/gi'
import RunStatistics from './RunStatistics'
import PartyDisplay from './PartyDisplay'
import DefeatHeader from './DefeatHeader'
import DeathDetails from './DeathDetails'
import DeathPenalty from './DeathPenalty'

interface GameOverScreenProps {
  floor: number
  depth: number
  onExit: () => void
}

export default function GameOverScreen({ floor, depth, onExit }: GameOverScreenProps) {
  const { party, activeRun, endGame } = useGameStore()
  
  // Use finalFloor from activeRun if available, otherwise fall back to floor prop
  const displayFloor = activeRun?.finalFloor ?? floor
  
  // End the run when the game over screen is shown
  useEffect(() => {
    endGame()
  }, [endGame])

  return (
    <Box 
      className="game-over-screen" 
      h="100vh" 
      w="100vw" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      overflow="hidden"
      bgGradient="linear(to-b, gray.900, gray.800, gray.900)"
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgImage: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.03), transparent 50%)',
        pointerEvents: 'none',
      }}
    >
      {/* Decorative corner elements */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="200px"
        height="200px"
        borderLeft="3px solid"
        borderTop="3px solid"
        borderColor="red.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderLeft: '2px solid',
          borderTop: '2px solid',
          borderColor: 'red.400',
        }}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        width="200px"
        height="200px"
        borderRight="3px solid"
        borderTop="3px solid"
        borderColor="red.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderRight: '2px solid',
          borderTop: '2px solid',
          borderColor: 'red.400',
        }}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        width="200px"
        height="200px"
        borderLeft="3px solid"
        borderBottom="3px solid"
        borderColor="red.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          borderLeft: '2px solid',
          borderBottom: '2px solid',
          borderColor: 'red.400',
        }}
      />
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="200px"
        height="200px"
        borderRight="3px solid"
        borderBottom="3px solid"
        borderColor="red.500"
        opacity={0.3}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          borderRight: '2px solid',
          borderBottom: '2px solid',
          borderColor: 'red.400',
        }}
      />

      <Flex 
        direction="row"
        gap={8} 
        maxW="1800px" 
        w="full"
        h="full"
        align="stretch"
        p={8}
        position="relative"
        zIndex={1}
      >
        {/* Left Column - Statistics & Death Details */}
        <Flex flex={1} direction="column" minW="0" gap={6} overflowY="auto">
          <RunStatistics run={activeRun} />
          <DeathDetails deathDetails={activeRun?.deathDetails} />
        </Flex>

        {/* Center Column - Defeat Header & Button */}
        <Flex flex={1} direction="column" justify="center" align="center" gap={8}>
          <DefeatHeader floor={displayFloor} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              size="lg"
              colorScheme="orange"
              height="60px"
              px={12}
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
              onClick={onExit}
              boxShadow="0 0 15px rgba(251, 146, 60, 0.4)"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 0 25px rgba(251, 146, 60, 0.6)',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={GiCastle} boxSize={6} />}
            >
              Return to Main Menu
            </Button>
          </motion.div>
        </Flex>

        {/* Right Column - Party & Penalty */}
        <Flex flex={1} direction="column" minW="0" gap={6} overflowY="auto">
          <PartyDisplay party={party} run={activeRun} />
          <DeathPenalty party={party} run={activeRun} />
        </Flex>
      </Flex>
    </Box>
  )
}

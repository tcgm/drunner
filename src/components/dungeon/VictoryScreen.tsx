import { Button, Flex, Box, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useGameStore } from '@/core/gameStore'
import { GiCastle } from 'react-icons/gi'
import RunStatistics from './RunStatistics'
import PartyDisplay from './PartyDisplay'
import VictoryHeader from './VictoryHeader'

interface VictoryScreenProps {
  depth: number
  onExit: () => void
}

export default function VictoryScreen({ depth, onExit }: VictoryScreenProps) {
  const { party, activeRun, victoryGame, dungeon } = useGameStore()
  
  // Trigger victory when the screen is shown
  useEffect(() => {
    victoryGame()
  }, [victoryGame])

  return (
    <Box 
      className="victory-screen" 
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
        bgImage: 'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.03), transparent 50%)',
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
        borderColor="yellow.500"
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
          borderColor: 'yellow.400',
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
        borderColor="yellow.500"
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
          borderColor: 'yellow.400',
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
        borderColor="yellow.500"
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
          borderColor: 'yellow.400',
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
        borderColor="yellow.500"
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
          borderColor: 'yellow.400',
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
        {/* Left Column - Statistics */}
        <Flex flex={1} direction="column" minW="0">
          <RunStatistics run={activeRun} />
        </Flex>

        {/* Center Column - Victory Header & Button */}
        <Flex flex={1} direction="column" justify="center" align="center" gap={8}>
          <VictoryHeader floor={dungeon.floor - 1} depth={depth} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              size="lg"
              colorScheme="yellow"
              height="60px"
              px={12}
              fontSize="xl"
              fontWeight="bold"
              letterSpacing="wide"
              onClick={onExit}
              boxShadow="0 0 15px rgba(250, 204, 21, 0.4)"
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 0 25px rgba(250, 204, 21, 0.6)',
              }}
              transition="all 0.2s"
              leftIcon={<Icon as={GiCastle} boxSize={6} />}
            >
              Return to Town
            </Button>
          </motion.div>
        </Flex>

        {/* Right Column - Party */}
        <Flex flex={1} direction="column" minW="0">
          <PartyDisplay party={party} run={activeRun} />
        </Flex>
      </Flex>
    </Box>
  )
}

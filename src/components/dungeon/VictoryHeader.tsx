import { VStack, Heading, Text, Icon, Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { GiTrophyCup, GiCrossedSwords, GiLaurelCrown } from 'react-icons/gi'

interface VictoryHeaderProps {
  floor: number
  depth: number
}

export default function VictoryHeader({ floor, depth }: VictoryHeaderProps) {
  return (
    <VStack spacing={6} align="center">
      {/* Backdrop icon */}
      <Box position="relative">
        <Icon 
          as={GiCrossedSwords} 
          boxSize={40} 
          color="yellow.500"
          opacity={0.1}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          filter="blur(2px)"
          zIndex={0}
        />
        
        {/* Side decorative laurels */}
        <Icon 
          as={GiLaurelCrown} 
          boxSize={12} 
          color="yellow.400"
          opacity={0.6}
          position="absolute"
          top="50%"
          left="-70px"
          transform="translateY(-50%) rotate(-30deg)"
          filter="drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))"
        />
        <Icon 
          as={GiLaurelCrown} 
          boxSize={12} 
          color="yellow.400"
          opacity={0.6}
          position="absolute"
          top="50%"
          right="-70px"
          transform="translateY(-50%) rotate(30deg) scaleX(-1)"
          filter="drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))"
        />
        
        {/* Main bobbing trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            y: [0, -12, 0]
          }}
          transition={{
            scale: { type: "spring", stiffness: 200, damping: 20 },
            rotate: { duration: 0.6 },
            y: { 
              duration: 2.5, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        >
          <Icon 
            as={GiTrophyCup} 
            boxSize={24} 
            color="yellow.400" 
            filter="drop-shadow(0 0 20px rgba(250, 204, 21, 0.6))"
            position="relative"
            zIndex={1}
          />
        </motion.div>
      </Box>
      
      <Heading 
        size="4xl" 
        color="yellow.400"
        textShadow="0 0 20px rgba(250, 204, 21, 0.5), 0 0 40px rgba(250, 204, 21, 0.3)"
        letterSpacing="wider"
        textTransform="uppercase"
      >
        Victory!
      </Heading>
      
      <Box 
        width="clamp(200px, 30vw, 350px)" 
        height="clamp(1px, 0.2vh, 3px)" 
        bgGradient="linear(to-r, transparent, yellow.500, transparent)" 
      />
      
      <Text 
        color="gray.200" 
        fontSize="xl" 
        textAlign="center"
        letterSpacing="wide"
        maxW="clamp(300px, 40vw, 450px)"
      >
        You have conquered the dungeon and defeated the Dungeon Lord!
      </Text>
      
      <Text 
        color="green.400" 
        fontSize="2xl" 
        fontWeight="bold"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        Floor {floor} Complete
      </Text>
    </VStack>
  )
}

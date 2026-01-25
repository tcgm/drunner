import { Box, HStack, VStack, Text, Icon, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Hero } from '@/types'
import * as GameIcons from 'react-icons/gi'
import HeroModal from './HeroModal'
import HeroTooltip from './HeroTooltip'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'

const MotionBox = motion.create(Box)

interface PartyMemberCardProps {
  hero: Hero
}

export default function PartyMemberCard({ hero }: PartyMemberCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  
  return (
    <>
      <HeroTooltip hero={hero}>
        <MotionBox
          bg="gray.900"
          borderRadius="md"
          borderWidth="2px"
          borderColor={isHovered ? 'orange.500' : hero.isAlive ? 'gray.700' : 'red.600'}
          opacity={hero.isAlive ? 1 : 0.5}
          cursor="pointer"
          onClick={onOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ 
            x: 4,
            boxShadow: hero.isAlive ? '0 0 12px rgba(237, 137, 54, 0.4)' : '0 0 12px rgba(245, 101, 101, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20
          }}
        >
          <HStack spacing={2} p={2}>
            <motion.div
              animate={isHovered ? {
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              <Icon as={IconComponent} boxSize={8} color="orange.400" flexShrink={0} />
            </motion.div>
            
            <VStack spacing={1} align="stretch" flex={1} minW={0}>
              <HStack spacing={2}>
                <Text fontWeight="bold" fontSize="xs" noOfLines={1} flex={1}>
                  {hero.name}
                </Text>
                <Text fontSize="xs" color="orange.300" flexShrink={0}>
                  Lv{hero.level}
                </Text>
              </HStack>
              
              <StatBar 
                label="HP"
                current={hero.stats.hp}
                max={hero.stats.maxHp}
              />
              
              <StatBar 
                label="XP"
                current={hero.xp}
                max={calculateXpForLevel(hero.level)}
              />
            </VStack>
          </HStack>
        </MotionBox>
      </HeroTooltip>

      <HeroModal hero={hero} isOpen={isOpen} onClose={onClose} />
    </>
  )
}


import { Box, HStack, VStack, Text, Icon, useDisclosure, Tooltip } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Hero, Item } from '@/types'
import * as GameIcons from 'react-icons/gi'
import HeroModal from './HeroModal'
import HeroTooltip from './HeroTooltip'
import StatBar from '@components/ui/StatBar'
import { calculateXpForLevel } from '@utils/heroUtils'
import { FloatingNumber } from '@components/ui/FloatingNumber'

// Rarity color mapping
const RARITY_COLORS: Record<string, string> = {
  common: 'gray.500',
  uncommon: 'green.400',
  rare: 'blue.400',
  epic: 'purple.400',
  legendary: 'orange.400',
  mythic: 'red.400'
}

const MotionBox = motion.create(Box)

interface PartyMemberCardProps {
  hero: Hero
  floatingEffects?: Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>
}

export default function PartyMemberCard({ hero, floatingEffects = [] }: PartyMemberCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovered, setIsHovered] = useState(false)
  const [activeEffects, setActiveEffects] = useState<Array<{ type: 'damage' | 'heal' | 'xp' | 'gold'; value: number; id: string }>>([])
  
  // Update active effects when new ones come in
  useEffect(() => {
    if (floatingEffects.length > 0) {
      setActiveEffects(prev => [...prev, ...floatingEffects])
    }
  }, [floatingEffects])
  
  const handleEffectComplete = (id: string) => {
    setActiveEffects(prev => prev.filter(effect => effect.id !== id))
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (GameIcons as any)[hero.class.icon] || GameIcons.GiSwordman
  
  return (
    <>
      <HeroTooltip hero={hero}>
        <MotionBox
          position="relative"
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
          {/* Floating Numbers */}
          <AnimatePresence>
            {activeEffects.map((effect) => (
              <FloatingNumber
                key={effect.id}
                value={effect.value}
                type={effect.type}
                onComplete={() => handleEffectComplete(effect.id)}
              />
            ))}
          </AnimatePresence>

          <HStack spacing={2} p={2}
            onClick={onOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            cursor="pointer"
          >
            <HStack spacing={1}>
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
              
              {/* Equipment pips */}
              <VStack spacing={0.5} align="start">
                {Object.values(hero.equipment || {}).filter((item): item is Item => item !== null).map((item, idx) => (
                  <Tooltip key={idx} label={item.name} fontSize="xs" placement="right">
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={RARITY_COLORS[item.rarity] || 'gray.500'}
                      boxShadow={`0 0 4px ${RARITY_COLORS[item.rarity] || 'gray.500'}`}
                    />
                  </Tooltip>
                ))}
              </VStack>
            </HStack>
            
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
                colorScheme="green"
              />
              
              <StatBar 
                label="XP"
                current={hero.xp}
                max={calculateXpForLevel(hero.level)}
                colorScheme="cyan"
              />
            </VStack>
          </HStack>
        </MotionBox>
      </HeroTooltip>

      <HeroModal hero={hero} isOpen={isOpen} onClose={onClose} />
    </>
  )
}


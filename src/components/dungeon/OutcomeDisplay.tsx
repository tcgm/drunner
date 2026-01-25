import { Box, VStack, Text, Button, HStack, Icon, Divider } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { GiChest, GiHearts, GiSwordWound, GiCoins, GiLevelFourAdvanced, GiAngelWings } from 'react-icons/gi'
import type { ResolvedOutcome } from '@systems/events/eventResolver'

const MotionBox = motion.create(Box)
const MotionHStack = motion.create(HStack)

interface OutcomeDisplayProps {
  outcome: ResolvedOutcome
  onContinue: () => void
}

const EFFECT_ICONS = {
  damage: GiSwordWound,
  heal: GiHearts,
  xp: GiLevelFourAdvanced,
  gold: GiCoins,
  item: GiChest,
  status: GiLevelFourAdvanced,
  revive: GiAngelWings,
}

const EFFECT_COLORS = {
  damage: 'red.400',
  heal: 'green.400',
  xp: 'purple.400',
  gold: 'yellow.400',
  item: 'blue.400',
  status: 'cyan.400',
  revive: 'cyan.300',
}

export default function OutcomeDisplay({ outcome, onContinue }: OutcomeDisplayProps) {
  const [visibleEffects, setVisibleEffects] = useState<number[]>([])
  
  useEffect(() => {
    // Stagger effect animations
    outcome.effects.forEach((_, index) => {
      setTimeout(() => {
        setVisibleEffects(prev => [...prev, index])
      }, index * 100)
    })
  }, [outcome.effects])

  return (
    <VStack spacing={4} align="stretch" h="full">
      {/* Outcome Text */}
      <MotionBox
        bg="gray.800"
        borderRadius="lg"
        p={2}
        borderLeft="4px solid"
        borderColor="orange.400"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <Text fontSize="md" color="white.200" lineHeight="short">
          {outcome.text}
        </Text>
      </MotionBox>

      {/* Effects */}
      {outcome.effects.length > 0 && (
        <VStack spacing={1} align="stretch" flex={1} overflowY="auto" overflowX="hidden">
          <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
            Results
          </Text>
          <AnimatePresence mode="popLayout">
            {outcome.effects.map((effect, index) => (
              <MotionHStack
                key={index}
                bg="gray.800"
                borderRadius="md"
                p={2}
                spacing={3}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={visibleEffects.includes(index) ? { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0 
                } : {}}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05
                }}
                whileHover={{
                  boxShadow: `0 0 12px ${EFFECT_COLORS[effect.type]}40`,
                  backgroundColor: 'rgba(45, 55, 72, 0.8)'
                }}
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={visibleEffects.includes(index) ? { 
                    rotate: 0, 
                    scale: 1 
                  } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.05 + 0.1
                  }}
                >
                  <Icon
                    as={EFFECT_ICONS[effect.type]}
                    boxSize={5}
                    color={EFFECT_COLORS[effect.type]}
                  />
                </motion.div>
                <VStack align="start" spacing={0} flex={1}>
                  <Text color="gray.300" fontSize="sm">
                    {effect.description}
                  </Text>
                  {effect.item && (
                    <Text color="gray.500" fontSize="xs">
                      {effect.item.description}
                    </Text>
                  )}
                </VStack>
              </MotionHStack>
            ))}
          </AnimatePresence>
        </VStack>
      )}

      <Divider borderColor="gray.700" />

      {/* Continue Button */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: outcome.effects.length * 0.05 + 0.3
        }}
      >
        <Button
          size="md"
          colorScheme="orange"
          onClick={onContinue}
          alignSelf="center"
          px={8}
          w="full"
        >
          Continue
        </Button>
      </MotionBox>
    </VStack>
  )
}

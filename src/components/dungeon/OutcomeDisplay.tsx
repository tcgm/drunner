import { Box, VStack, Text, Button, HStack, Icon, Divider } from '@chakra-ui/react'
import { GiChest, GiHearts, GiSwordWound, GiCoins, GiLevelFourAdvanced } from 'react-icons/gi'
import type { ResolvedOutcome } from '@systems/events/eventResolver'

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
}

const EFFECT_COLORS = {
  damage: 'red.400',
  heal: 'green.400',
  xp: 'purple.400',
  gold: 'yellow.400',
  item: 'blue.400',
  status: 'cyan.400',
}

export default function OutcomeDisplay({ outcome, onContinue }: OutcomeDisplayProps) {
  return (
    <VStack spacing={6} align="stretch" flex={1}>
      {/* Outcome Text */}
      <Box
        bg="gray.800"
        borderRadius="lg"
        p={6}
        borderLeft="4px solid"
        borderColor="orange.400"
      >
        <Text fontSize="lg" color="gray.200" lineHeight="tall">
          {outcome.text}
        </Text>
      </Box>

      {/* Effects */}
      {outcome.effects.length > 0 && (
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" color="gray.500" textTransform="uppercase" fontWeight="bold">
            Results
          </Text>
          {outcome.effects.map((effect, index) => (
            <HStack
              key={index}
              bg="gray.800"
              borderRadius="md"
              p={4}
              spacing={4}
            >
              <Icon
                as={EFFECT_ICONS[effect.type]}
                boxSize={6}
                color={EFFECT_COLORS[effect.type]}
              />
              <VStack align="start" spacing={0} flex={1}>
                <Text color="gray.300" fontSize="md">
                  {effect.description}
                </Text>
                {effect.item && (
                  <Text color="gray.500" fontSize="sm">
                    {effect.item.description}
                  </Text>
                )}
              </VStack>
            </HStack>
          ))}
        </VStack>
      )}

      <Divider borderColor="gray.700" />

      {/* Continue Button */}
      <Button
        size="lg"
        colorScheme="orange"
        onClick={onContinue}
        alignSelf="center"
        px={12}
        fontSize="lg"
      >
        Continue
      </Button>
    </VStack>
  )
}

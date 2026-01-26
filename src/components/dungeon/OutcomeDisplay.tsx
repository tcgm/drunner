import { Box, VStack, Text, Button, HStack, Icon, Divider } from '@chakra-ui/react'
import { GiChest, GiHearts, GiSwordWound, GiCoins, GiLevelFourAdvanced, GiAngelWings } from 'react-icons/gi'
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
  return (
    <VStack spacing={4} align="stretch" h="full">
      {/* Outcome Text */}
      <Box
        bg="gray.800"
        borderRadius="lg"
        p={4}
        borderLeft="4px solid"
        borderColor="orange.400"
      >
        <Text fontSize="md" color="gray.200" lineHeight="short">
          {outcome.text}
        </Text>
      </Box>

      {/* Effects */}
      {outcome.effects.length > 0 && (
        <VStack spacing={2} align="stretch" flex={1} overflowY="auto">
          <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">
            Results
          </Text>
          {outcome.effects.map((effect, index) => (
            <HStack
              key={index}
              bg="gray.800"
              borderRadius="md"
              p={3}
              spacing={3}
            >
              <Icon
                as={EFFECT_ICONS[effect.type]}
                boxSize={5}
                color={EFFECT_COLORS[effect.type]}
              />
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
            </HStack>
          ))}
        </VStack>
      )}

      <Divider borderColor="gray.700" />

      {/* Continue Button */}
      <Button
        size="md"
        colorScheme="orange"
        onClick={onContinue}
        alignSelf="center"
        px={8}
      >
        Continue
      </Button>
    </VStack>
  )
}

import { VStack, Button, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint } from 'react-icons/gi'

interface ContinuePromptProps {
  onContinue: () => void
}

export default function ContinuePrompt({ onContinue }: ContinuePromptProps) {
  return (
    <VStack spacing={6} flex={1} justify="center">
      <Icon as={GiFootprint} boxSize={20} color="orange.400" />
      <Text color="gray.300" fontSize="xl" fontWeight="semibold">
        The path ahead awaits...
      </Text>
      <Button 
        size="lg"
        colorScheme="orange"
        leftIcon={<Icon as={GiFootprint} />}
        onClick={onContinue}
      >
        Continue Deeper
      </Button>
    </VStack>
  )
}

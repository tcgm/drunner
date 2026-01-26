import { VStack, Button, Text } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { GiFootprint } from 'react-icons/gi'

interface ContinuePromptProps {
  onContinue: () => void
}

export default function ContinuePrompt({ onContinue }: ContinuePromptProps) {
  return (
    <VStack className="continue-prompt" spacing={4} flex={1} justify="center">
      <Icon as={GiFootprint} boxSize={16} color="orange.400" />
      <Text color="gray.300" fontSize="lg" fontWeight="semibold">
        The path ahead awaits...
      </Text>
      <Button 
        size="md"
        colorScheme="orange"
        leftIcon={<Icon as={GiFootprint} />}
        onClick={onContinue}
      >
        Continue Deeper
      </Button>
    </VStack>
  )
}

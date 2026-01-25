import { VStack, Heading, Button, HStack } from '@chakra-ui/react'

interface PartySetupScreenProps {
  onStart: () => void
  onBack: () => void
}

export default function PartySetupScreen({ onStart, onBack }: PartySetupScreenProps) {
  return (
    <VStack spacing={8}>
      <Heading size="xl">Create Your Party</Heading>
      <VStack spacing={4}>
        {/* TODO: Add hero selection UI */}
        <Heading size="md" color="gray.500">
          Party Setup Coming Soon...
        </Heading>
      </VStack>
      <HStack spacing={4}>
        <Button colorScheme="gray" onClick={onBack}>
          Back
        </Button>
        <Button colorScheme="orange" onClick={onStart}>
          Start Adventure
        </Button>
      </HStack>
    </VStack>
  )
}
